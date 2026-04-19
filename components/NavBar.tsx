"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react'; // Install lucide-react or use an SVG

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Faces', href: '#faces' },
  { name: 'Vote', href: '/vote' },
  { name: 'Book', href: '/book' },
];

// const bookOptions = [
//   { name: 'Digital Yearbook', href: '/book' },
//   { name: 'Commemorative Print', href: '/book' },
// ];

export default function Navbar() {
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-fit">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(59,42,38,0.2)]"
      >
        {/* Standard Links */}
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href} className="px-5 py-2 text-sm font-sans tracking-wide text-white font-bold hover:text-[#D4AF37] transition-colors duration-300">
            {link.name}
          </Link>
        ))}

        {/* Dropdown Link (Book) */}
        

        {/* Visual Accent */}
        {/* <div className="h-4 w-px bg-[#3B2A26]/20 mx-2" /> */}

        {/* <button className="px-5 py-2 rounded-full bg-[#3B2A26] text-[#F5E9DA] text-xs font-sans tracking-widest uppercase hover:bg-[#D4AF37] transition-colors">
          Join
        </button> */}
      </motion.div>
    </nav>
  );
}