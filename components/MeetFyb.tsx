"use client";
import { motion } from 'framer-motion';
import MemberCard from './MemberCard';

const graduates = [
  { name: "Julian Thorne", role: "Tech Visionary", image: "/img.jpg" },
  { name: "Sophia Sterling", role: "Creative Lead", image: "/img.jpg" },
  { name: "Alexander Vance", role: "Class President", image: "/img.jpg" },
  { name: "Elena Rossi", role: "Chief Editor", image: "/img.jpg" },
];

export default function MeetFYB() {
  return (
    <section className="py-32 px-6 bg-[#F5E9DA]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex justify-center mb-4">
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
            <span className="mx-4 text-xs tracking-[0.5em] text-[#D4AF37] uppercase">The Class of 2026</span>
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
          </motion.div>
          <h2 className="text-5xl font-serif text-[#3B2A26]">Meet The FYBs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {graduates.map((grad, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <MemberCard {...grad} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}