"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

export default function GuestbookModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setIsSubmitted(true), 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3B2A26]/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#F5E9DA] rounded-sm shadow-2xl overflow-hidden border border-[#D4AF37]/30"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[#3B2A26]/40 hover:text-[#3B2A26]">
              <X size={24} />
            </button>

            <div className="p-8 md:p-12">
              {!isSubmitted ? (
                <>
                  <h2 className="text-3xl font-serif text-[#3B2A26] mb-2">Sign the Archive</h2>
                  <p className="text-sm text-[#3B2A26]/60 mb-8 tracking-wide font-sans">
                    Leave a message for the Class of 2026. Your words will be preserved in our digital legacy.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#3B2A26]/40 mb-2">Full Name</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] transition-colors text-[#3B2A26]"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#3B2A26]/40 mb-2">Message</label>
                      <textarea
                        required
                        rows={4}
                        className="w-full bg-transparent border border-[#3B2A26]/20 p-3 outline-none focus:border-[#D4AF37] transition-colors text-[#3B2A26] resize-none"
                        placeholder="Share a memory or wish..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] uppercase tracking-[0.3em] text-xs hover:bg-[#2A1E1B] transition-colors"
                    >
                      Submit to Legacy
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="flex justify-center mb-6 text-[#D4AF37]">
                    <CheckCircle2 size={64} strokeWidth={1} />
                  </div>
                  <h2 className="text-2xl font-serif text-[#3B2A26] mb-4">Message Preserved</h2>
                  <p className="text-sm text-[#3B2A26]/60 mb-8">Thank you for being part of our story.</p>
                  <button
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37] pb-1"
                  >
                    Close Archive
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}