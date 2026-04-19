"use client";
import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Clock, CheckCircle, X, QrCode } from "lucide-react";

interface TicketData {
  event: string;
  name: string;
  status: "pending" | "verified";
}

// This is a helper to check if we are on the client without using useEffect
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function TicketStatusFloat() {
  // 1. Check if we are in the browser without triggering the "mounted" effect error
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 2. Lazy initializer for the ticket data
  const [ticket] = useState<TicketData | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("prodigy_ticket");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [isOpen, setIsOpen] = useState(false);

  // If we're on the server or no ticket exists, return nothing
  if (!isClient || !ticket) return null;

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[100] bg-[#3B2A26] text-[#D4AF37] p-4 rounded-full shadow-2xl border border-[#D4AF37]/30 flex items-center gap-3 group overflow-hidden"
      >
        <Ticket size={20} />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">
          My Ticket
        </span>
      </motion.button>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-xs bg-[#F5E9DA] border-t-4 border-[#D4AF37] p-8 shadow-2xl text-center"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[#3B2A26]/40 hover:text-[#3B2A26]"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#3B2A26]/40">Event: {ticket.event}</p>
                <h3 className="font-serif text-2xl text-[#3B2A26] mt-2">{ticket.name}</h3>
              </div>

              {ticket.status === "pending" ? (
                <div className="bg-[#3B2A26]/5 p-6 rounded-sm border border-[#3B2A26]/5 space-y-4">
                  <div className="flex justify-center">
                    <Clock size={40} className="text-[#D4AF37] animate-pulse" />
                  </div>
                  <p className="text-sm font-serif text-[#3B2A26]">Awaiting Confirmation</p>
                  <p className="text-[10px] text-[#3B2A26]/60 leading-relaxed uppercase tracking-widest">
                    The Registry is verifying your transfer.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white p-4 flex justify-center shadow-inner">
                    <QrCode size={160} className="text-[#3B2A26]" />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Verified Entry</span>
                  </div>
                </div>
              )}

              <p className="mt-8 text-[9px] text-[#3B2A26]/30 uppercase tracking-[0.4em]">The Prodigies Registry</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}