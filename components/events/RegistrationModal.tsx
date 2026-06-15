"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Clock, Upload, CheckCircle, Plus, Trash2 } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  eventDetails: {
    title: string;
    price: string;
    numericPrice: number;
  } | null;
}

interface GuestInput {
  name: string;
  email: string;
  phone: string;
}

export default function RegistrationModal({ isOpen, onCloseAction, eventDetails }: RegistrationModalProps) {
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  // Adjusted base countdown timer state to 30 seconds
  const [timeLeft, setTimeLeft] = useState(30);
  const [canClickPaid, setCanClickPaid] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploadTime, setUploadTime] = useState<string | null>(null);

  const [buyerSession, setBuyerSession] = useState<{ email: string; name: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [guests, setGuests] = useState<GuestInput[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- PRICING ALGORITHM CONFIGURATION ---
  const basePrice = eventDetails?.numericPrice ?? 0;
  const totalTicketsCount = 1 + guests.length;

  // FIX: Coupon evaluates as a flat deduction off the grand total, NOT per ticket.
  const couponDiscount = coupon === "APPLIED" ? 500 : 0;
  const finalPrice = (basePrice * totalTicketsCount) - couponDiscount;

  useEffect(() => {
    const savedSession = localStorage.getItem("prodigy_user_session");
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setBuyerSession(parsed);
      setFormData({ name: parsed.name, email: parsed.email, phone: "" });
    }
  }, [isOpen]);

  // --- TIMEOUT ENGINE ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && eventDetails) {
      const storageKey = `timer_end_${eventDetails.title.replace(/\s+/g, '_')}`;
      let endTime = localStorage.getItem(storageKey);

      if (!endTime) {
        // Adjusted future target timestamp generation block to 30 seconds (30000ms)
        const newEndTime = Date.now() + 30000;
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

  // --- GUEST FIELD MANAGERS ---
  const addGuestField = () => {
    setGuests([...guests, { name: "", email: "", phone: "" }]);
  };

  const removeGuestField = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const updateGuestField = (index: number, key: keyof GuestInput, value: string) => {
    const updated = [...guests];
    updated[index][key] = value;
    setGuests(updated);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "PRODIGY500" && coupon !== "APPLIED") {
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
      alert("Please wait for the verification window and upload a copy of your receipt.");
      return;
    }
    setIsSubmitting(true);

    try {
      let receiptUrl = "";

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

      const allAttendees = [
        { name: formData.name, email: formData.email.toLowerCase().trim(), phone: formData.phone },
        ...guests.map(g => ({ name: g.name, email: g.email.toLowerCase().trim(), phone: g.phone }))
      ];

      const registrationRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendees: allAttendees,
          buyerEmail: buyerSession?.email || formData.email.toLowerCase().trim(),
          eventName: eventDetails?.title,
          amountPaid: finalPrice,
          couponUsed: coupon === "APPLIED" ? "PRODIGY500" : null,
          receiptUrl: receiptUrl
        }),
      });

      if (registrationRes.ok) {
        localStorage.setItem("prodigy_ticket", JSON.stringify({
          name: formData.name,
          event: eventDetails?.title,
          status: "pending",
          email: formData.email.toLowerCase().trim()
        }));

        localStorage.removeItem(`timer_end_${eventDetails?.title.replace(/\s+/g, '_')}`);
        alert(`Success! ${allAttendees.length} registrations are now in the validation queue.`);
        onCloseAction();
        window.location.reload();
      } else {
        const errorData = await registrationRes.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Verification pipeline failure. Check network connectivity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!eventDetails) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCloseAction} className="absolute inset-0 bg-[#1A1210]/90 backdrop-blur-md" />

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-[#F5E9DA] rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-[#3B2A26]/10 flex justify-between items-center bg-[#F5E9DA]">
              <div>
                <h2 className="font-serif text-lg text-[#3B2A26]">{eventDetails.title}</h2>
                <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-bold mt-0.5">Ticket Count: {totalTicketsCount}</p>
              </div>
              <button onClick={onCloseAction} className="text-[#3B2A26]/40 hover:text-[#3B2A26]"><X size={20} /></button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {step === 1 ? (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>

                  {/* Primary Holder */}
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-[#3B2A26]/60 font-bold border-b border-[#3B2A26]/5 pb-1">Ticket #1 (Primary Holder)</p>
                    <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26] text-sm" />
                    <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26] text-sm" />
                    <input required type="tel" placeholder="WhatsApp Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26] text-sm" />
                  </div>

                  {/* Dynamic Guest Passes */}
                  {guests.map((guest, index) => (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={index} className="space-y-4 bg-[#3B2A26]/5 p-4 rounded-sm border border-[#3B2A26]/5 relative">
                      <button type="button" onClick={() => removeGuestField(index)} className="absolute top-3 right-3 text-red-500/60 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Ticket #{index + 2} (Guest Pass)</p>

                      <input required type="text" placeholder="Guest Full Name" value={guest.name} onChange={(e) => updateGuestField(index, "name", e.target.value)} className="w-full bg-transparent border-b border-[#3B2A26]/10 py-1.5 outline-none focus:border-[#D4AF37] text-[#3B2A26] text-sm" />
                      <input required type="email" placeholder="Guest Email Address" value={guest.email} onChange={(e) => updateGuestField(index, "email", e.target.value)} className="w-full bg-transparent border-b border-[#3B2A26]/10 py-1.5 outline-none focus:border-[#D4AF37] text-[#3B2A26] text-sm" />
                      <input required type="tel" placeholder="Guest WhatsApp Number" value={guest.phone} onChange={(e) => updateGuestField(index, "phone", e.target.value)} className="w-full bg-transparent border-b border-[#3B2A26]/10 py-1.5 outline-none focus:border-[#D4AF37] text-[#3B2A26] text-sm" />
                    </motion.div>
                  ))}

                  <button type="button" onClick={addGuestField} className="w-full py-3 border border-dashed border-[#3B2A26]/20 text-[#3B2A26]/60 rounded-sm text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-[#3B2A26] transition-all">
                    <Plus size={14} /> Add Additional Guest Ticket
                  </button>

                  {/* <div className="flex gap-2 items-end pt-2 border-t border-[#3B2A26]/5">
                    <input type="text" placeholder="Coupon Code" disabled={coupon === "APPLIED"} onChange={(e) => setCoupon(e.target.value)} className="flex-1 bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] text-[#3B2A26] text-sm" />
                    <button type="button" onClick={handleApplyCoupon} className="text-[10px] font-bold text-[#D4AF37] uppercase">{coupon === "APPLIED" ? "Applied" : "Apply"}</button>
                  </div> */}

                  <button className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase tracking-[0.4em] font-black group relative overflow-hidden mt-2 shrink-0">
                    <span className="relative z-10">Proceed • ₦{finalPrice.toLocaleString()}</span>
                    <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                  </button>
                </form>
              ) : (
                /* Step 2: Payment Window */
                <div className="space-y-6 text-center">
                  <div className="bg-[#3B2A26] text-[#F5E9DA] p-6 rounded-sm shadow-inner">
                    <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3 font-bold">Transfer Grand Total</p>
                    <p className="text-3xl font-serif text-[#D4AF37] font-black mb-4">₦{finalPrice.toLocaleString()}</p>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">KUDA Account Number</p>
                      <p className="text-xl font-mono select-all tracking-wider text-white font-bold">2047541429</p>
                    <p className="text-[11px] text-[#F5E9DA]/60 mt-1">Araoye Busolami</p>
                    <button type="button" onClick={() => copyToClipboard("2047541429")} className="mx-auto text-[9px] text-[#D4AF37] border border-[#D4AF37]/30 px-5 py-2 mt-4 block uppercase font-bold hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all">
                      {copied ? "Copied Account" : "Copy Account Details"}
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-xl font-mono text-[#3B2A26] font-bold">
                      <Clock size={18} className={canClickPaid ? "text-green-600" : "text-[#D4AF37] animate-pulse"} />
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#3B2A26]/40 font-bold">Verification Window Open</p>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-6 flex flex-col items-center cursor-pointer transition-all rounded-sm ${selectedFileName ? "border-green-500 bg-green-50/20" : "border-[#3B2A26]/10 hover:bg-white"}`}
                  >
                    {selectedFileName ? (
                      <>
                        <CheckCircle size={24} className="text-green-600 mb-2" />
                        <span className="text-[10px] uppercase font-black text-green-700 max-w-[240px] truncate">{selectedFileName}</span>
                        <span className="text-[8px] text-green-600/60 mt-1 uppercase font-bold">Logged at {uploadTime}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="text-[#D4AF37]" />
                        <span className="text-[10px] uppercase font-black text-[#3B2A26]/60 mt-2">Upload Transfer Receipt</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep(1)} className="px-4 py-4 border border-[#3B2A26]/10 text-[10px] uppercase font-bold tracking-widest text-[#3B2A26] hover:bg-white">Back</button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={!canClickPaid || submitting}
                      className={`flex-1 py-4 uppercase tracking-[0.4em] text-[10px] font-black rounded-sm transition-all ${canClickPaid && !submitting ? "bg-[#3B2A26] text-[#F5E9DA] shadow-xl" : "bg-[#3B2A26]/5 text-[#3B2A26]/20 cursor-not-allowed"}`}
                    >
                      {submitting ? "Processing Transaction..." : canClickPaid ? "Confirm Transfer" : "Awaiting Secure Window..."}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-1.5 bg-gradient-to-r from-[#3B2A26] via-[#D4AF37] to-[#3B2A26] shrink-0" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}