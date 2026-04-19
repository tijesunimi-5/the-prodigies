"use client";
import { BarChart, Trophy, TrendingUp } from "lucide-react";
import {motion} from "framer-motion";

export default function VotesAdmin() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-serif text-[#3B2A26]">Voting Analytics</h1>
        <p className="text-sm text-[#3B2A26]/60 mt-2">Real-time standings for all categories.</p>
      </header>

      <div className="space-y-8">
        {["Mr. Prodigy", "Miss Prodigy", "Tech Genius"].map((category) => (
          <div key={category} className="bg-white p-8 border border-[#3B2A26]/5 rounded-sm shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-serif text-[#3B2A26] flex items-center gap-3">
                <Trophy size={20} className="text-[#D4AF37]" /> {category}
              </h2>
              <span className="text-[10px] font-bold text-[#3B2A26]/40 tracking-widest uppercase">142 Total Votes</span>
            </div>

            <div className="space-y-6">
              {[
                { name: "Amos Daniel", votes: 85, color: "bg-[#3B2A26]" },
                { name: "David Praise", votes: 42, color: "bg-[#D4AF37]" },
                { name: "Julian Thorne", votes: 15, color: "bg-[#F5E9DA]" }
              ].map((nominee, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#3B2A26]">
                    <span>{nominee.name}</span>
                    <span>{nominee.votes} Votes</span>
                  </div>
                  <div className="h-2 w-full bg-[#F5E9DA] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(nominee.votes / 142) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${nominee.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}