// components/ParallaxCollage.tsx
"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const collageData = [
  { src: '/img.jpg', speed: 0.2, pos: 'top-20 left-[10%]', name: "The Vision" },
  { src: '/img.jpg', speed: 0.4, pos: 'top-60 right-[15%]', name: "The Focus" },
  { src: '/img.jpg', speed: 0.3, pos: 'bottom-40 left-[20%]', name: "The Future" },
];

interface ParallaxItemProps {
  item: typeof collageData[0];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ParallaxItem({ item, containerRef }: ParallaxItemProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150 * item.speed, -150 * item.speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      className={`absolute ${item.pos} z-10`}
    >
      <div className="group relative w-48 h-64 md:w-72 md:h-96 overflow-hidden rounded-sm shadow-2xl border-[12px] border-white transition-all duration-700 hover:border-[#D4AF37]">
        <Image
          src={item.src}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[#3B2A26]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="font-serif text-white text-xl tracking-widest uppercase text-center border-b border-[#D4AF37] pb-2">
            {item.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ParallaxCollage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[150vh] w-full bg-[#F5E9DA] overflow-hidden py-20"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <h2 className="text-[15vw] font-serif text-[#3B2A26] uppercase">
          Legacy
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto h-[100vh]">
        {collageData.map((item, i) => (
          <ParallaxItem key={i} item={item} containerRef={containerRef} />
        ))}
      </div>
    </section>
  );
}