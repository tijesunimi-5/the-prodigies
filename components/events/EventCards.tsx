"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Ticket } from "lucide-react";

interface EventCardProps {
  onRegister: () => void;
}

export default function EventCard({ onRegister }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="group relative bg-[#3B2A26] rounded-sm overflow-hidden shadow-2xl max-w-lg mx-auto border border-[#D4AF37]/20"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/dinner-night.jpg" // The image you'll attach
          alt="Dinner Night"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
        />
        <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#3B2A26] px-4 py-1 text-[10px] font-black uppercase tracking-widest">
          Limited Slots
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-3xl font-serif text-[#F5E9DA] mb-4">The Grand Dinner Night</h3>
        <p className="text-[#F5E9DA]/60 text-sm font-sans leading-relaxed mb-8 italic">
          An evening of red carpets, fine dining, and prophetic declarations.
          Join us as we celebrate the transition of The Prodigies into global giants.
        </p>

        <button
          onClick={onRegister}
          className="w-full py-4 bg-[#D4AF37] text-[#3B2A26] text-[10px] uppercase tracking-[0.4em] font-black hover:bg-[#F5E9DA] transition-all flex items-center justify-center gap-3"
        >
          <Ticket size={16} /> Register Now — ₦5,000
        </button>
      </div>
    </motion.div>
  );
}