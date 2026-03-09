"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, X, Megaphone } from "lucide-react";

export default function FloatingActions() {
  const [showScroll, setShowScroll] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);

  // 1. Handle Scroll Visibility
  useEffect(() => {
    const checkScroll = () => {
      // Show button after scrolling 400px
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, [showScroll]);

  // 2. Handle Timed Sponsorship Alert
  useEffect(() => {
    const triggerSponsor = () => {
      setShowSponsor(true);

      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowSponsor(false);
      }, 10000);
    };

    // First appearance after 10 seconds
    const initialTimer = setTimeout(triggerSponsor, 10000);

    // Repeat every 2 minutes (120000ms) to keep it subtle
    const interval = setInterval(triggerSponsor, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-4">

      {/* Sponsorship Alert */}
      <AnimatePresence>
        {showSponsor && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="relative bg-[#F5E9DA] border border-[#D4AF37] p-4 pr-10 shadow-2xl rounded-sm max-w-[280px]"
          >
            <button
              onClick={() => setShowSponsor(false)}
              className="absolute top-2 right-2 text-[#3B2A26]/40 hover:text-[#3B2A26]"
            >
              <X size={16} />
            </button>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-[#3B2A26] rounded-full text-[#D4AF37]">
                <Megaphone size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B2A26]">Sponsorship</p>
                <p className="text-xs text-[#3B2A26]/80 mt-1 leading-relaxed">
                  Support the Prodigies legacy. <span className="text-[#3B2A26] font-bold">Showcase your brand</span> here.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="p-4 bg-[#3B2A26] text-[#D4AF37] border border-[#D4AF37]/30 rounded-full shadow-xl hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}