"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, ShieldAlert, UserCheck, X, KeyRound } from "lucide-react";

interface UserSession {
  email: string;
  name: string;
}

export default function AuthOverlay() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form Inputs
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState(""); // Only used for brand new registrations
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Check if user is already logged in on mount
  useEffect(() => {
    const saved = localStorage.getItem("prodigy_user_session");
    if (saved) setSession(JSON.parse(saved));
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), pin, name, isNewUser }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If account doesn't exist, switch to registration mode cleanly
        if (data.code === "USER_NOT_FOUND") {
          setIsNewUser(true);
          setError("Email not registered. Enter your Full Name to create your secure profile pass!");
        } else {
          throw new Error(data.error || "Authentication failed");
        }
        return;
      }

      // Success! Save session locally
      const newSession = { email: data.email, name: data.name };
      localStorage.setItem("prodigy_user_session", JSON.stringify(newSession));
      setSession(newSession);
      setIsOpen(false);
      setIsLoggingIn(false);

      // Auto-reload to update all ticket listings on the page
      window.location.reload();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("prodigy_user_session");
    setSession(null);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <>
      {/* Floating Status Indicator */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#3B2A26] text-[#F5E9DA] px-4 py-3 rounded-full shadow-2xl border border-[#D4AF37]/20 flex items-center gap-3 hover:border-[#D4AF37]/60 transition-all group"
        >
          {/* Connected Status Indicator Dot */}
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${session ? "bg-green-400" : "bg-orange-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${session ? "bg-green-500" : "bg-orange-500"}`}></span>
          </span>
          <span className="text-[10px] uppercase tracking-widest font-black text-[#D4AF37]">
            {session ? "Connected" : "Sync Profile"}
          </span>
        </button>
      </div>

      {/* Profile & Login Management Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-xs bg-[#F5E9DA] border-b-4 border-[#3B2A26] p-6 shadow-2xl text-center text-[#3B2A26]">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-[#3B2A26]/40 hover:text-[#3B2A26]"><X size={18} /></button>

              {session && !isLoggingIn ? (
                /* --- PROFILE INFO VIEW --- */
                <div className="space-y-6 py-4">
                  <div className="w-16 h-16 bg-[#3B2A26] text-[#D4AF37] mx-auto rounded-full flex items-center justify-center shadow-lg">
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Active Terminal</p>
                    <h3 className="font-serif text-xl mt-1 leading-tight">{session.name}</h3>
                    <code className="text-[10px] text-gray-500 block mt-1">{session.email}</code>
                  </div>

                  <div className="p-3 bg-green-50 rounded-sm border border-green-100 flex items-center justify-center gap-2 text-green-700 text-[10px] uppercase font-bold tracking-wider">
                    <span>Cloud Sync Active</span>
                  </div>

                  <button onClick={handleLogout} className="w-full py-3 border border-red-200 text-red-600 rounded-sm text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
                    <LogOut size={14} /> Disconnect Device
                  </button>
                </div>
              ) : (
                /* --- AUTHENTICATION / SIGN IN FORM --- */
                <form onSubmit={handleAuthSubmit} className="space-y-4 py-2 text-left">
                  <div className="text-center mb-4">
                    <KeyRound className="mx-auto text-[#D4AF37] mb-2" size={32} />
                    <h3 className="font-serif text-lg">Registry Access</h3>
                    <p className="text-[9px] text-[#3B2A26]/50 uppercase tracking-wider">Enter email and 4-digit security PIN</p>
                  </div>

                  {error && (
                    <div className="p-3 bg-orange-50 border border-orange-100 text-orange-800 text-[9px] uppercase tracking-wide rounded-sm flex items-start gap-2 font-medium">
                      <ShieldAlert size={14} className="shrink-0 text-orange-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {isNewUser && (
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Full Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-[#3B2A26]/10 px-3 py-2 outline-none text-sm focus:border-[#D4AF37]" placeholder="Amos Daniel" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Email Address</label>
                    <input required type="email" disabled={isNewUser} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#3B2A26]/10 px-3 py-2 outline-none text-sm focus:border-[#D4AF37] disabled:opacity-50" placeholder="example@gmail.com" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">4-Digit Access PIN</label>
                    <input required type="password" maxLength={4} pattern="\d{4}" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} className="w-full bg-white border border-[#3B2A26]/10 px-3 py-2 outline-none text-sm tracking-[0.5em] font-mono text-center focus:border-[#D4AF37]" placeholder="••••" />
                  </div>

                  <button disabled={loading} className="w-full py-3 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase font-black tracking-widest rounded-sm flex items-center justify-center gap-2 hover:bg-[#3B2A26]/90 transition-all">
                    <LogIn size={12} /> {loading ? "Verifying..." : isNewUser ? "Create Profile Pass" : "Verify Profile"}
                  </button>

                  {session && (
                    <button type="button" onClick={() => setIsLoggingIn(false)} className="w-full py-2 text-[9px] text-center uppercase tracking-widest text-gray-400 font-bold hover:text-[#3B2A26]">
                      Cancel
                    </button>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}