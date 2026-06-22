"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/NavBar";

export default function StrictLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/secure-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        // Restore local storage session parameters to unlock the main page checks
        localStorage.setItem("prodigy_user_session", JSON.stringify({
          email: data.email,
          name: data.name
        }));

        setSuccessMessage(`Authenticated successfully! Welcome back, ${data.name}.`);

        setTimeout(() => {
          router.push("/vote");
        }, 1200);
      } else {
        setErrorMessage(data.error || "Authentication failed.");
      }
    } catch (err) {
      setErrorMessage("Network connection pipeline error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-36 pb-20 px-6 text-[#3B2A26]">
      <Navbar />
      <div className="max-w-md mx-auto bg-white/40 backdrop-blur-md border border-[#3B2A26]/5 rounded-sm p-8 shadow-xl">
        <header className="text-center mb-8">
          <KeyRound size={36} className="mx-auto text-[#D4AF37] mb-2" />
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#D4AF37]">Identity Check</span>
          <h1 className="text-3xl font-serif mt-1 font-bold">Voter Login Station</h1>
          <p className="text-xs text-[#3B2A26]/60 mt-2">Type your exact registered Gmail address to recover your live voting card.</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative border-b border-[#3B2A26]/20 focus-within:border-[#D4AF37] transition-colors py-2 flex items-center justify-center">
            <input
              required
              type="email"
              placeholder="Your Registered Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-center font-mono"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-bold text-center text-red-800 bg-red-50 border border-red-200 p-3 rounded-sm">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-xs font-bold text-center text-green-800 bg-green-50 border border-green-200 p-3 rounded-sm flex items-center justify-center gap-2">
              <ShieldCheck size={14} /> {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase tracking-[0.4em] font-black hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <><ArrowRight size={14} /> Unlock My Ballot Box</>}
          </button> -
        </form>
      </div>
    </main>
  );
}