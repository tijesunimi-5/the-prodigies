"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Camera, Trophy, CheckCircle2, TrendingUp, Crown } from "lucide-react";
import Image from "next/image";

const categories = [
  { id: "prestige", label: "The Titles", icon: <Trophy size={16} />, awards: ["Mr. Prodigy", "Miss Prodigy"] },
  { id: "talent", label: "Talent", icon: <Star size={16} />, awards: ["Most Talented", "Tech Genius"] },
  { id: "personality", label: "Character", icon: <Heart size={16} />, awards: ["Most Friendly", "Class Favorite"] },
];

const nominees = [
  { id: 1, name: "Amos Daniel", image: "/daniel.jpg", votes: 142 },
  { id: 2, name: "Precious Adewunmi", image: "/precious.jpg", votes: 128 },
  { id: 3, name: "David Praise", image: "/praise.jpg", votes: 95 },
  { id: 4, name: "Olorunfunmi Favour", image: "/favour.jpeg", votes: 88 },
];

export default function UnifiedVotePage() {
  const [activeTab, setActiveTab] = useState("prestige");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = (award: string, nomineeId: number) => {
    setVotes((prev) => ({ ...prev, [award]: nomineeId }));
  };

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <header className="text-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
            <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-bold">The Registry</span>
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#3B2A26]">Awards & Standings</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT: VOTING ARENA (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] uppercase tracking-widest transition-all ${activeTab === cat.id ? "bg-[#3B2A26] text-[#F5E9DA] shadow-xl" : "bg-white/50 text-[#3B2A26]/40 hover:bg-white"
                    }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-16">
              {categories.find(c => c.id === activeTab)?.awards.map((award) => (
                <section key={award} className="space-y-6">
                  <h2 className="text-2xl font-serif text-[#3B2A26] border-l-4 border-[#D4AF37] pl-4">{award}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {nominees.map((nominee) => (
                      <motion.div
                        key={nominee.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleVote(award, nominee.id)}
                        className={`relative cursor-pointer rounded-sm overflow-hidden border-2 transition-all duration-300 ${votes[award] === nominee.id ? "border-[#D4AF37] bg-white shadow-lg" : "border-transparent opacity-80"
                          }`}
                      >
                        <div className="aspect-[4/5] relative">
                          <Image src={nominee.image} alt={nominee.name} fill className="object-cover" />
                          {votes[award] === nominee.id && (
                            <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                              <CheckCircle2 size={32} className="text-[#3B2A26]" />
                            </div>
                          )}
                        </div>
                        <div className="p-3 text-center">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-[#3B2A26]">{nominee.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* RIGHT: LIVE LEADERBOARD (4 Columns) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 bg-[#3B2A26] rounded-sm p-8 shadow-2xl border border-[#D4AF37]/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[#F5E9DA] font-serif text-2xl">Live Standings</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[8px] text-red-500 font-bold uppercase tracking-tighter">Live</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Simplified Leaderboard List */}
                {nominees.sort((a, b) => b.votes - a.votes).map((person, index) => (
                  <motion.div
                    key={person.id}
                    layout
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[#D4AF37] font-serif italic text-lg w-4">{index + 1}</span>
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/30">
                        <Image src={person.image} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-[#F5E9DA] text-xs font-serif tracking-wide">{person.name}</p>
                        <div className="flex items-center gap-1 text-[8px] text-[#D4AF37] uppercase tracking-widest">
                          <TrendingUp size={8} /> {person.votes} Votes
                        </div>
                      </div>
                    </div>
                    {index === 0 && <Crown size={16} className="text-[#D4AF37] animate-bounce" />}
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <button
                  disabled={Object.keys(votes).length === 0 || isSubmitting}
                  onClick={() => setIsSubmitting(true)}
                  className="w-full py-4 bg-[#D4AF37] text-[#3B2A26] text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#F5E9DA] transition-all disabled:opacity-20"
                >
                  {isSubmitting ? "Preserving..." : "Submit My Ballot"}
                </button>
                <p className="mt-4 text-[9px] text-center text-[#F5E9DA]/40 uppercase tracking-widest leading-relaxed">
                  Votes are encrypted and stored in the Covenant Registry.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}