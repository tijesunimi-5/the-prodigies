"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MemberProps {
  name: string;
  role: string;
  image: string;
}

export default function MemberCard({ name, role, image }: MemberProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white/40 backdrop-blur-md p-8 rounded-xl border border-[#3B2A26]/5 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-[#D4AF37] ring-offset-4 ring-2 ring-[#3B2A26]/5">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <h3 className="font-serif text-xl text-[#3B2A26] mb-1">{name}</h3>
        <p className="text-xs font-sans tracking-[0.2em] uppercase text-[#3B2A26]/50 italic">{role}</p>
      </div>
    </motion.div>
  );
}