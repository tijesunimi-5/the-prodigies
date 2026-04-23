"use client";
import { useState } from "react";
import { ShieldCheck, Camera, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const simulateScan = () => {
    setIsValidating(true);
    // Simulate API check
    setTimeout(() => {
      setScanResult("VALID: Egbedeyi Tomiwa - Dinner Night");
      setIsValidating(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-10">
      <div className="text-center">
        <h1 className="text-3xl font-serif text-[#3B2A26]">Entry Scanner</h1>
        <p className="text-[10px] uppercase tracking-widest text-[#3B2A26]/40 mt-2">Ushers Only • Security Protocol</p>
      </div>

      {/* Scanner Viewport (Placeholder for Camera) */}
      <div className="relative aspect-square bg-[#3B2A26] rounded-sm overflow-hidden flex items-center justify-center border-4 border-[#D4AF37]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <Camera size={48} className="text-[#D4AF37]/50" />

        {/* Animated Scanning Line */}
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] z-10"
        />
      </div>

      <button
        onClick={simulateScan}
        className="w-full py-4 bg-[#3B2A26] text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-black"
      >
        {isValidating ? "Verifying Registry..." : "Start Camera"}
      </button>

      {/* Result Alert */}
      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-green-50 border border-green-200 text-green-800 text-center rounded-sm"
          >
            <ShieldCheck size={32} className="mx-auto mb-2" />
            <p className="font-bold text-sm uppercase tracking-widest">Access Granted</p>
            <p className="text-xs mt-1">{scanResult}</p>
            <button onClick={() => setScanResult(null)} className="mt-4 text-[9px] uppercase font-bold underline">Next Guest</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}