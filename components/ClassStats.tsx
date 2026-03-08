"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

function Counter({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        (ref.current as HTMLElement).textContent = Math.floor(latest).toString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

export default function ClassStats() {
  const stats = [
    { label: "Creative Prodigies", value: 48, suffix: "" },
    { label: "Projects Launched", value: 124, suffix: "+" },
    { label: "Years of Growth", value: 4, suffix: "" },
  ];

  return (
    <section className="py-24 bg-[#3B2A26] text-[#F5E9DA]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center space-y-2 relative"
            >
              {/* Vertical line for desktop dividers */}
              {index !== 0 && (
                <div className="hidden md:block absolute left-[-24px] top-1/2 -translate-y-1/2 h-16 w-[1px] bg-[#D4AF37]/30" />
              )}

              <div className="text-5xl md:text-7xl font-serif text-[#D4AF37]">
                <Counter value={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#F5E9DA]/50 font-sans">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}