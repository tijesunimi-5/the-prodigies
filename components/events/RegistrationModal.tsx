"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Clock, Upload } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  eventDetails: {
    title: string;
    price: string;
    numericPrice: number;
  } | null;
}

export default function RegistrationModal({ isOpen, onCloseAction, eventDetails }: RegistrationModalProps) {
  // --- STATE INITIALIZATION ---
  // We initialize these directly. By using a 'key' in the parent (step 2), 
  // these reset automatically whenever a new event is selected.
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [canClickPaid, setCanClickPaid] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [finalPrice, setFinalPrice] = useState(eventDetails?.numericPrice ?? 0);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer Logic: Only runs during step 2
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanClickPaid(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "PRODIGY500" && finalPrice === eventDetails?.numericPrice) {
      setFinalPrice((prev) => prev - 500);
      setCoupon("APPLIED");
    }
  };

  const handleFinalSubmit = () => {
    if (!canClickPaid) return;
    const userData = {
      name: formData.name,
      event: eventDetails?.title,
      status: "pending",
      timestamp: new Date().toISOString(),
      amountPaid: finalPrice,
    };
    localStorage.setItem("prodigy_ticket", JSON.stringify(userData));
    alert("Payment submitted. Please wait for Admin approval.");
    onCloseAction();
    window.location.reload();
  };

  if (!eventDetails) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCloseAction} className="absolute inset-0 bg-[#1A1210]/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-[#F5E9DA] rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#3B2A26]/10 flex justify-between items-center">
              <h2 className="font-serif text-lg text-[#3B2A26]">{eventDetails.title}</h2>
              <button onClick={onCloseAction} className="text-[#3B2A26]/40 hover:text-[#3B2A26]"><X size={20} /></button>
            </div>

            <div className="p-8">
              {step === 1 ? (
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26]" />
                  <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26]" />
                  <input required type="tel" placeholder="WhatsApp Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26]" />

                  <div className="flex gap-2 items-end pt-2">
                    <input type="text" placeholder="Coupon Code" disabled={coupon === "APPLIED"} onChange={(e) => setCoupon(e.target.value)} className="flex-1 bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26]" />
                    <button type="button" onClick={handleApplyCoupon} className="text-[10px] font-bold text-[#D4AF37] uppercase">{coupon === "APPLIED" ? "Applied" : "Apply"}</button>
                  </div>

                  <button className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase tracking-[0.4em] font-black group relative overflow-hidden mt-4">
                    <span className="relative z-10">Pay ₦{finalPrice.toLocaleString()}</span>
                    <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                  </button>
                </form>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="bg-[#3B2A26] text-[#F5E9DA] p-6 rounded-sm">
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3">Transfer to OPay</p>
                    <p className="text-2xl font-serif select-all">7012345678</p>
                    <button type="button" onClick={() => copyToClipboard("7012345678")} className="mx-auto text-[9px] text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1.5 mt-4 block uppercase font-bold">
                      {copied ? "Copied" : "Copy Account"}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-2xl font-mono text-[#3B2A26] font-bold">
                    <Clock size={20} className={canClickPaid ? "text-green-600" : "text-[#D4AF37] animate-pulse"} />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>

                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#3B2A26]/10 p-6 flex flex-col items-center cursor-pointer hover:bg-white transition-all">
                    <Upload size={24} className="text-[#D4AF37]" />
                    <span className="text-[10px] uppercase font-black text-[#3B2A26]/60 mt-2">Upload Receipt</span>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                  </div>

                  <button type="button" onClick={handleFinalSubmit} disabled={!canClickPaid} className={`w-full py-4 uppercase tracking-[0.4em] text-[10px] font-black rounded-sm ${canClickPaid ? "bg-[#3B2A26] text-[#F5E9DA]" : "bg-[#3B2A26]/5 text-[#3B2A26]/20 cursor-not-allowed"}`}>
                    {canClickPaid ? "Confirm Transfer" : "Verify Transfer..."}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}