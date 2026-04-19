"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import ScrollIndicator from './ScrollIndicator';

// Replace these URLs with your actual student/group photos
const collageImages = [
  // Column 1
  { src: '/daniel.jpg', alt: 'Prodigy Member', col: 1 },
  { src: '/ifeoluwa.jpeg', alt: 'Prodigy Member', col: 1 },
  { src: '/tomiwa.jpeg', alt: 'Class Moment', col: 1 },
  { src: '/bolanle.jpg', alt: 'Class Moment', col: 1 },
  { src: '/imole.jpeg', alt: 'Class Moment', col: 1 },
  { src: '/oyewole-vic.jpg', alt: 'Class Moment', col: 1 },
  // Column 2
  { src: '/beautyblack.jpeg', alt: 'The Group', col: 2 },
  { src: '/favour.jpeg', alt: 'Candid Moment', col: 2 },
  { src: '/precious.jpg', alt: 'Graduation Prep', col: 2 },
  { src: '/victoria.jpg', alt: 'Graduation Prep', col: 2 },
  { src: '/alex.jpg', alt: 'Graduation Prep', col: 2 },
  // Column 3
  { src: '/asher.jpg', alt: 'Achievement', col: 3 },
  { src: '/badmus.jpg', alt: 'Celebration', col: 3 },
  { src: '/praise.jpg', alt: 'Class Moment', col: 3 },
  { src: '/peace.jpg', alt: 'Celebration', col: 3 },
  { src: '/olayide.jpg', alt: 'Celebration', col: 3 },
  { src: '/kenny.jpeg', alt: 'Celebration', col: 3 },
];

export default function HeroCurtain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Curtain Animations: Panels slide out
  const leftX = useTransform(scrollYProgress, [0, 0.4], ["0%", "-100%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.4], ["0%", "100%"]);

  // Text Fade: Disappears as curtains open
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Collage Parallax: Each column moves at a different speed for depth
  const col1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const col2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const col3Y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-[#F5E9DA]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* --- Background Collage (The Reveal) --- */}
        <div className="absolute inset-0 z-0 bg-[#F5E9DA] px-4 md:px-10 py-20">
          {/* Soft overlay to make sure any white space doesn't pop too hard */}
          <div className="absolute inset-0 bg-[#3B2A26]/5 z-10 pointer-events-none" />

          <div className="grid grid-cols-3 gap-3 md:gap-6 h-[120vh]">
            {/* Column 1 */}
            <motion.div style={{ y: col1Y }} className="flex flex-col gap-3 md:gap-6">
              {collageImages.filter(img => img.col === 1).map((img, i) => (
                <div key={i} className="relative aspect-[3/4] w-full shadow-xl">
                  <Image src={img.src} alt={img.alt} fill className="object-cover rounded-sm" sizes="33vw" />
                </div>
              ))}
            </motion.div>

            {/* Column 2 (Center - Moves Faster) */}
            <motion.div style={{ y: col2Y }} className="flex flex-col gap-3 md:gap-6 pt-20">
              {collageImages.filter(img => img.col === 2).map((img, i) => (
                <div key={i} className="relative aspect-[3/4] w-full shadow-xl">
                  <Image src={img.src} alt={img.alt} fill className="object-cover rounded-sm" sizes="33vw" />
                </div>
              ))}
            </motion.div>

            {/* Column 3 */}
            <motion.div style={{ y: col3Y }} className="flex flex-col gap-3 md:gap-6 pt-10">
              {collageImages.filter(img => img.col === 3).map((img, i) => (
                <div key={i} className="relative aspect-[3/4] w-full shadow-xl">
                  <Image src={img.src} alt={img.alt} fill className="object-cover rounded-sm" sizes="33vw" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* --- Curtain Panels --- */}
        <motion.div
          style={{ x: leftX }}
          className="absolute top-0 left-0 w-1/2 h-full bg-[#3B2A26] z-30 border-r border-[#D4AF37]/10 flex items-center justify-end"
        />
        <motion.div
          style={{ x: rightX }}
          className="absolute top-0 right-0 w-1/2 h-full bg-[#3B2A26] z-30 border-l border-[#D4AF37]/10 flex items-center justify-start"
        />

        {/* --- Center Text --- */}
        <motion.div style={{ opacity }} className="relative z-40 text-center px-4 pointer-events-none">
          <h1 className="text-5xl md:text-9xl font-serif text-[#F5E9DA] tracking-tighter mb-4">
            THE PRODIGIES
          </h1>
          <p className="text-[#F5E9DA]/70 font-sans tracking-[0.4em] uppercase text-[10px] md:text-sm">
            Celebrating Excellence. Celebrating Us.
          </p>
        </motion.div>

        <ScrollIndicator />
      </div>
    </section>
  );
}