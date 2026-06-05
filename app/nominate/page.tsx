"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Search, CheckCircle, User, Loader2, Sparkles } from "lucide-react";
import Navbar from "@/components/NavBar";

const categories = [
  { id: "most_active", title: "Most Active", desc: "Always present, driving energy, and pushing the class forward." },
  { id: "best_dressed_male", title: "Best Dressed (Male)", desc: "Dapper setups, clean tailoring, and unmatched style consistency." },
  { id: "best_dressed_female", title: "Best Dressed (Female)", desc: "Stunning elegance, high-end aesthetics, and graceful presence." },
  { id: "most_reserved", title: "Most Reserved", desc: "Calm, deeply observant, moving with quiet excellence and poise." },
  { id: "most_industrious", title: "Most Industrious / Entrepreneur", desc: "The ultimate hustler, building businesses and showcasing continuous drive." },
  { id: "outstanding_student", title: "Outstanding Student", desc: "Academic excellence balanced with phenomenal character and leadership." }
];

interface UserSearchMatch {
  name: string;
  email: string;
}

interface CompletedNominations {
  [key: string]: { name: string; email: string };
}

export default function NominatePage() {
  const [userSession, setUserSession] = useState<{ email: string; name: string } | null>(null);
  const [completed, setCompleted] = useState<CompletedNominations>({});
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Search States mapped per category ID
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({});
  const [searchResults, setSearchResults] = useState<{ [key: string]: UserSearchMatch[] }>({});
  const [searchingCategory, setSearchingCategory] = useState<string | null>(null);
  const [submittingCategory, setSubmittingCategory] = useState<string | null>(null);

  // 1. Authenticate user on mount and pull down existing choices
  useEffect(() => {
    const saved = localStorage.getItem("prodigy_user_session");
    if (!saved) {
      setLoadingInitial(false);
      return;
    }

    const user = JSON.parse(saved);
    setUserSession(user);

    const fetchUserNominations = async () => {
      try {
        const res = await fetch(`/api/nominate?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          const mapped: CompletedNominations = {};
          data.forEach((row: any) => {
            mapped[row.category] = { name: row.nomineeName, email: row.nomineeEmail };
          });
          setCompleted(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchUserNominations();
  }, []);

  // 2. Handle Live Typing Lookups using your existing search engine route
  const handleTypeLookup = async (categoryId: string, value: string) => {
    setSearchQueries(prev => ({ ...prev, [categoryId]: value }));
    
    if (value.trim().length < 3) {
      setSearchResults(prev => ({ ...prev, [categoryId]: [] }));
      return;
    }

    setSearchingCategory(categoryId);
    try {
      const res = await fetch(`/api/admin/check-in?search=${encodeURIComponent(value)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(prev => ({ ...prev, [categoryId]: data }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingCategory(null);
    }
  };

  // 3. Submit Nomination Request to DB
  const handleSelectNomination = async (categoryId: string, nominee: UserSearchMatch) => {
    if (!userSession) return;
    
    setSubmittingCategory(categoryId);
    try {
      const res = await fetch("/api/nominate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomineeEmail: nominee.email,
          nomineeName: nominee.name,
          category: categoryId,
          buyerEmail: userSession.email
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCompleted(prev => ({ ...prev, [categoryId]: { name: nominee.name, email: nominee.email } }));
        setSearchQueries(prev => ({ ...prev, [categoryId]: "" }));
        setSearchResults(prev => ({ ...prev, [categoryId]: [] }));
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (e) {
      alert("Network pipeline exception");
    } finally {
      setSubmittingCategory(null);
    }
  };

  const triggerGlobalLogin = () => {
    const triggerEvent = new CustomEvent("trigger-login");
    window.dispatchEvent(triggerEvent);
  };

  if (loadingInitial) {
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
          <Award size={48} className="text-[#D4AF37] mx-auto animate-pulse" />
          <h2 className="font-serif text-3xl text-[#3B2A26]">Awards Nomination Portal</h2>
          <p className="text-sm text-[#3B2A26]/70 leading-relaxed font-sans">To prevent fraudulent multiple voting entries and secure your ballots, you must connect your active Profile Pass before selecting award nominees.</p>
          <button onClick={triggerGlobalLogin} className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase font-black tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer">Connect Profile Pass</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Navbar />

        <header className="text-center mb-16">
          <div className="flex justify-center gap-3 mb-3">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-black">Prodigy Awards '26</span>
            <Sparkles size={16} className="text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3B2A26]">Nominate Your Peers</h1>
          <p className="text-xs text-[#3B2A26]/50 uppercase tracking-widest mt-2">Phase 1: Direct Internal Ballot Submission</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const isDone = completed[cat.id];
            const currentQuery = searchQueries[cat.id] || "";
            const currentMatches = searchResults[cat.id] || [];

            return (
              <div key={cat.id} className="bg-white border border-[#3B2A26]/5 p-6 shadow-xl rounded-sm flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-[#3B2A26] font-bold">{cat.title}</h3>
                    <Award size={18} className={isDone ? "text-green-600" : "text-[#D4AF37]"} />
                  </div>
                  <p className="text-xs text-[#3B2A26]/60 leading-relaxed font-sans mb-4">{cat.desc}</p>
                </div>

                {isDone ? (
                  /* --- LOCKED OUT SUCCESS STATE --- */
                  <div className="bg-green-50 border border-green-100 p-3 rounded-sm flex items-center gap-3 text-green-800">
                    <CheckCircle size={18} className="text-green-600 shrink-0" />
                    <div className="text-left">
                      <p className="text-[9px] uppercase tracking-wider opacity-60 font-bold">Your Nominee</p>
                      <p className="text-sm font-bold font-serif">{isDone.name}</p>
                    </div>
                  </div>
                ) : (
                  /* --- SEARCH LOCK INPUT ENGINE --- */
                  <div className="relative mt-2">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Type name to nominate..." 
                        value={currentQuery}
                        disabled={submittingCategory === cat.id}
                        onChange={(e) => handleTypeLookup(cat.id, e.target.value)}
                        className="w-full bg-black/5 border border-[#3B2A26]/10 rounded-sm pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#D4AF37] text-[#3B2A26]" 
                      />
                      {searchingCategory === cat.id && <Loader2 size={14} className="absolute right-3 top-3.5 animate-spin text-[#D4AF37]" />}
                    </div>

                    {/* Results Overlay List box */}
                    {currentMatches.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-2xl max-h-[140px] overflow-y-auto z-40 p-1 space-y-0.5">
                        {currentMatches.map((match, mIdx) => (
                          <button
                            key={mIdx}
                            onClick={() => handleSelectNomination(cat.id, match)}
                            className="w-full text-left p-2 hover:bg-[#3B2A26]/5 rounded-xs flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                          >
                            <User size={12} className="text-[#D4AF37]" />
                            <div>
                              <p className="text-xs font-bold text-[#3B2A26]">{match.name}</p>
                              <p className="text-[8px] text-gray-400 uppercase tracking-tighter">{match.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}