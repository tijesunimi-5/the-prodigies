"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Clock, Upload, CheckCircle } from "lucide-react";

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
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 Minutes (120s)
  const [canClickPaid, setCanClickPaid] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [finalPrice, setFinalPrice] = useState(eventDetails?.numericPrice ?? 0);
  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadTime, setUploadTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- PERSISTENT TIMER LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === 2 && eventDetails) {
      const storageKey = `timer_end_${eventDetails.title.replace(/\s+/g, '_')}`;
      let endTime = localStorage.getItem(storageKey);

      if (!endTime) {
        // Set end time to 2 minutes from now
        const newEndTime = Date.now() + 120000;
        localStorage.setItem(storageKey, newEndTime.toString());
        endTime = newEndTime.toString();
      }

      timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((parseInt(endTime!) - now) / 1000));

        setTimeLeft(remaining);

        if (remaining <= 0) {
          setCanClickPaid(true);
          clearInterval(timer);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [step, eventDetails]);

  // --- HELPERS ---
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSelectedFileName(e.target.files[0].name);
      setUploadTime(timeString);
    }
  };

  const handleFinalSubmit = async () => {
    if (!canClickPaid || !selectedFileName) {
      alert("Please wait for the timer and ensure a receipt is uploaded.");
      return;
    }
    setIsSubmitting(true);

    try {
      let receiptUrl = "";

      // 1. UPLOAD TO CLOUDINARY
      if (fileInputRef.current?.files?.[0]) {
        const fileData = new FormData();
        fileData.append("file", fileInputRef.current.files[0]);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
        receiptUrl = uploadData.url;
      }

      // 2. SAVE TO DATABASE
      const registrationRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventName: eventDetails?.title,
          amountPaid: finalPrice,
          couponUsed: coupon === "APPLIED" ? "PRODIGY500" : null,
          receiptUrl: receiptUrl,
          uploadTime: uploadTime
        }),
      });

      if (registrationRes.ok) {
        localStorage.setItem("prodigy_ticket", JSON.stringify({
          name: formData.name,
          event: eventDetails?.title,
          status: "pending",
          email: formData.email
        }));

        // Clear timer on successful submit
        localStorage.removeItem(`timer_end_${eventDetails?.title.replace(/\s+/g, '_')}`);

        alert("Success! Your registration is now in the queue for approval.");
        onCloseAction();
        window.location.reload();
      } else {
        const errorData = await registrationRes.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Verification failed. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3 font-bold">Transfer to OPay</p>
                    <p className="text-2xl font-serif select-all">7012345678</p>
                    <p className="text-[12px] text-[#F5E9DA]/60">Amos Daniel</p>
                    <button type="button" onClick={() => copyToClipboard("7012345678")} className="mx-auto text-[9px] text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1.5 mt-4 block uppercase font-bold hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all">
                      {copied ? "Copied" : "Copy Account"}
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-2xl font-mono text-[#3B2A26] font-bold">
                      <Clock size={20} className={canClickPaid ? "text-green-600" : "text-[#D4AF37] animate-pulse"} />
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#3B2A26]/40 font-bold">Verification Window</p>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-6 flex flex-col items-center cursor-pointer transition-all rounded-sm ${selectedFileName ? "border-green-500 bg-green-50/30" : "border-[#3B2A26]/10 hover:bg-white"}`}
                  >
                    {selectedFileName ? (
                      <>
                        <CheckCircle size={24} className="text-green-600 mb-2" />
                        <span className="text-[10px] uppercase font-black text-green-700 max-w-[200px] truncate">
                          {selectedFileName}
                        </span>
                        <span className="text-[8px] text-green-600/60 mt-1 uppercase font-bold tracking-tighter">Uploaded at {uploadTime}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="text-[#D4AF37]" />
                        <span className="text-[10px] uppercase font-black text-[#3B2A26]/60 mt-2">Upload Receipt</span>
                      </>
                    )}

                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={!canClickPaid || submitting}
                    className={`w-full py-4 uppercase tracking-[0.4em] text-[10px] font-black rounded-sm transition-all ${canClickPaid && !submitting ? "bg-[#3B2A26] text-[#F5E9DA] shadow-xl" : "bg-[#3B2A26]/5 text-[#3B2A26]/20 cursor-not-allowed"}`}
                  >
                    {submitting ? "Processing..." : canClickPaid ? "Confirm Transfer" : "Verify Transfer..."}
                  </button>
                </div>
              )}
            </div>
            <div className="h-1.5 bg-gradient-to-r from-[#3B2A26] via-[#D4AF37] to-[#3B2A26]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}