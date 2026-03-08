"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import ScrollIndicator from './ScrollIndicator';

export default function HeroCurtain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-100%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-[#F5E9DA]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Background Reveal */}
        <motion.div style={{ scale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/10 z-10" />
          <Image
            src="/img.jpg"
            alt="Graduation Background"
            fill
            className="object-cover blur-sm"
            priority
          />
        </motion.div>

        {/* Curtain Panels */}
        <motion.div style={{ x: leftX }} className="absolute top-0 left-0 w-1/2 h-full bg-[#3B2A26] z-30 border-r border-[#D4AF37]/10" />
        <motion.div style={{ x: rightX }} className="absolute top-0 right-0 w-1/2 h-full bg-[#3B2A26] z-30 border-l border-[#D4AF37]/10" />

        {/* Center Text */}
        <motion.div style={{ opacity }} className="relative z-40 text-center px-4">
          <h1 className="text-6xl md:text-9xl font-serif text-[#F5E9DA] tracking-tighter mb-4">
            THE PRODIGIES
          </h1>
          <p className="text-[#F5E9DA]/70 font-sans tracking-[0.4em] uppercase text-xs md:text-sm">
            Celebrating Excellence. Celebrating Us.
          </p>
        </motion.div>

        <ScrollIndicator  />
      </div>
    </section>
  );
}