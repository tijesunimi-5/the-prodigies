"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle, AlertTriangle, XCircle, Camera, Loader2, RefreshCw, Search, Keyboard, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface ScanResult {
  status: "success" | "fraud" | "pending" | "invalid" | "loading" | "idle";
  name?: string;
  event?: string;
  error?: string;
}

interface ManualSearchRow {
  name: string;
  email: string;
  event: string;
  status: string;
  accessCode: string;
}

export default function AdminScanPage() {
  const [scanState, setScanState] = useState<ScanResult>({ status: "idle" });
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isProcessingRef = useRef(false);

  // --- MANUAL MODAL STATES ---
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<ManualSearchRow[]>([]);
  const [selectedAttendee, setSelectedAttendee] = useState<ManualSearchRow | null>(null);
  const [backupPin, setBackupPin] = useState("");

  // Core execution block for validating an access token string
  const executeCheckInToken = useCallback(async (token: string) => {
    isProcessingRef.current = true;
    setScanState({ status: "loading" });

    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: token.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setScanState({ status: "success", name: data.name, event: data.event });
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } else {
        setScanState({
          status: data.status || "invalid",
          name: data.name,
          error: data.error || "Validation failed"
        });
        if (navigator.vibrate) navigator.vibrate([300]);
      }
    } catch (err) {
      console.error(err);
      setScanState({ status: "invalid", error: "Network transaction pipeline failure." });
    }
  }, []);

  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (isProcessingRef.current) return;
    await executeCheckInToken(decodedText);
  }, [executeCheckInToken]);

  const onScanFailure = useCallback(() => { }, []);

  // Handle Text Input Token Submission
  const handleManualCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await executeCheckInToken(manualCode.toUpperCase().trim());
  };

  // Live Query Search Names inside Registry DB
  const handleNameLookup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    if (value.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/admin/check-in?search=${encodeURIComponent(value)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (e) { console.error(e); }
  };

  // Verify PIN & Force Entry Verification
  const handlePinVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttendee || !backupPin) return;

    setScanState({ status: "loading" });
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessCode: selectedAttendee.accessCode,
          passcode: backupPin.trim()
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setScanState({ status: "success", name: data.name, event: data.event });
        // Clear manual memory parameters
        setSelectedAttendee(null);
        setBackupPin("");
        setSearchName("");
        setSearchResults([]);
      } else {
        setScanState({ status: data.status || "invalid", name: data.name, error: data.error });
      }
    } catch (err) {
      setScanState({ status: "invalid", error: "PIN verification failure." });
    }
  };

  const resetScannerWindow = async () => {
    isProcessingRef.current = false;
    setScanState({ status: "idle" });
    if (scannerRef.current && !isManualMode) {
      try {
        await scannerRef.current.clear();
        scannerRef.current.render(onScanSuccess, onScanFailure);
      } catch (err) { console.error(err); }
    }
  };

  useEffect(() => {
    if (!isManualMode) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 220, height: 220 }, rememberLastUsedCamera: true },
        false
      );
      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => { });
      }
    };
  }, [isManualMode, onScanSuccess, onScanFailure]);

  return (
    <div className="min-h-screen bg-[#1A1210] text-[#F5E9DA] flex flex-col justify-between font-sans relative overflow-hidden">

      {/* Dynamic Overlay State Layer */}
      <div
        className={`absolute inset-0 z-200 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 pointer-events-none opacity-0 ${scanState.status !== "idle" && scanState.status !== "loading" ? "pointer-events-auto opacity-100" : ""}`}
        style={{
          backgroundColor:
            scanState.status === "success" ? "#14532d" :
              scanState.status === "fraud" ? "#7f1d1d" :
                scanState.status === "pending" ? "#7c2d12" : "#3b2a26"
        }}
      >
        {scanState.status === "success" && (
          <div className="space-y-4 max-w-xs">
            <CheckCircle size={72} className="text-green-400 mx-auto" />
            <h2 className="font-serif text-3xl font-bold tracking-tight">ACCESS GRANTED</h2>
            <div className="h-0.5 bg-white/20 my-2" />
            <p className="text-xl font-bold tracking-wide uppercase text-white">{scanState.name}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-green-300">{scanState.event}</p>
          </div>
        )}

        {scanState.status === "fraud" && (
          <div className="space-y-4 max-w-xs">
            <XCircle size={72} className="text-red-400 mx-auto" />
            <h2 className="font-serif text-3xl font-black tracking-tighter">DUPLICATE ENTRY</h2>
            <p className="text-sm text-red-200/80">{scanState.error}</p>
            <div className="h-0.5 bg-white/20 my-2" />
            <p className="text-lg font-bold text-white uppercase">{scanState.name}</p>
          </div>
        )}

        {(scanState.status === "pending" || scanState.status === "invalid") && (
          <div className="space-y-4 max-w-xs">
            <AlertTriangle size={72} className="text-orange-400 mx-auto" />
            <h2 className="font-serif text-2xl font-bold tracking-tight">ENTRY DENIED</h2>
            <p className="text-xs uppercase tracking-widest text-orange-200">{scanState.error}</p>
            {scanState.name && <p className="text-md font-bold text-white mt-2 border border-orange-500/30 px-3 py-1 bg-black/20 rounded-full">{scanState.name}</p>}
          </div>
        )}

        <button onClick={resetScannerWindow} className="mt-8 px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-2xl flex items-center gap-2 cursor-pointer relative z-200 pointer-events-auto">
          <RefreshCw size={14} /> Continue Scanning
        </button>
      </div>

      <header className="p-4 border-b border-[#3B2A26]/30 text-center bg-[#261B19]/80 backdrop-blur-md flex justify-between items-center px-6">
        <div className="text-left">
          <h1 className="font-serif text-md text-[#D4AF37] uppercase font-bold tracking-wider">Gate Check-In</h1>
          <p className="text-[8px] uppercase tracking-widest text-[#F5E9DA]/40">Handshake Terminal • 2026</p>
        </div>
        <button
          onClick={() => { setIsManualMode(!isManualMode); setScanState({ status: "idle" }); }}
          className="px-4 py-2 border border-[#D4AF37]/30 text-[9px] uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all rounded-sm"
        >
          {isManualMode ? <Camera size={12} /> : <Keyboard size={12} />}
          {isManualMode ? "Camera Mode" : "Manual Mode"}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 pt-8">
        <div className="w-full max-w-sm bg-[#261B19] rounded-sm p-4 border border-[#D4AF37]/10 shadow-2xl relative min-h-[340px]">

          {!isManualMode ? (
            /* --- CAMERA MODE VIEW --- */
            <div id="reader" className="w-full overflow-hidden rounded-sm bg-black/40 min-h-75" />
          ) : (
            /* --- MANUAL MODE CONTAINER PANEL --- */
            <div className="space-y-6">
              {/* Part A: Direct Code Type Input Form */}
              <form onSubmit={handleManualCodeSubmit} className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Input Access Token String</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="PRD26-XXXXX" value={manualCode} onChange={(e) => setManualCode(e.target.value)} className="flex-1 bg-black/30 border border-[#D4AF37]/20 rounded-sm px-3 py-2 text-sm uppercase tracking-wider font-mono outline-none text-[#D4AF37] focus:border-[#D4AF37]" />
                  <button type="submit" className="bg-[#3B2A26] border border-[#D4AF37]/40 text-[#D4AF37] px-4 rounded-sm text-[10px] uppercase font-bold tracking-widest">Verify</button>
                </div>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[8px] text-gray-500 uppercase tracking-widest">OR SEARCH NAME</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              {/* Part B: Name Search View & PIN Form Handler */}
              {!selectedAttendee ? (
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Search Attendee Name</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-3 text-gray-500" />
                    <input type="text" placeholder="Type minimum 3 characters..." value={searchName} onChange={handleNameLookup} className="w-full bg-black/30 border border-white/10 rounded-sm pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#D4AF37]" />
                  </div>

                  <div className="space-y-1 max-h-[160px] overflow-y-auto pt-1">
                    {searchResults.map((row, idx) => (
                      <div
                        key={idx}
                        onClick={() => row.status === "verified" && setSelectedAttendee(row)}
                        className={`p-2.5 rounded-sm flex justify-between items-center text-left border cursor-pointer transition-all ${row.status === "verified" ? "bg-white/5 border-white/5 hover:border-[#D4AF37]/40" : "bg-black/10 border-white/5 opacity-40 cursor-not-allowed"}`}
                      >
                        <div>
                          <p className="text-xs font-bold font-serif">{row.name}</p>
                          <p className="text-[8px] uppercase tracking-tighter text-gray-400">{row.email}</p>
                        </div>
                        <span className={`text-[8px] uppercase px-2 py-0.5 rounded-full font-bold ${row.status === "verified" ? "bg-green-950 text-green-400" : row.status === "checked_in" ? "bg-blue-950 text-blue-400" : "bg-orange-950 text-orange-400"}`}>
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Part C: Prompt Secure 6-Digit PIN Validation */
                <motion.form initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePinVerificationSubmit} className="space-y-4 bg-black/30 p-4 border border-[#D4AF37]/20 rounded-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Secure PIN Lock</span>
                      <h4 className="font-serif text-sm font-bold mt-1 text-white">{selectedAttendee.name}</h4>
                    </div>
                    <button type="button" onClick={() => { setSelectedAttendee(null); setBackupPin(""); }} className="text-gray-500 hover:text-white text-xs"><XCircle size={16} /></button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-widest text-gray-400 block font-bold">Enter Guest 6-Digit Passcode</label>
                    <div className="relative">
                      <Shield size={14} className="absolute left-3 top-3 text-[#D4AF37]" />
                      <input required type="password" placeholder="------" maxLength={6} value={backupPin} onChange={(e) => setBackupPin(e.target.value.replace(/\D/g, ""))} className="w-full bg-black/40 border border-[#D4AF37]/20 rounded-sm pl-9 pr-3 py-2 text-center text-sm font-mono tracking-[0.5em] font-bold text-[#D4AF37] outline-none focus:border-[#D4AF37]" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-2.5 bg-[#D4AF37] text-black text-[10px] uppercase font-black tracking-widest rounded-sm active:scale-98 transition-transform">
                    Authorize Entry Pass
                  </button>
                </motion.form>
              )}
            </div>
          )}

          {scanState.status === "loading" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 rounded-sm z-10">
              <Loader2 size={36} className="text-[#D4AF37] animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Evaluating Token...</span>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-center bg-[#261B19]/20 text-[9px] text-[#F5E9DA]/30 uppercase tracking-widest">
        Secure Handshake Encrypted Terminal
      </footer>
    </div>
  );
}