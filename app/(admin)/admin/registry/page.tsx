"use client";
import { useState, useEffect, useCallback } from "react";
import { Eye, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// 1. Define a proper interface to kill the 'any' error
interface Registration {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  eventName: string;
  amountPaid: number;
  status: 'pending' | 'verified' | 'declined';
  receiptUrl: string | null;
}

export default function RegistryAdmin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 2. Wrap loadData in useCallback to prevent cascading render warnings
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Failed to load registry:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) loadData();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) return (
    <div className="h-96 flex items-center justify-center text-[#3B2A26]">
      <Loader2 className="animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-3xl md:text-4xl font-serif text-[#3B2A26]">Covenant Registry</h1>
        <p className="text-[10px] uppercase font-bold text-[#D4AF37]">{registrations.length} Total</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {registrations.map((reg) => (
          <div key={reg.id} className="bg-white p-5 border border-[#3B2A26]/5 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#D4AF37]/50 transition-all">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-[#F5E9DA] rounded-full flex items-center justify-center text-[#3B2A26] font-bold">
                {reg.fullName[0]}
              </div>
              <div>
                <h3 className="font-serif text-[#3B2A26] text-lg leading-tight">{reg.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase font-bold ${reg.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {reg.status}
                  </span>
                  <p className="text-[9px] text-[#3B2A26]/40 uppercase tracking-widest">{reg.eventName}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              {reg.receiptUrl && (
                <button
                  onClick={() => setPreviewImage(reg.receiptUrl)}
                  className="p-2 bg-[#F5E9DA] text-[#3B2A26] rounded-full hover:bg-[#D4AF37] transition-all"
                >
                  <Eye size={14} />
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate(reg.id, 'verified')}
                className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => handleStatusUpdate(reg.id, 'declined')}
                className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cloudinary Receipt Preview */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-[#1A1210]/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative max-w-lg w-full aspect-video">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-2"
              >
                <X size={18} /> Close Receipt
              </button>
              {/* Using Next.js Image for optimization */}
              <div className="relative w-full h-[70vh]">
                <Image
                  src={previewImage}
                  alt="Receipt"
                  fill
                  className="object-contain border-2 border-[#D4AF37] shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}