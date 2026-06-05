"use client";
import { useState, useEffect } from "react";
import { Trophy, BarChart3, Users, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Clean static metadata map for database key conversions
const votingCategories = [
  { id: "most_active", label: "Most Active", color: "bg-[#3B2A26]" },
  { id: "best_dressed_male", label: "Best Dressed (Male)", color: "bg-[#D4AF37]" },
  { id: "best_dressed_female", label: "Best Dressed (Female)", color: "bg-[#3B2A26]" },
  { id: "most_reserved", label: "Most Reserved", color: "bg-stone-500" },
  { id: "most_industrious", label: "Most Industrious", color: "bg-[#D4AF37]" },
  { id: "outstanding_student", label: "Outstanding Student", color: "bg-amber-800" }
];

interface DataRow {
  category: string;
  name: string;
  count: number;
}

export default function VotesAdmin() {
  const [viewMode, setViewMode] = useState<"votes" | "nominations">("votes");
  const [loading, setLoading] = useState(true);
  const [rawNominations, setRawNominations] = useState<DataRow[]>([]);
  const [rawVotes, setRawVotes] = useState<DataRow[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await fetch("/api/admin/voting-analytics");
        if (res.ok) {
          const data = await res.json();
          setRawNominations(data.nominations || []);
          setRawVotes(data.votes || []);
        }
      } catch (e) {
        console.error("Failed loading admin stream:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
    // Auto-refresh data loop every 10 seconds for real-time tracking
    const pollTimer = setInterval(fetchAnalyticsData, 10000);
    return () => clearInterval(pollTimer);
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#3B2A26]" size={24} />
        <span className="text-xs uppercase tracking-widest text-[#3B2A26]/60 font-bold">Compiling Standings...</span>
      </div>
    );
  }

  // Choose our active data pool based on state mode selection
  const activeDataset = viewMode === "votes" ? rawVotes : rawNominations;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#3B2A26]/10 pb-6">
        <div>
          <h1 className="text-4xl font-serif text-[#3B2A26]">Registry Analytics</h1>
          <p className="text-sm text-[#3B2A26]/60 mt-1">Monitor real-time data metrics for internal ballots and submissions.</p>
        </div>

        {/* Navigation Mode Sub-Toggle Controls */}
        <div className="flex bg-black/5 p-1 rounded-sm border border-[#3B2A26]/5 self-start md:self-center">
          <button
            onClick={() => setViewMode("votes")}
            className={`px-4 py-2.5 rounded-xs text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "votes" ? "bg-[#3B2A26] text-[#F5E9DA] shadow-md" : "text-[#3B2A26]/50 hover:text-[#3B2A26]"
            }`}
          >
            <BarChart3 size={12} /> Final Ballots Cast
          </button>
          <button
            onClick={() => setViewMode("nominations")}
            className={`px-4 py-2.5 rounded-xs text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "nominations" ? "bg-[#3B2A26] text-[#F5E9DA] shadow-md" : "text-[#3B2A26]/50 hover:text-[#3B2A26]"
            }`}
          >
            <Users size={12} /> Phase 1 Nominations
          </button>
        </div>
      </header>

      {/* Grid Layout Cards mapping our 6 categories */}
      <div className="space-y-8">
        {votingCategories.map((cat) => {
          // Filter matching lines for current category ID row
          const categoryPool = activeDataset.filter((item) => item.category === cat.id);
          
          // Calculate cumulative summation totals for percentages computation baseline
          const aggregateSum = categoryPool.reduce((total, cur) => total + cur.count, 0);

          return (
            <div key={cat.id} className="bg-white p-8 border border-[#3B2A26]/5 rounded-sm shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-stone-50">
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-[#D4AF37] shrink-0" />
                  <h2 className="text-xl font-serif text-[#3B2A26] font-bold">{cat.label}</h2>
                </div>
                <span className="text-[10px] font-black text-[#3B2A26]/50 tracking-widest uppercase bg-black/5 px-3 py-1 rounded-full">
                  {aggregateSum} Total {viewMode === "votes" ? "Votes Cast" : "Nominations Logged"}
                </span>
              </div>

              {categoryPool.length === 0 ? (
                <div className="py-6 text-center text-gray-400 border border-dashed border-gray-100 rounded-sm">
                  <Sparkles size={16} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-[10px] uppercase tracking-wider font-bold">No data compiled in this track yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {categoryPool.map((nominee, idx) => {
                      // Prevent zero division mathematical layout breaks
                      const percentageRatio = aggregateSum > 0 ? (nominee.count / aggregateSum) * 100 : 0;

                      return (
                        <motion.div 
                          key={nominee.name} 
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#3B2A26]">
                            <div className="flex items-center gap-2">
                              <span className="opacity-30 text-[10px] font-mono">0{idx + 1}</span>
                              <span className="truncate max-w-[200px] sm:max-w-md">{nominee.name}</span>
                            </div>
                            <span className="font-mono text-stone-500">
                              {nominee.count} {viewMode === "votes" ? "Votes" : "Nominations"} ({percentageRatio.toFixed(1)}%)
                            </span>
                          </div>

                          {/* Dynamic Custom Chart Bar Tracking Box */}
                          <div className="h-2 w-full bg-[#F5E9DA]/60 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentageRatio}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full ${cat.color}`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}