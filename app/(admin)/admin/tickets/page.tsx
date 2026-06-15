"use client";
import { useState, useEffect, useCallback } from "react";
import { Check, X, Eye, Loader2, Ticket, Plus, Sparkles, Search, Clipboard, Users } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TicketItem {
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

interface CouponRow {
  id: number;
  code: string;
  status: string;
  usedBy: string | null;
  created: string;
  used: string | null;
}

export default function TicketsAdmin() {
  // Navigation State Switch: Ledger vs Coupon Factory
  const [viewMode, setViewMode] = useState<"ledger" | "coupons">("ledger");
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Coupon Generator States
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [couponQuantity, setCouponQuantity] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [couponSearch, setCouponSearch] = useState("");

  const loadDataPools = useCallback(async () => {
    try {
      // 1. Fetch Registrations
      const res = await fetch("/api/admin/registrations");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }

      // 2. Fetch Coupons
      const couponRes = await fetch("/api/admin/coupons");
      if (couponRes.ok) {
        const couponData = await couponRes.json();
        setCoupons(couponData);
      }
    } catch (error) {
      console.error("Failed to sync backend admin entities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataPools();
  }, [loadDataPools]);

  const handleAction = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) loadDataPools();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleCreateCoupons = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: couponQuantity })
      });
      if (res.ok) {
        // Force refresh to pull newly generated rows immediately
        const couponRes = await fetch("/api/admin/coupons");
        if (couponRes.ok) setCoupons(await couponRes.json());
        setCouponQuantity("5");
      } else {
        alert("Error executing backend coupon generation.");
      }
    } catch (error) {
      console.error("Voucher creation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied code: ${text}`);
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
    </div>
  );

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
    (c.usedBy && c.usedBy.toLowerCase().includes(couponSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#3B2A26]/10 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#3B2A26]">Ticket Registry</h1>
          <p className="text-sm text-[#3B2A26]/60 mt-1">Manage event access, verify 2FA security pins, and monitor coupon pipelines.</p>
        </div>

        {/* Sub-Tab Navigation Selectors */}
        <div className="flex bg-black/5 p-1 rounded-sm border border-[#3B2A26]/5 shrink-0">
          <button
            onClick={() => setViewMode("ledger")}
            className={`px-4 py-2.5 rounded-xs text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${viewMode === "ledger" ? "bg-[#3B2A26] text-[#F5E9DA] shadow-md" : "text-[#3B2A26]/50 hover:text-[#3B2A26]"
              }`}
          >
            <Users size={12} /> Guest Ledger
          </button>
          <button
            onClick={() => setViewMode("coupons")}
            className={`px-4 py-2.5 rounded-xs text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${viewMode === "coupons" ? "bg-[#3B2A26] text-[#F5E9DA] shadow-md" : "text-[#3B2A26]/50 hover:text-[#3B2A26]"
              }`}
          >
            <Ticket size={12} /> Coupon Factory
          </button>
        </div>
      </header>

      {/* VIEW CONDITIONAL RENDERING BASELINE */}
      {viewMode === "ledger" ? (
        <div className="bg-white rounded-sm border border-[#3B2A26]/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center font-bold tracking-wider text-[#3B2A26]/40 uppercase text-xs">
                      No ticket submissions recorded yet.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
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
                          className="flex items-center gap-2 text-[#D4AF37] font-bold text-[10px] uppercase hover:underline cursor-pointer"
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
                            className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-all cursor-pointer"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={() => handleAction(ticket.id, 'verified')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-sm transition-all cursor-pointer"
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* --- INTEGRATED COMPREHENSIVE COUPON FACTORY WORKSPACE PANEL --- */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">

          {/* MINT ENGINE CARD MODULE */}
          <div className="xl:col-span-4 bg-white border border-[#3B2A26]/5 p-6 rounded-sm shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-[#3B2A26] font-bold border-b pb-2">Mint Discount Vouchers</h3>
            <form onSubmit={handleCreateCoupons} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-stone-400 block mb-1">Voucher Count</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={couponQuantity}
                  onChange={(e) => setCouponQuantity(e.target.value)}
                  className="w-full text-[#3B2A26] bg-stone-50 border rounded-sm p-3 text-sm font-bold font-mono outline-none focus:border-[#D4AF37]"
                />
                <p className="text-[10px] text-stone-400 mt-2 font-sans leading-relaxed">
                  Generates unique tokens. Each code reduces the ticket checkout total by exactly <strong className="text-[#3B2A26]">₦500</strong>.
                </p>
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase font-black tracking-widest hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <><Plus size={12} /> Create Discount Codes</>}
              </button>
            </form>
          </div>

          {/* DYNAMIC TOKEN LEDGER ROW MATRIX */}
          <div className="xl:col-span-8 bg-white border border-[#3B2A26]/5 p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2">
              <h3 className="font-serif text-lg text-[#3B2A26] font-bold">Active Codes Matrix ({coupons.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search size={13} className="absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by code or email..."
                  value={couponSearch}
                  onChange={(e) => setCouponSearch(e.target.value)}
                  className="w-full bg-stone-50 border rounded-sm pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#3B2A26] font-sans"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto border border-stone-100 rounded-sm">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-[#3B2A26] text-[#F5E9DA] text-[9px] font-black uppercase sticky top-0 z-10">
                    <th className="p-3 pl-4">Voucher Code</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Claimed By</th>
                    <th className="p-3 text-right pr-4">Activity Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {filteredCoupons.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 uppercase text-[9px] font-bold">
                        <Sparkles size={14} className="mx-auto mb-1 opacity-40" /> No matches found
                      </td>
                    </tr>
                  ) : (
                    filteredCoupons.map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-3 pl-4 font-bold text-stone-800 text-sm flex items-center gap-2">
                          <span>{c.code}</span>
                          <button
                            onClick={() => copyToClipboard(c.code)}
                            className="text-stone-300 hover:text-[#D4AF37] cursor-pointer transition-colors"
                            title="Copy code"
                          >
                            <Clipboard size={12} />
                          </button>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-black tracking-wider ${c.status === "Active" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
                            }`}>
                            {c.status === "Active" ? "Active" : "Redeemed"}
                          </span>
                        </td>
                        <td className="p-3 text-stone-600 font-bold font-sans">₦500</td>
                        <td className="p-3 text-xs font-sans text-stone-500 max-w-[150px] truncate">
                          {c.usedBy || <span className="opacity-20">—</span>}
                        </td>
                        <td className="p-3 text-[10px] text-stone-400 text-right pr-4 whitespace-nowrap">
                          {c.status === "Used" ? `Claimed: ${c.used}` : `Minted: ${c.created}`}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Image Preview Lightbox Drawer */}
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
                className="absolute -top-10 right-0 text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
              >
                <X size={18} /> Close
              </button>
              <div className="relative w-full h-[70vh]">
                <Image
                  src={previewImage}
                  alt="Receipt Link"
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