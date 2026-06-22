"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Heart, Award, Sparkles, User, CheckCircle2, TrendingUp, Crown, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TicketStatusFloat from "@/components/events/TicketStatusFloat";
import Navbar from "@/components/NavBar";

// Internal TypeScript interface to satisfy ESLint without using "any"
interface RemoteAuditLogItem {
  id: number;
  buyerEmail: string;
  category: string;
  nomineeName: string;
}

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
  { name: "Ashaju Abiodun Elizabeth", email: "asiwajuabiodun16@gmail.com", image: "/abiodun.jpg" },
  { name: "Tolulope Abigeal Solanke", email: "solanketolulope990@gmail.com", image: "" },
  { name: "Aluko Chichi Temiloluwa", email: "alukochichi@gmail.com", image: "/chichi.jpg" },
  { name: "Akinleye Fulfilment Ooreofeoluwa", email: "akinleyefulfilment@gmail.com", image: "/fulfiment.jpeg" },
  { name: "Babalola Josephine Adesola", email: "babalolajosephineadesola@gmail.com", image: "/babalola.jpg" },
  { name: "OLUWANIFEMI O. ARIBISALA", email: "aribisalaoluwanifemi95@gmail.com", image: "/nifemi.jpg" },
  { name: "Ibirogba Matthew", email: "Mathew.seun14@gmail.com", image: "/matthew.jpg" },
  { name: "Akinleye Fulfilment Ooreofeoluwa", email: "akinleyefulfilment@gmail.com", image: "/fulfilment.jpeg" },
  { name: "Rapheal Sinaayomi Victor", email: "", image: "/victor.jpg" }
];

const votingCategories = [
  { id: "most_active", label: "Most Active", icon: <Sparkles size={14} /> },
  { id: "best_dressed_male", label: "Best Dressed (M)", icon: <Trophy size={14} /> },
  { id: "best_dressed_female", label: "Best Dressed (F)", icon: <Award size={14} /> },
  { id: "most_reserved", label: "Most Reserved", icon: <Heart size={14} /> },
  { id: "most_industrious", label: "Most Industrious", icon: <Star size={14} /> }
];

const findImageByName = (name: string) => {
  const match = graduates.find(g =>
    g.name.toLowerCase().trim().includes(name.toLowerCase().trim()) ||
    name.toLowerCase().trim().includes(g.name.toLowerCase().trim())
  );
  return match ? match.image : null;
};

