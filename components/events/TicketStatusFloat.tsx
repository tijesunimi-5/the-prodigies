"use client";
import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Clock, CheckCircle, X, ShieldCheck, Fingerprint, Loader2, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface TicketData {
  id: number;
  event: string;
  name: string;
  email: string;
  status: "pending" | "verified";
  accessCode?: string;
  passcode?: string;
  buyerEmail: string;
}

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function TicketStatusFloat() {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Changed state to hold an array of group tickets instead of just one object
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasCheckedDB, setHasCheckedDB] = useState(false);
  const [userSessionEmail, setUserSessionEmail] = useState<string | null>(null);

  // 1. Check user login session and fetch full ticket registry package
  useEffect(() => {
    const savedSession = localStorage.getItem("prodigy_user_session");
    const savedTickets = localStorage.getItem("prodigy_group_tickets");

    const fetchAllGroupTickets = async (targetEmail: string) => {
      try {
        const res = await fetch(`/api/ticket-status?email=${encodeURIComponent(targetEmail)}`);
        if (res.ok) {
          const dbTickets = await res.json();
          setTickets(dbTickets);
          localStorage.setItem("prodigy_group_tickets", JSON.stringify(dbTickets));
        }
      } catch (e) {
        console.error("Failed to fetch group package from cloud:", e);
      } finally {
        setHasCheckedDB(true);
      }
    };

    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        setUserSessionEmail(user.email);

        if (savedTickets) {
          setTickets(JSON.parse(savedTickets));
          // Sync with server in background to pull down approvals
          fetchAllGroupTickets(user.email);
        } else {
          fetchAllGroupTickets(user.email);
        }
      } catch (e) {
        setHasCheckedDB(true);
      }
    } else {
      setHasCheckedDB(true);
    }
  }, [isOpen]);

  // 2. LIVE SYNC ENGINE: Pull down live data states when opened
  const syncGroupTickets = useCallback(async () => {
    if (!userSessionEmail) return;

    setIsSyncing(true);
    try {
      const response = await fetch(`/api/ticket-status?email=${encodeURIComponent(userSessionEmail)}`);
      if (response.ok) {
        const latestData = await response.json();
        setTickets(latestData);
        localStorage.setItem("prodigy_group_tickets", JSON.stringify(latestData));
      }
    } catch (err) {
      console.error("Live sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [userSessionEmail]);

  useEffect(() => {
    if (isOpen) syncGroupTickets();
  }, [isOpen, syncGroupTickets]);

  // WhatsApp Share Dispatch Engine
  const shareToWhatsApp = (ticketToShare: TicketData) => {
    const message = `*THE PRODIGIES REGISTRY '26*%0A` +
      `----------------------------%0A` +
      `Hi *${ticketToShare.name}*, here is your Entry Pass for *${ticketToShare.event}*!%0A%0A` +
      `🎟️ *Access Token:* ${ticketToShare.accessCode}%0A` +
      `🔐 *2FA Security PIN:* ${ticketToShare.passcode}%0A%0A` +
      `👉 Open the web app on your phone, log in with your email (*${ticketToShare.email}*) to view your live scan pass!`;

    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  if (!isClient || !hasCheckedDB || tickets.length === 0) return null;

  const currentTicket = tickets[currentIndex];

  const nextTicket = () => {
    setCurrentIndex((prev) => (prev + 1) % tickets.length);
  };

  const prevTicket = () => {
    setCurrentIndex((prev) => (prev - 1 + tickets.length) % tickets.length);
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-[#3B2A26] text-[#D4AF37] p-4 rounded-full shadow-2xl border border-[#D4AF37]/30 flex items-center gap-3 group"
      >
        <Ticket size={20} />
        <span className="text-[10px] uppercase tracking-widest font-black max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">
          My Passes ({tickets.length})
        </span>
      </motion.button>

      {/* Quick View Modal Card Component */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-xs bg-[#F5E9DA] border-t-4 border-[#D4AF37] p-6 text-center shadow-2xl rounded-sm">

              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-[#3B2A26]/40 hover:text-[#3B2A26]"><X size={18} /></button>

              {/* Navigation Arrows for Multi-Ticket Views */}
              {tickets.length > 1 && (
                <div className="absolute top-4 left-4 flex gap-1 items-center bg-[#3B2A26]/5 px-2 py-1 rounded-full">
                  <button onClick={prevTicket} className="text-[#3B2A26]/60 hover:text-[#3B2A26]"><ChevronLeft size={16} /></button>
                  <span className="text-[10px] font-mono font-bold text-[#3B2A26]">{currentIndex + 1}/{tickets.length}</span>
                  <button onClick={nextTicket} className="text-[#3B2A26]/60 hover:text-[#3B2A26]"><ChevronRight size={16} /></button>
                </div>
              )}

              <div className="mb-6 mt-4">
                <p className="text-[9px] uppercase tracking-widest text-[#3B2A26]/40 font-bold">
                  {currentTicket.buyerEmail === currentTicket.email ? "Personal Pass" : "Guest Pass"}
                </p>
                <h3 className="font-serif text-2xl text-[#3B2A26] leading-tight mt-1">{currentTicket.name}</h3>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase mt-1">{currentTicket.event}</p>
              </div>

              {currentTicket.status !== "verified" ? (
                <div className="bg-[#3B2A26]/5 p-8 rounded-sm border border-[#3B2A26]/10 space-y-4">
                  <div className="flex justify-center">
                    {isSyncing ? <Loader2 size={40} className="text-[#D4AF37] animate-spin" /> : <Clock size={40} className="text-[#D4AF37] animate-pulse" />}
                  </div>
                  <p className="text-sm font-serif text-[#3B2A26]">Awaiting Verification</p>
                  <p className="text-[9px] text-[#3B2A26]/50 uppercase tracking-widest">Reviewing group transfer details.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Real QR Code Generation */}
                  <div className="bg-white p-4 flex flex-col items-center shadow-inner rounded-sm border border-[#3B2A26]/5">
                    <QRCodeSVG value={currentTicket.accessCode || ""} size={140} fgColor="#3B2A26" />
                    <div className="mt-3 pt-3 border-t border-dashed border-[#3B2A26]/10 w-full">
                      <p className="text-[8px] uppercase text-[#3B2A26]/40">Access Code</p>
                      <code className="text-[10px] font-mono font-bold text-[#3B2A26] truncate max-w-full block">{currentTicket.accessCode}</code>
                    </div>
                  </div>

                  {/* 2FA Passcode Section */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#3B2A26] p-2.5 rounded-sm">
                      <ShieldCheck size={12} className="text-[#D4AF37] mx-auto mb-0.5" />
                      <span className="text-[9px] font-bold text-white uppercase">Verified</span>
                    </div>
                    <div className="bg-[#D4AF37] p-2.5 rounded-sm">
                      <Fingerprint size={12} className="text-[#3B2A26] mx-auto mb-0.5" />
                      <span className="text-[10px] font-black text-[#3B2A26] tracking-widest">{currentTicket.passcode}</span>
                    </div>
                  </div>

                  {/* Dynamic WhatsApp Share Feature Action Button */}
                  <button
                    type="button"
                    onClick={() => shareToWhatsApp(currentTicket)}
                    className="w-full py-3 bg-[#25D366] text-white rounded-sm text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 shadow-md hover:bg-[#20ba5a] transition-all"
                  >
                    <Share2 size={12} /> Share Pass to WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}