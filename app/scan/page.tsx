"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle, AlertTriangle, XCircle, Camera, Loader2, RefreshCw } from "lucide-react";

interface ScanResult {
  status: "success" | "fraud" | "pending" | "invalid" | "loading" | "idle";
  name?: string;
  event?: string;
  error?: string;
}

export default function AdminScanPage() {
  const [scanState, setScanState] = useState<ScanResult>({ status: "idle" });
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isProcessingRef = useRef(false);

  // Success handler
  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setScanState({ status: "loading" });

    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: decodedText.trim() }),
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
      console.error("Scanning pipeline error:", err);
      setScanState({ status: "invalid", error: "Network transaction pipeline timeout." });
    }
  }, []);

  // Removed the unused string variable entirely to clear the unused-vars warning
  const onScanFailure = useCallback(() => {
    // Left empty intentionally to avoid flooding the console with stream logs
  }, []);

  const resetScannerWindow = () => {
    isProcessingRef.current = false;
    setScanState({ status: "idle" });
  };

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => {
          console.error("Scanner cleanup failure:", err);
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="min-h-screen bg-[#1A1210] text-[#F5E9DA] flex flex-col justify-between font-sans relative overflow-hidden">

      {/* Feedback Overlay */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 pointer-events-none opacity-0 ${scanState.status !== "idle" && scanState.status !== "loading" ? "pointer-events-auto opacity-100" : ""}`}
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
            <h2 className="font-serif text-3xl font-black tracking-tighter">DUPLICATE TICKET</h2>
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
            {scanState.name && (
              <p className="text-md font-bold text-white mt-2 border border-orange-500/30 px-3 py-1 bg-black/20 rounded-full">
                {scanState.name}
              </p>
            )}
          </div>
        )}

        <button onClick={resetScannerWindow} className="mt-8 px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-2xl flex items-center gap-2 active:scale-95 transition-transform">
          <RefreshCw size={14} /> Tap to Scan Next
        </button>
      </div>

      <header className="p-4 border-b border-[#3B2A26]/30 text-center bg-[#261B19]/80 backdrop-blur-md">
        <h1 className="font-serif text-lg text-[#D4AF37] tracking-wider uppercase font-bold">Registry Entry Gate</h1>
        <p className="text-[9px] uppercase tracking-widest text-[#F5E9DA]/40">Staff Validation Protocol • 2026</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#261B19] rounded-sm p-4 border border-[#D4AF37]/10 shadow-2xl relative">

          <div id="reader" className="w-full overflow-hidden rounded-sm bg-black/40 min-h-75" />

          {scanState.status === "loading" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 rounded-sm">
              <Loader2 size={36} className="text-[#D4AF37] animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Evaluating Token...</span>
            </div>
          )}

          {/* Render fallback icon contextually if scanner has not loaded yet */}
          {!scanState.status && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center bg-[#261B19] p-6">
              <Camera size={32} className="text-[#D4AF37]/40" />
              <p className="text-[11px] uppercase tracking-wider text-gray-400">Initializing Camera Hub Engine</p>
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