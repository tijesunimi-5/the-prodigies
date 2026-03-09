"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  MessageCircle,
  Gift,
  Heart,
  MapPin,
  Sparkles,
  BookOpen,
  Briefcase,
  Church,
  Star,
  Mail
} from "lucide-react";

interface MemberProps {
  name: string;
  image: string;
  dob: string;
  unit: string;
  department: string;
  moment: string;
  status: string;
  skill: string;
  hobbies: string;
  quote: string;
  oneWord: string;
  origin: string;
  whatsapp: string;
  email: string;
}

export default function MemberCard({
  name, image, dob, unit, department, moment, status, skill, hobbies, quote, oneWord, origin, whatsapp, email
}: MemberProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      onClick={() => setShowDetails(!showDetails)}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      className="group relative bg-[#3B2A26] h-[650px] w-full rounded-sm overflow-hidden shadow-2xl border border-[#D4AF37]/20 cursor-pointer"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={name}
        fill
        className={`object-cover transition-all duration-1000 ${showDetails ? "scale-110 opacity-20" : "scale-100 opacity-100"
          }`}
      />

      {/* Badges: One Word & Department */}
      <div className={`absolute top-4 left-4 z-30 flex flex-wrap gap-2 transition-all duration-500 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}>
        <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] uppercase tracking-wider font-bold">
          {oneWord}
        </span>
        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F5E9DA] text-[9px] uppercase tracking-wider">
          {department}
        </span>
      </div>

      {/* Default Banner (Bottom) */}
      <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#3B2A26] via-[#3B2A26]/80 to-transparent z-10 transition-all duration-500 ${showDetails ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        }`}>
        <h3 className="font-serif text-2xl md:text-3xl text-[#F5E9DA] mb-1">{name}</h3>
        <p className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-medium line-clamp-1">{unit}</p>
        <p className="mt-4 text-[10px] text-[#F5E9DA]/40 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} className="animate-pulse text-[#D4AF37]" /> Tap to view profile
        </p>
      </div>

      {/* Full Detail Overlay */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-[#3B2A26]/75 backdrop-blur-[8px]"
          >
            <div className="space-y-4 mb-6 overflow-y-auto max-h-[82%] pr-2 custom-scrollbar">
              <div className="border-b border-[#D4AF37]/20 pb-2">
                <h3 className="font-serif text-2xl text-[#F5E9DA] leading-tight">{name}</h3>
                <div className="flex justify-between items-center text-[#D4AF37] text-[9px] uppercase tracking-widest mt-2">
                  <span className="flex items-center gap-1"><Gift size={10} /> {dob}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {origin}</span>
                </div>
              </div>

              {/* Status & Unit Row */}
              <div className="grid grid-cols-1 gap-2 text-[11px]">
                <div className="p-2 bg-white/5 rounded border border-white/5">
                  <p className="text-[8px] text-[#D4AF37] uppercase mb-1">Church Unit(s)</p>
                  <p className="text-[#F5E9DA] flex items-center gap-1"><Church size={10} /> {unit}</p>
                </div>
              </div>

              {/* Bio Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white/5 rounded">
                  <p className="text-[8px] text-[#D4AF37] uppercase mb-1">Status</p>
                  <p className="text-[#F5E9DA] flex items-center gap-1 font-medium"><Heart size={10} /> {status}</p>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <p className="text-[8px] text-[#D4AF37] uppercase mb-1">Hobbies</p>
                  <p className="text-[#F5E9DA] truncate">{hobbies}</p>
                </div>
              </div>

              {/* Narrative Blocks */}
              <div className="space-y-3">
                <div className="p-3 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/10">
                  <p className="text-[8px] text-[#D4AF37] uppercase mb-1 font-bold">Favorite Moment</p>
                  <p className="text-xs text-[#F5E9DA]/90 italic leading-snug">&quot;{moment}&quot;</p>
                </div>

                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-[8px] text-[#D4AF37] uppercase mb-1 font-bold">Word of God</p>
                  <p className="text-xs text-[#F5E9DA] font-serif leading-relaxed">&quot;{quote}&quot;</p>
                </div>

                <div className="p-3 bg-white/5 rounded">
                  <p className="text-[8px] text-[#D4AF37] uppercase mb-1 font-bold flex items-center gap-1">
                    <Briefcase size={10} /> Skill & Business
                  </p>
                  <p className="text-xs text-[#F5E9DA]">{skill}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-[9px] uppercase tracking-widest font-bold rounded-sm"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a
                href={`mailto:${email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 py-3 bg-[#D4AF37] text-[#3B2A26] text-[9px] uppercase tracking-widest font-bold rounded-sm"
              >
                <Mail size={14} /> Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}