"use client";
import { useState, useEffect, useCallback } from "react";
import { Trophy, BarChart3, Users, Loader2, Sparkles, CheckCircle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Production configurations for the full 30+ member registry
const graduates = [
  { name: "Amos Daniel Eniola", email: "danielamos641@gmail.com", image: "/daniel.jpg" },
  { name: "Adebayo Precious Adewunmi", email: "preciousadebayo51@gmail.com", image: "/precious.jpg" },
  { name: "David Praise Oluwasegun", email: "talk2praisedavid03@gmail.com", image: "/praise.jpg" },
  { name: "Badmus Olakunle", email: "badmusolakunle493@gmail.com", image: "/badmus.jpg" },
  { name: "Bolanle Odunola Precious", email: "bolanleodun78@gmail.com", image: "/bolanle.jpg" },
  { name: "Olorunfunmi Favour Temitayo", email: "olorunfunmifavour@gmail.com", image: "/favour.jpeg" },
  { name: "Egbedeyi Tomiwa Esther", email: "oluwatomiwaegbedeyi@gmail.com", image: "/tomiwa.jpeg" },
  { name: "Adeyemo Goodness Adeyemi", email: "adeyemogoodness825@gmail.com", image: "/adeyemo.jpeg" },
  { name: "Alamu Victoria Temitope", email: "alamuvictoria2@gmail.com", image: "/victoria.jpg" },
  { name: "Adigun Mary Ayomide", email: "adigunmary494@gmail.com", image: "/mary.jpg" },
  { name: "Aina Ifeoluwa", email: "ifeoluwaaina08@gmail.com", image: "/ifeoluwa.jpeg" },
  { name: "Asher Adewunmi Olabode", email: "asherolabode@gmail.com", image: "/asher.jpg" },
  { name: "Araoye Busolami", email: "busolaaraoye@gmail.com", image: "/beautyblack.jpeg" },
  { name: "Akinyemi Imoleayo Akinlabi", email: "imoleayoakinyemi@gmail.com", image: "/imole.jpeg" },
  { name: "Mac Kennie", email: "owoiyakehinda@gmail.com", image: "/kenny.jpeg" },
  { name: "Kayode Temitope", email: "temitopek242@gmail.com", image: "/kayode-temi.jpeg" },
  { name: "Akinleye Peace Aanuoluwa", email: "akinleyepeace@gmail.com", image: "/peace.jpg" },
  { name: "Abu Alexander Godwin", email: "alexgodwin204@gmail.com", image: "/alex.jpg" },
  { name: "Olakanmi Olayide Elizabeth", email: "olayideolakanmi1@gmail.com", image: "/olayide.jpg" },
  { name: "Oyewole Victoria Adesewa", email: "victoriaoyewole31@gmail.com", image: "/oyewole-vic.jpg" },
  { name: "Olaniyan Nathaniel Oluwapelumi", email: "olaniyannathanieloluwapelumi@gmail.com", image: "/nath.jpg" },
  { name: "Oyeleke Esther Odunayo", email: "oyelekee71@gmail.com", image: "/esther.jpeg" },
  { name: "Idowu S.A Tijesunimi", email: "tijesunimiidowu16@gmail.com", image: "/teelight-pic.jpg" },
  { name: "Alao Abisola Rachel", email: "alaoabisola24@gmail.com", image: "/abisola.jpg" },
  { name: "Ashaju Abiodun Elizabeth", email: "asiwajuabiodun16@gmail.com", image: "" },
  { name: "Tolulope Abigeal Solanke", email: "solanketolulope990@gmail.com", image: "" },
  { name: "Aluko Chichi Temiloluwa", email: "alukochichi@gmail.com", image: "" },
  { name: "Akinleye Fulfilment Ooreofeoluwa", email: "akinleyefulfilment@gmail.com", image: "/fulfiment.jpeg" },
  { name: "Babalola Josephine Adesola", email: "babalolajosephineadesola@gmail.com", image: "/babalola.jpg" },
  { name: "OLUWANIFEMI O. ARIBISALA", email: "aribisalaoluwanifemi95@gmail.com", image: "" },
  { name: "Ibirogba Matthew", email: "Mathew.seun14@gmail.com", image: "" }
];

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
  isApproved?: boolean;
}

