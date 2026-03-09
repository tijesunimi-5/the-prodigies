"use client";
import { motion } from "framer-motion";
import { MessageCircle, Zap, ShieldCheck } from "lucide-react";

const sponsors = [
  "Your Brand Here", "Prodigy Tech", "Covenant Boutique", "Grace Logistics",
  "Excel Catering", "Visionary Arts", "The Haven", "Legacy Studios",
  "Kingdom Stylist", "Faithful Prints", "Zion Media", "Agape Foods"
];

export default function SponsorSection() {
  return (
    <section className="py-24 bg-[#3B2A26] overflow-hidden border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center md:text-left flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-bold">Visibility Hub</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-serif text-[#F5E9DA] leading-tight mb-6">
            Showcase Your <span className="italic text-[#D4AF37]">Brand.</span>
          </h2>
          <p className="text-[#F5E9DA]/60 text-sm md:text-base leading-relaxed">
            Join our growing circle of partners. For just <span className="text-[#D4AF37] font-bold">₦2,000</span>,
            feature your brand in our digital archive and reach the entire community.
          </p>
        </div>

        <a
          href="https://wa.me/08140629029?text=I%20want%20to%20showcase%20my%20brand%20for%20N2000"
          className="group relative px-8 py-4 bg-[#D4AF37] text-[#3B2A26] text-[10px] uppercase tracking-[0.3em] font-bold rounded-sm transition-all hover:bg-[#F5E9DA]"
        >
          Secure Your Slot — ₦2,000
        </a>
      </div>

      {/* --- The Animated Marquee --- */}
      <div className="relative flex flex-col gap-6 select-none">
        {/* Row 1: Moving Left */}
        <div className="flex overflow-hidden group">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex whitespace-nowrap gap-6 py-4"
          >
            {[...sponsors, ...sponsors].map((name, i) => (
              <div
                key={i}
                className="px-8 py-4 border border-[#D4AF37]/30 bg-white/5 backdrop-blur-sm flex items-center gap-3 min-w-[250px] group-hover:border-[#D4AF37] transition-colors"
              >
                <Zap size={14} className="text-[#D4AF37]" />
                <span className="text-[#F5E9DA] font-serif tracking-widest uppercase text-xs">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="flex overflow-hidden group">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            className="flex whitespace-nowrap gap-6 py-4"
          >
            {[...sponsors, ...sponsors].map((name, i) => (
              <div
                key={i}
                className="px-8 py-4 border border-[#D4AF37]/10 bg-white/5 backdrop-blur-sm flex items-center gap-3 min-w-[250px] group-hover:border-[#D4AF37] transition-colors"
              >
                <ShieldCheck size={14} className="text-[#D4AF37]/50" />
                <span className="text-[#F5E9DA]/60 font-serif tracking-widest uppercase text-xs italic">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <p className="text-[10px] text-[#F5E9DA]/20 tracking-[0.4em] uppercase text-center">
          Building community • Supporting vision • Class of 2026
        </p>
      </div>
    </section>
  );
}