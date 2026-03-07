// components/ScrollIndicator.tsx
"use client";
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollIndicator() {
  // Hooking into global scroll directly to avoid serialization errors
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 h-32 w-0.5 bg-[#3B2A26]/20 z-50 hidden md:block">
      <motion.div
        style={{ height }}
        className="w-full bg-[#D4AF37]"
      />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-[#3B2A26]/60 uppercase [writing-mode:vertical-lr]">
        Scroll
      </div>
    </div>
  );
}