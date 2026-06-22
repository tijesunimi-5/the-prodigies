"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // FIXED: Correctly import the App Router navigation hook
import fpjs from "@fingerprintjs/fingerprintjs";
import { ShieldCheck, Loader2, User, Mail } from "lucide-react";
import Navbar from "@/components/NavBar";

export default function VoteRegisterPage() {
  const router = useRouter(); // FIXED: Instantiate the navigation driver
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [clockState, setClockState] = useState({ status: "not_started", secondsLeft: 0, canVote: false, voteCountdown: 0 });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    // 1. Compute un-clearable hardware device fingerprint visitor id string block
    const initFingerprint = async () => {
      try {
        const fp = await fpjs.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (e) {
        console.error("Hardware fingerprint load error:", e);
      }
    };
    initFingerprint();

    // 2. Fetch countdown layout parameters from database clock state
    const checkClock = async () => {
      const res = await fetch("/api/admin/voting-clock");
      if (res.ok) {
        const data = await res.json();
        setClockState(data);
      }
    };
    checkClock();
    const interval = setInterval(checkClock, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fingerprint) {
      alert("Hardware scanning pending. Please check browser privacy blocks or reload.");
      return;
    }
    setFormSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/voter-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, deviceFingerprint: fingerprint })
      });
      const data = await res.json();

      if (res.ok) {
        // Log the local user session data matching your applicationauth rules
        localStorage.setItem("prodigy_user_session", JSON.stringify({ email: email.toLowerCase().trim(), name: fullName.trim() }));

        setMessage({ text: "Success! Your dedicated Voter Pass has been permanently verified and logged. Redirecting to ballot...", isError: false });
        setFullName("");
        setEmail("");

        // FIXED: Added an automated 2-second timeout delay to push them securely to the awards page layout
        setTimeout(() => {
          router.push("/vote");
        }, 2000);
      } else {
        setMessage({ text: data.error || "Voter pass registration hit an unexpected constraint.", isError: true });
      }
    } catch (err) {
      setMessage({ text: "Network pipeline failure connecting to voter database.", isError: true });
    } finally {
      setFormSubmitting(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-6 text-[#3B2A26]">
      <Navbar />
      <div className="max-w-md mx-auto bg-white/40 backdrop-blur-md border border-[#3B2A26]/5 rounded-sm p-8 shadow-xl mt-12">
        <header className="text-center mb-8">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#D4AF37]">Official Revote Registry</span>
          <h1 className="text-3xl font-serif mt-1 font-bold">Secure Your Pass</h1>
        </header>

        {/* Live System Countdown Header */}
        <div className="mb-8 p-4 bg-[#3B2A26] text-[#F5E9DA] rounded-sm text-center font-mono">
          {clockState.status === "not_started" ? (
            <p className="text-xs uppercase tracking-wider animate-pulse text-amber-400 font-bold">Awaiting Live Sign-off From Admin...</p>
          ) : clockState.secondsLeft > 0 ? (
            <div>
              <p className="text-2xl font-bold tracking-widest text-[#D4AF37]">{formatTime(clockState.secondsLeft)}</p>
              <p className="text-[9px] uppercase opacity-60 mt-1 tracking-wider">Registration Window Closing</p>
            </div>
          ) : (
            <p className="text-xs uppercase text-red-400 font-black tracking-widest">Registration Portal Expired / Closed</p>
          )}
        </div>

        {clockState.status === "registration_open" ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative border-b border-[#3B2A26]/20 focus-within:border-[#D4AF37] transition-colors py-1.5 flex items-center gap-3">
              <User size={16} className="text-[#3B2A26]/40" />
              <input required type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-transparent outline-none text-sm font-sans" />
            </div>

            <div className="relative border-b border-[#3B2A26]/20 focus-within:border-[#D4AF37] transition-colors py-1.5 flex items-center gap-3">
              <Mail size={16} className="text-[#3B2A26]/40" />
              <input required type="email" placeholder="Primary Gmail Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none text-sm font-sans" />
            </div>

            {message && (
              <p className={`text-xs font-bold font-sans tracking-wide p-3 rounded-sm ${message.isError ? "bg-red-50 border border-red-200 text-red-800" : "bg-green-50 border border-green-200 text-green-800"}`}>{message.text}</p>
            )}

            <button type="submit" disabled={formSubmitting} className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40">
              {formSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><ShieldCheck size={14} /> Validate My Device pass</>}
            </button>
          </form>
        ) : (
          <div className="text-center py-6 opacity-60 font-sans text-sm italic">
            {clockState.status === "not_started" ? "The registration gate will go active soon." : "Voter registrations can no longer be processed on this server."}
          </div>
        )}
      </div>
    </main>
  );
}