export default function VotesAdmin() {
  const [viewMode, setViewMode] = useState<"votes" | "nominations">("votes");
  const [loading, setLoading] = useState(true);
  const [rawNominations, setRawNominations] = useState<DataRow[]>([]);
  const [rawVotes, setRawVotes] = useState<DataRow[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/voting-analytics");
      if (res.ok) {
        const data = await res.json();
        setRawNominations(data.nominations || []);
        setRawVotes(data.votes || []);
      }
    } catch (e) {
      console.error("Admin analytical pull error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
    const pollTimer = setInterval(fetchAnalyticsData, 10000);
    return () => clearInterval(pollTimer);
  }, [fetchAnalyticsData]);

  const handleToggleShortlist = async (nominee: DataRow, currentStatus: boolean) => {
    const loadingKey = `${nominee.category}-${nominee.name}`;
    setActionLoading(loadingKey);

    try {
      const res = await fetch("/api/admin/voting-analytics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomineeName: nominee.name,
          category: nominee.category,
          approveStatus: !currentStatus
        })
      });

      if (res.ok) {
        // Update local state immediately for better UX
        setRawNominations(prev =>
          prev.map(item =>
            item.name === nominee.name && item.category === nominee.category
              ? { ...item, isApproved: !currentStatus }
              : item
          )
        );
      } else {
        alert("Failed to update shortlist status.");
      }
    } catch (e) {
      console.error(e);
      alert("Pipeline error updating shortlist.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#3B2A26]" size={24} />
        <span className="text-xs uppercase tracking-widest text-[#3B2A26]/60 font-black">Compiling Standings...</span>
      </div>
    );
  }

  const activeDataset = viewMode === "votes" ? rawVotes : rawNominations;

  return (
    <div className="space-y-10 w-full">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#3B2A26]/10 pb-6">
        <div>
          <h1 className="text-4xl font-serif text-[#3B2A26]">Registry Analytics</h1>
          <p className="text-sm text-[#3B2A26]/60 mt-1">Real-time standings and shortlist management.</p>
        </div>

        <div className="flex bg-black/5 p-1 rounded-sm border border-[#3B2A26]/5 self-start md:self-center shrink-0">
          <button
            onClick={() => setViewMode("votes")}
            className={`px-4 py-2.5 rounded-xs text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${viewMode === "votes" ? "bg-[#3B2A26] text-[#F5E9DA] shadow-md" : "text-[#3B2A26]/50 hover:text-[#3B2A26]"
              }`}
          >
            <BarChart3 size={12} /> Final Ballots Cast
          </button>
          <button
            onClick={() => setViewMode("nominations")}
            className={`px-4 py-2.5 rounded-xs text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${viewMode === "nominations" ? "bg-[#3B2A26] text-[#F5E9DA] shadow-md" : "text-[#3B2A26]/50 hover:text-[#3B2A26]"
              }`}
          >
            <Users size={12} /> Phase 1 Nominations
          </button>
        </div>
      </header>

      <div className="space-y-8 w-full">
        {votingCategories.map((cat) => {
          const categoryPool = activeDataset.filter((item) => item.category === cat.id);
          const aggregateSum = categoryPool.reduce((total, cur) => total + cur.count, 0);

          return (
            <div key={cat.id} className="bg-white p-6 sm:p-8 border border-[#3B2A26]/5 rounded-sm shadow-sm relative overflow-hidden w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-stone-50">
                <div className="flex items-center gap-3">
                  <Trophy size={18} className="text-[#D4AF37] shrink-0" />
                  <h2 className="text-xl font-serif text-[#3B2A26] font-bold">{cat.label}</h2>
                </div>
                <span className="text-[10px] font-black text-[#3B2A26]/50 tracking-widest uppercase bg-black/5 px-3 py-1 rounded-full self-start sm:self-center">
                  {aggregateSum} Total {viewMode === "votes" ? "Votes" : "Nominations"}
                </span>
              </div>

              {categoryPool.length === 0 ? (
                <div className="py-8 text-center text-gray-400 border border-dashed border-gray-100 rounded-sm">
                  <Sparkles size={16} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-[10px] uppercase tracking-wider font-bold">No active data points compiled yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {categoryPool.map((nominee, idx) => {
                      const percentageRatio = aggregateSum > 0 ? (nominee.count / aggregateSum) * 100 : 0;
                      const uniqueKey = `${cat.id}-${nominee.name}`;
                      const isApproved = !!nominee.isApproved;

                      return (
                        <motion.div
                          key={nominee.name}
                          layout
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 w-full border-b border-stone-50 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold uppercase tracking-widest text-[#3B2A26]">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="opacity-30 text-[10px] font-mono shrink-0">0{idx + 1}</span>
                              <span className="truncate">{nominee.name}</span>
                              {viewMode === "nominations" && isApproved && (
                                <span className="bg-green-100 text-green-800 text-[7px] font-black tracking-widest px-2 py-0.5 rounded-full lowercase grow-0 shrink-0">
                                  shortlisted
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                              <span className="font-mono text-stone-500">
                                {nominee.count} ({percentageRatio.toFixed(1)}%)
                              </span>

                              {/* Toggle Logic: Approve nominees to make them appear on the public /vote page */}
                              {viewMode === "nominations" && (
                                <button
                                  disabled={actionLoading === uniqueKey}
                                  onClick={() => handleToggleShortlist(nominee, isApproved)}
                                  className={`px-3 py-1.5 rounded-xs text-[8px] tracking-wider font-black uppercase transition-all cursor-pointer flex items-center gap-1 border ${isApproved
                                      ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                      : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    }`}
                                >
                                  {actionLoading === uniqueKey ? (
                                    <Loader2 size={10} className="animate-spin" />
                                  ) : isApproved ? (
                                    <> <ShieldAlert size={10} /> Drop </>
                                  ) : (
                                    <> <CheckCircle size={10} /> Approve </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

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