export default function TransformedVotePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("most_active");
  const [userSession, setUserSession] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [dbNominees, setDbNominees] = useState<{ category: string; name: string }[]>([]);
  const [dbStandings, setDbStandings] = useState<{ category: string; name: string; votes: number }[]>([]);
  const [submittedCategories, setSubmittedCategories] = useState<string[]>([]);
  const [ballot, setBallot] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pullCoreVotingMatrix = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/voting-clock");
      if (res.ok) {
        const data = await res.json();
        setDbNominees(data.nominees || []);
        setDbStandings(data.standings || []);
      }
    } catch (error) {
      // FIXED: Safely logged the error string context without leaking unused 'e' markers
      console.error("Data pipeline exception context:", error);
    }
  }, []);

  // FIXED: Explicit type matching replaces old 'any' tags seamlessly
  const syncUserCastHistory = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/admin/audit-votes`);
      if (res.ok) {
        const data = await res.json();
        const userVotes = (data.logs || []).filter(
          (log: RemoteAuditLogItem) => log.buyerEmail.toLowerCase().trim() === email.toLowerCase().trim()
        );

        const categoriesAlreadyVoted = userVotes.map((v: RemoteAuditLogItem) => v.category);
        const preFilledBallots: Record<string, string> = {};
        userVotes.forEach((v: RemoteAuditLogItem) => {
          preFilledBallots[v.category] = v.nomineeName;
        });

        setSubmittedCategories(categoriesAlreadyVoted);
        setBallot(prev => ({ ...prev, ...preFilledBallots }));
      }
    } catch (error) {
      console.error("Failed syncing user voting map history:", error);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("prodigy_user_session");
    if (saved) {
      const parsedSession = JSON.parse(saved);
      setUserSession(parsedSession);

      pullCoreVotingMatrix()
        .then(() => syncUserCastHistory(parsedSession.email))
        .then(() => setLoading(false));
    } else {
      pullCoreVotingMatrix().then(() => setLoading(false));
    }
  }, [pullCoreVotingMatrix, syncUserCastHistory]);

  const handleSelectNominee = (categoryKey: string, candidateName: string) => {
    if (submittedCategories.includes(categoryKey)) return;
    setBallot(prev => ({ ...prev, [categoryKey]: candidateName }));
  };

  const executeBallotSubmit = async () => {
    if (!userSession) return;

    const pendingBallots: Record<string, string> = {};
    Object.keys(ballot).forEach(cat => {
      if (!submittedCategories.includes(cat) && ballot[cat]) {
        pendingBallots[cat] = ballot[cat];
      }
    });

    if (Object.keys(pendingBallots).length === 0) {
      alert("You don't have any new unsubmitted selections on your active card.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/secure-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterEmail: userSession.email.toLowerCase().trim(),
          ballots: pendingBallots
        })
      });

      if (res.ok) {
        alert("Success! Your new category selections have been logged securely.");
        await pullCoreVotingMatrix();
        await syncUserCastHistory(userSession.email);
      } else {
        const data = await res.json();
        alert(`Voting Rejected: ${data.error || "Session mismatch or unauthorized user."}`);
      }
    } catch (error) {
      alert("Network exception posting ballot rows.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNominees = dbNominees.filter(n => n.category === activeTab);
  const filteredLeaderboard = dbStandings.filter(s => s.category === activeTab).sort((a, b) => b.votes - a.votes);
  const activeLabel = votingCategories.find(c => c.id === activeTab)?.label || "";

  const isCurrentTabSubmitted = submittedCategories.includes(activeTab);
  const hasNewPendingVotes = Object.keys(ballot).some(cat => !submittedCategories.includes(cat) && ballot[cat]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5E9DA] flex items-center justify-center">
        <Loader2 size={32} className="text-[#3B2A26] animate-spin" />
      </div>
    );
  }

  if (!userSession) {
    return (
      <main className="min-h-screen bg-[#F5E9DA] pt-36 flex flex-col items-center px-6">
        <Navbar />
        <div className="max-w-md text-center space-y-6 bg-white/40 p-8 border border-[#3B2A26]/5 shadow-xl rounded-sm backdrop-blur-md">
          <Trophy size={48} className="text-[#D4AF37] mx-auto animate-pulse" />
          <h2 className="font-serif text-3xl text-[#3B2A26]">Secure Ballot Station</h2>
          <p className="text-sm text-[#3B2A26]/70 leading-relaxed">To prevent double-voting and block fake accounts, you must complete your 2-Hour Device Verification Roster Pass before voting.</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/vote-register")}
              className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase font-black tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus size={12} /> Go to Registration Page
            </button>
            <button
              onClick={() => router.push("/vote-login")}
              className="w-full py-3.5 bg-transparent border border-[#3B2A26]/30 text-[#3B2A26] text-[10px] uppercase font-bold tracking-widest hover:border-[#3B2A26] hover:bg-[#3B2A26]/5 transition-all cursor-pointer"
            >
              Already Registered? Log In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-4 md:px-8">
      {/* FIXED: Adjusted to standard canonical max width limits to stop linters */}
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <header className="text-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-4 mb-4">
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
            <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-bold">The Ballot Box</span>
            <div className="w-12 h-px bg-[#D4AF37] self-center" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#3B2A26]">Awards & Standings</h1>
        </header>

        <div className="flex flex-wrap gap-2.5 justify-center mb-12 max-w-4xl mx-auto">
          {votingCategories.map((cat) => {
            const isVoted = submittedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${activeTab === cat.id
                    ? "bg-[#3B2A26] text-[#F5E9DA] shadow-xl"
                    : "bg-white/50 text-[#3B2A26]/50 hover:bg-white"
                  }`}
              >
                {cat.icon} {cat.label} {isVoted && "✓"}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-[#3B2A26] border-l-4 border-[#D4AF37] pl-4">
                Official Nominees: {activeLabel}
              </h2>
              {isCurrentTabSubmitted && (
                <span className="text-[9px] font-sans font-black uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-sm flex items-center gap-1">
                  <ShieldCheck size={10} /> Vote Confirmed & Locked
                </span>
              )}
            </div>

            {filteredNominees.length === 0 ? (
              <div className="bg-white/30 border border-dashed border-[#3B2A26]/10 p-12 text-center rounded-sm">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  No nominations submitted for this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredNominees.map((nominee, idx) => {
                  const isSelected = ballot[activeTab] === nominee.name;
                  const displayImage = findImageByName(nominee.name);

                  return (
                    <motion.div
                      key={idx}
                      whileTap={isCurrentTabSubmitted ? {} : { scale: 0.98 }}
                      onClick={() => handleSelectNominee(activeTab, nominee.name)}
                      className={`relative rounded-sm overflow-hidden border-2 transition-all duration-300 ${isSelected ? "border-[#D4AF37] bg-white shadow-lg" : "border-transparent opacity-85 hover:opacity-100"
                        } ${isCurrentTabSubmitted ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                    >
                      {/* FIXED: Adjusted custom aspect layout syntax to match canonical conventions */}
                      <div className="aspect-square relative bg-stone-800 flex flex-col items-center justify-center text-center p-4">
                        {displayImage ? (
                          <Image
                            src={displayImage}
                            alt={nominee.name}
                            fill
                            sizes="(max-w-768px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-[#D4AF37]/40">
                            <User size={36} className="stroke-[1.5]" />
                            <span className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">Photo Pending</span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center z-10">
                            <CheckCircle2 size={32} className="text-[#3B2A26]" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 text-center bg-white/50">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#3B2A26] truncate">{nominee.name}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 bg-[#3B2A26] rounded-sm p-8 shadow-2xl border border-[#D4AF37]/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[#F5E9DA] font-serif text-2xl">Live Standings</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[8px] text-red-500 font-bold uppercase tracking-tighter">Live Tracker</span>
                </div>
              </div>

              <div className="space-y-6">
                {filteredLeaderboard.length === 0 ? (
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center py-6 border border-dashed border-white/10 rounded-sm">
                    Awaiting First Cast Ballots
                  </p>
                ) : (
                  filteredLeaderboard.map((person, index) => {
                    const avatarImg = findImageByName(person.name);

                    const getRankLabel = (idx: number) => {
                      if (idx === 0) return "1st Place";
                      if (idx === 1) return "2nd Place";
                      if (idx === 2) return "3rd Place";
                      return `${idx + 1}th Place`;
                    };

                    return (
                      <motion.div key={index} layout className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <span className="text-[#D4AF37] font-serif italic text-lg w-4">{index + 1}</span>
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/30 bg-stone-700 flex items-center justify-center">
                            {avatarImg ? (
                              <Image
                                src={avatarImg}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <User size={16} className="text-[#D4AF37]/50" />
                            )}
                          </div>
                          <div>
                            <p className="text-[#F5E9DA] text-xs font-serif tracking-wide w-40 truncate">{person.name}</p>
                            <div className="flex items-center gap-1 text-[8px] text-[#D4AF37] uppercase tracking-widest font-black">
                              <TrendingUp size={8} /> {getRankLabel(index)}
                            </div>
                          </div>
                        </div>
                        {index === 0 && <Crown size={16} className="text-[#D4AF37] animate-pulse" />}
                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <button
                  disabled={!hasNewPendingVotes || isSubmitting}
                  onClick={executeBallotSubmit}
                  className="w-full py-4 bg-[#D4AF37] text-[#3B2A26] text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#F5E9DA] transition-all disabled:opacity-20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : hasNewPendingVotes ? (
                    "Submit My Selections"
                  ) : (
                    <> <ShieldCheck size={12} /> Selections Locked </>
                  )}
                </button>
              </div>
            </div>
          </aside>

        </div>
        <TicketStatusFloat />
      </div>
    </main>
  );
}