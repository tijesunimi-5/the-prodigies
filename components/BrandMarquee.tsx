"use client";
import { motion } from "framer-motion";

const brands = [
  "Amos Daniel Eniola", "Precious Adewunmi", "David Praise", "Badmus Olakunle",
  "Bolanle Odunola", "Favour Temitayo", "Tomiwa Esther", "Goodness Adeyemi",
  "Victoria Temitope", "Mary Ayomide", "Ifeoluwa Aina", "Asher Olabode"
];

export default function BrandMarquee() {
  return (
    <div className="py-12 bg-[#F5E9DA] border-y border-[#3B2A26]/5 overflow-hidden">
      {/* Optional: Small Label above the marquee */}
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
        <span className="text-[9px] tracking-[0.4em] text-[#3B2A26]/40 uppercase font-bold">
          Supported by our community
        </span>
        <a
          href="https://wa.me/08140629029?text=I%20want%20to%20showcase%20my%20brand%20for%20N2000"
          className="text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase font-bold border-b border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
        >
          Join the Wall — ₦2,000
        </a>
      </div>

      <div className="relative flex overflow-hidden select-none">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {/* We loop through the list twice to create the infinite effect */}
          {[...brands, ...brands].map((name, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="text-2xl md:text-4xl font-serif text-[#3B2A26]/20 hover:text-[#3B2A26] transition-colors duration-500 cursor-default uppercase tracking-tighter">
                {name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}