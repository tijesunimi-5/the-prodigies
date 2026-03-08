"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function NarrativeSection() {
  return (
    <section className="py-24 bg-[#F5E9DA] px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Artistic Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative h-125 w-full md:grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl "
        >
          <Image
            src="/fybgroup.jpg"
            alt="Campus Life"
            fill
            className="object-cover rounded-sm"
          />
          <div className="absolute inset-0 border border-[#D4AF37] m-4 pointer-events-none" />
        </motion.div>

        {/* Right: The Text */}
        <div className="space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] uppercase tracking-[0.5em] text-xs font-sans"
          >
            Our Philosophy
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif text-[#3B2A26] leading-tight"
          >
            More than a class. <br /> A Legacy in motion.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#3B2A26]/70 leading-relaxed font-sans text-lg"
          >
            &quot;The Prodigies&quot; esents the intersection of relentless ambition and
            collective grace. We didn&quot;t just study together; we redefined what it
            means to grow in an evolving world.
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-px bg-[#D4AF37]"
          />
        </div>
      </div>
    </section>
  );
}