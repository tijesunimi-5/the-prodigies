"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuestbookModal({ isOpen, onClose }: GuestbookModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a network delay for cinematic effect
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  // Reset state when closing after submission
  const handleClose = () => {
    onClose();
    setTimeout(() => setIsSubmitted(false), 500);
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
            onClick={handleClose}
            className="absolute inset-0 bg-[#1A1210]/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#F5E9DA] rounded-sm shadow-2xl overflow-hidden border border-[#D4AF37]/20"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[#3B2A26]/40 hover:text-[#3B2A26] z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              {!isSubmitted ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-serif text-[#3B2A26] mb-2 text-center md:text-left">Sign the Archive</h2>
                    <p className="text-sm text-[#3B2A26]/60 tracking-wide font-sans text-center md:text-left">
                      Leave a congratulatory message or a shared memory for The Prodigies.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#3B2A26]/40 font-bold">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Professor Smith"
                        className="w-full bg-transparent border-b border-[#3B2A26]/20 py-2 outline-none focus:border-[#D4AF37] transition-colors text-[#3B2A26] placeholder:text-[#3B2A26]/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#3B2A26]/40 font-bold">Your Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write something beautiful..."
                        className="w-full bg-white/30 border border-[#3B2A26]/10 p-4 outline-none focus:border-[#D4AF37] transition-colors text-[#3B2A26] resize-none rounded-sm"
                      />
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] uppercase tracking-[0.4em] text-[10px] font-bold hover:bg-[#2A1E1B] transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Preserving..." : "Submit to Legacy"}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="flex justify-center text-[#D4AF37]">
                    <CheckCircle2 size={64} strokeWidth={1} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-[#3B2A26] mb-2">Entry Preserved</h2>
                    <p className="text-sm text-[#3B2A26]/60">Your message has been added to our digital history.</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="pt-4 text-[10px] uppercase tracking-widest text-[#D4AF37] hover:tracking-[0.2em] transition-all border-b border-[#D4AF37]/0 hover:border-[#D4AF37]"
                  >
                    Return to Archive
                  </button>
                </motion.div>
              )}
            </div>

            {/* Decorative Gold Bottom Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#3B2A26] via-[#D4AF37] to-[#3B2A26]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}