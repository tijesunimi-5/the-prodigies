"use client";
import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Clock, CheckCircle, X, ShieldCheck, Fingerprint } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface TicketData {
  event: string;
  name: string;
  email: string; // We need this to query the DB
  status: "pending" | "verified";
  accessCode?: string;
  passcode?: string;
}

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function TicketStatusFloat() {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Load the ticket from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("prodigy_ticket");
    if (saved) {
      try {
        setTicket(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse ticket");
      }
    }
  }, []);

  // 2. SYNC LOGIC: Check database when the modal is opened
  useEffect(() => {
    const syncWithDatabase = async () => {
      // Only sync if modal is open, we have an email, and it's still "pending" locally
      if (isOpen && ticket?.email && ticket?.status === "pending") {
        setIsSyncing(true);
        try {
          const res = await fetch(`/api/ticket-status?email=${ticket.email}`);
          const latestData = await res.json();

          if (res.ok && latestData.status === "verified") {
            setTicket(latestData);
            // Update localStorage so the user is "Verified" forever on this device
            localStorage.setItem("prodigy_ticket", JSON.stringify(latestData));
          }
        } catch (error) {
          console.error("Sync error:", error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncWithDatabase();
  }, [isOpen, ticket?.email, ticket?.status]);

  if (!isClient || !ticket) return null;

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-[#3B2A26] text-[#D4AF37] p-4 rounded-full shadow-2xl border border-[#D4AF37]/30 flex items-center gap-3 group overflow-hidden"
      >
        <Ticket size={20} className="group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-black max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">
          {ticket.status === "verified" ? "View My Ticket" : "Check Status"}
        </span>
      </motion.button>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-xs bg-[#F5E9DA] border-t-4 border-[#D4AF37] p-6 md:p-8 shadow-2xl text-center overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[#3B2A26]/40 hover:text-[#3B2A26]"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#3B2A26]/40 mb-1 font-bold">Covenant Registry</p>
                <h3 className="font-serif text-2xl text-[#3B2A26] leading-tight">{ticket.name}</h3>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mt-2">{ticket.event}</p>
              </div>

              {ticket.status === "pending" ? (
                <div className="bg-[#3B2A26]/5 p-8 rounded-sm border border-[#3B2A26]/10 space-y-4">
                  <div className="flex justify-center">
                    <Clock size={40} className={`text-[#D4AF37] ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
                  </div>
                  <p className="text-sm font-serif text-[#3B2A26]">
                    {isSyncing ? "Syncing with Registry..." : "Awaiting Verification"}
                  </p>
                  <p className="text-[9px] text-[#3B2A26]/50 leading-relaxed uppercase tracking-widest">
                    Standard review takes 1-2 hours. Please keep your receipt handy.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Real QR Code Generation */}
                  <div className="bg-white p-4 flex flex-col items-center justify-center shadow-inner rounded-sm border-2 border-[#3B2A26]/5">
                    <QRCodeSVG
                      value={ticket.accessCode || "NOT_FOUND"}
                      size={160}
                      level="H"
                      includeMargin={false}
                      fgColor="#3B2A26"
                    />
                    <div className="mt-4 pt-4 border-t border-dashed border-[#3B2A26]/10 w-full">
                      <p className="text-[8px] uppercase tracking-widest text-[#3B2A26]/40 mb-1">Access Token</p>
                      <code className="text-[11px] font-mono font-bold text-[#3B2A26] block truncate">
                        {ticket.accessCode}
                      </code>
                    </div>
                  </div>

                  {/* 2FA Passcode Section */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#3B2A26] p-3 rounded-sm flex flex-col items-center justify-center">
                      <ShieldCheck size={14} className="text-[#D4AF37] mb-1" />
                      <span className="text-[8px] uppercase text-[#D4AF37]/60 font-bold">Status</span>
                      <span className="text-[9px] font-bold text-white uppercase">Active</span>
                    </div>
                    <div className="bg-[#D4AF37] p-3 rounded-sm flex flex-col items-center justify-center">
                      <Fingerprint size={14} className="text-[#3B2A26] mb-1" />
                      <span className="text-[8px] uppercase text-[#3B2A26]/60 font-bold">2FA PIN</span>
                      <span className="text-[11px] font-black text-[#3B2A26] tracking-widest">
                        {ticket.passcode || "------"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2 rounded-full border border-green-100">
                    <CheckCircle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Guest</span>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-[#3B2A26]/5">
                <p className="text-[8px] text-[#3B2A26]/30 uppercase tracking-[0.5em]">The Prodigies Registry • 2026</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}