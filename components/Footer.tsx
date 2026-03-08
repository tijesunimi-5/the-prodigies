"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#1A1210] pt-32 pb-12 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5 }}
            className="w-32 h-[1px] bg-[#D4AF37] mb-12 origin-center"
          />

          <h2 className="text-4xl md:text-6xl font-serif text-[#F5E9DA] mb-8 italic">
            Until our paths cross again.
          </h2>

          <button className="group relative px-10 py-4 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-[0.3em] text-xs transition-all duration-500 hover:text-[#3B2A26]">
            <div className="absolute inset-0 w-0 bg-[#D4AF37] transition-all duration-500 group-hover:w-full -z-10" />
            Sign the Guestbook
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
          <div className="text-left">
            <p className="font-serif text-2xl text-[#F5E9DA]">The Prodigies</p>
            <p className="text-[10px] text-[#F5E9DA]/30 tracking-widest uppercase">Class of 2026 Archive</p>
          </div>

          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-[#F5E9DA]/50 font-sans">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Archive</a>
          </div>
        </div>
      </div>
    </footer>
  );
}