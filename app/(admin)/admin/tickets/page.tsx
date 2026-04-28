"use client";
import { useState, useEffect, useCallback } from "react";
import { Check, X, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Ticket {
  id: number;
  fullName: string;
  phone: string;
  eventName: string;
  amountPaid: number;
  status: string;
  receiptUrl: string;
  accessCode?: string;
  passcode?: string;
}

export default function TicketsAdmin() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 1. Wrap loadTickets in useCallback to prevent the cascading render error
  const loadTickets = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleAction = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) loadTickets();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="animate-spin text-[#D4AF37]" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#3B2A26]">Ticket Registry</h1>
          <p className="text-sm text-[#3B2A26]/60 mt-2">Manage event access and verify security codes.</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-[#3B2A26]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* Updated min-w to standard tailwind class to satisfy linter */}
          <table className="w-full text-left min-w-full lg:min-w-[900px]">
            <thead className="bg-[#3B2A26] text-[#D4AF37] text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="p-5 pl-8">Guest</th>
                <th className="p-5">Security Codes (2FA)</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Receipt</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right pr-8">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B2A26]/5">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="text-sm text-[#3B2A26] hover:bg-[#F5E9DA]/30 transition-colors">
                  <td className="p-5 pl-8">
                    <p className="font-bold">{ticket.fullName}</p>
                    <p className="text-[10px] opacity-50">{ticket.phone}</p>
                  </td>
                  <td className="p-5">
                    {ticket.status === 'verified' ? (
                      <div className="flex flex-col gap-1">
                        <code className="text-[9px] font-mono bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 w-fit">
                          QR: {ticket.accessCode}
                        </code>
                        <span className="text-[10px] font-bold text-[#3B2A26]/60">
                          PIN: {ticket.passcode}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">Awaiting Approval</span>
                    )}
                  </td>
                  <td className="p-5 font-bold">₦{ticket.amountPaid.toLocaleString()}</td>
                  <td className="p-5">
                    <button
                      onClick={() => setPreviewImage(ticket.receiptUrl)}
                      className="flex items-center gap-2 text-[#D4AF37] font-bold text-[10px] uppercase hover:underline"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 text-[9px] font-bold uppercase rounded-full ${ticket.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-5 text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(ticket.id, 'declined')}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-all"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={() => handleAction(ticket.id, 'verified')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg"
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-2"
              >
                <X size={18} /> Close
              </button>
              <div className="relative w-full h-[70vh]">
                <Image
                  src={previewImage}
                  alt="Receipt"
                  fill
                  className="object-contain border-2 border-[#D4AF37]"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}