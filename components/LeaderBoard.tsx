"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import Image from "next/image";

// In production, this data comes from your PostgreSQL database via an API
const leaderboardData = [
  { id: 1, name: "Amos Daniel", category: "Mr. Prodigy", votes: 142, image: "/daniel.jpg", rank: 1 },
  { id: 2, name: "Precious Adewunmi", category: "Miss Prodigy", votes: 128, image: "/precious.jpg", rank: 2 },
  { id: 3, name: "David Praise", category: "Tech Genius", votes: 95, image: "/praise.jpg", rank: 3 },
  { id: 4, name: "Badmus Olakunle", category: "Most Talented", votes: 88, image: "/badmus.jpg", rank: 4 },
  { id: 5, name: "Bolanle Odunola", category: "Class Favorite", votes: 72, image: "/bolanle.jpg", rank: 5 },
];

export default function Leaderboard() {
  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  return (
    <section className="py-24 bg-[#3B2A26] px-6 border-t border-[#D4AF37]/20">
      <div className="max-w-5xl mx-auto">

        <header className="text-center mb-20">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block p-3 rounded-full bg-[#D4AF37]/10 mb-4"
          >
            <Trophy className="text-[#D4AF37]" size={32} />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-serif text-[#F5E9DA]">The Standings</h2>
          <p className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-bold mt-4">
            Live updates from the Covenant Registry
          </p>
        </header>

        {/* --- The Podium (Top 3) --- */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16 px-4">

          {/* 2nd Place */}
          <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-auto">
            <div className="relative w-24 h-24 mb-4 border-2 border-slate-400 rounded-full overflow-hidden">
              <Image src={topThree[1].image} alt="" fill className="object-cover" />
            </div>
            <div className="w-full md:w-32 bg-white/5 border-t-2 border-slate-400 p-4 text-center rounded-t-lg">
              <p className="text-[#F5E9DA] font-serif text-sm truncate">{topThree[1].name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{topThree[1].votes} Votes</p>
            </div>
          </div>

          {/* 1st Place - The Crown */}
          <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-auto z-10">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Crown className="text-[#D4AF37] mb-2" size={40} />
            </motion.div>
            <div className="relative w-32 h-32 mb-4 border-4 border-[#D4AF37] rounded-full overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.2)]">
              <Image src={topThree[0].image} alt="" fill className="object-cover" />
            </div>
            <div className="w-full md:w-44 bg-[#D4AF37]/10 border-t-4 border-[#D4AF37] p-6 text-center rounded-t-lg backdrop-blur-sm">
              <p className="text-[#F5E9DA] font-serif text-lg truncate">{topThree[0].name}</p>
              <p className="text-[10px] text-[#D4AF37] font-black tracking-widest uppercase mt-2">{topThree[0].votes} Votes</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 flex flex-col items-center w-full md:w-auto">
            <div className="relative w-20 h-20 mb-4 border-2 border-orange-700 rounded-full overflow-hidden">
              <Image src={topThree[2].image} alt="" fill className="object-cover" />
            </div>
            <div className="w-full md:w-28 bg-white/5 border-t-2 border-orange-700 p-4 text-center rounded-t-lg">
              <p className="text-[#F5E9DA] font-serif text-xs truncate">{topThree[2].name}</p>
              <p className="text-[9px] text-orange-700 font-bold uppercase mt-1">{topThree[2].votes} Votes</p>
            </div>
          </div>
        </div>

        {/* --- The Board (Remaining Ranks) --- */}
        <div className="max-w-3xl mx-auto space-y-3">
          <AnimatePresence>
            {others.map((person, index) => (
              <motion.div
                key={person.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-sm group hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[#D4AF37] font-serif text-xl italic w-6">{index + 4}</span>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <Image src={person.image} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[#F5E9DA] font-serif tracking-wide">{person.name}</p>
                    <p className="text-[8px] text-[#F5E9DA]/40 uppercase tracking-widest">{person.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <TrendingUp size={14} className="text-[#D4AF37]/50" />
                  <div className="px-4 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold rounded-full border border-[#D4AF37]/20">
                    {person.votes} <span className="text-[8px] ml-1">Votes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}