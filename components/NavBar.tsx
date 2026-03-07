"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react'; // Install lucide-react or use an SVG

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Faces', href: '/faces' },
  { name: 'Vote', href: '/vote' },
];

const bookOptions = [
  { name: 'Digital Yearbook', href: '/book/yearbook' },
  { name: 'Commemorative Print', href: '/book/print' },
];

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
          <Link key={link.name} href={link.href} className="px-5 py-2 text-sm font-sans tracking-wide text-[#3B2A26] hover:text-[#D4AF37] transition-colors duration-300">
            {link.name}
          </Link>
        ))}

        {/* Dropdown Link (Book) */}
        <div
          className="relative"
          onMouseEnter={() => setIsBookOpen(true)}
          onMouseLeave={() => setIsBookOpen(false)}
        >
          <button className="flex items-center gap-1 px-5 py-2 text-sm font-sans tracking-wide text-[#3B2A26] hover:text-[#D4AF37] transition-colors duration-300 outline-none">
            Book
            <motion.div animate={{ rotate: isBookOpen ? 180 : 0 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>

          {/* Glassmorphism Dropdown */}
          <AnimatePresence>
            {isBookOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-48 py-2 rounded-2xl bg-[#F5E9DA]/80 backdrop-blur-2xl border border-white/40 shadow-xl overflow-hidden"
              >
                {bookOptions.map((option) => (
                  <Link
                    key={option.name}
                    href={option.href}
                    className="block px-4 py-3 text-xs uppercase tracking-widest text-[#3B2A26] hover:bg-[#3B2A26] hover:text-[#F5E9DA] transition-all duration-300"
                  >
                    {option.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Visual Accent */}
        {/* <div className="h-4 w-px bg-[#3B2A26]/20 mx-2" /> */}

        {/* <button className="px-5 py-2 rounded-full bg-[#3B2A26] text-[#F5E9DA] text-xs font-sans tracking-widest uppercase hover:bg-[#D4AF37] transition-colors">
          Join
        </button> */}
      </motion.div>
    </nav>
  );
}