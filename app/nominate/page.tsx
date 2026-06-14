"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle, User, Loader2, Sparkles, Heart, Star, Trophy, Check } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/NavBar";
import TicketStatusFloat from "@/components/events/TicketStatusFloat";

// Cleaned and structured 30-member master list configuration block
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
  { name: "Akinleye Fulfilment Ooreofeoluwa", email: "akinleyefulfilment@gmail.com", image: "/"},
  { name: "Rapheal Sinaayomi Victor", email: "", image: "/"}
];

const categories = [
  { id: "most_active", title: "Most Active", desc: "Always present, driving energy, and pushing the class forward.", icon: <Sparkles size={16} /> },
  { id: "best_dressed_male", title: "Best Dressed (Male)", desc: "Dapper setups, clean tailoring, and style consistency.", icon: <Trophy size={16} /> },
  { id: "best_dressed_female", title: "Best Dressed (Female)", desc: "Stunning elegance, high-end aesthetics, and graceful presence.", icon: <Award size={16} /> },
  { id: "most_reserved", title: "Most Reserved", desc: "Calm, deeply observant, moving with quiet excellence and poise.", icon: <Heart size={16} /> },
  { id: "most_industrious", title: "Most Industrious / Entrepreneur", desc: "The ultimate hustler, building businesses and showcasing drive.", icon: <Star size={16} /> },
  { id: "outstanding_student", title: "Outstanding Student", desc: "Academic excellence balanced with phenomenal character.", icon: <User size={16} /> }
];

type NominationRow = {
  category: string;
  nomineeName: string;
};

export default function NominatePage() {
  const [activeCategory, setActiveCategory] = useState("most_active");
  const [userSession, setUserSession] = useState<{ email: string; name: string } | null>(null);
  const [completed, setCompleted] = useState<Record<string, { name: string }>>({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof graduates[0] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("prodigy_user_session");
    if (!saved) {
      setLoadingInitial(false);
      return;
    }
    const user = JSON.parse(saved);
    setUserSession(user);

    fetch(`/api/nominate?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data: NominationRow[]) => {
        const mapped: Record<string, { name: string }> = {};
        data.forEach((row) => {
          mapped[row.category] = { name: row.nomineeName };
        });
        setCompleted(mapped);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingInitial(false));
  }, []);

  useEffect(() => {
    setSelectedCandidate(null);
  }, [activeCategory]);

  const handleCardClick = (candidate: typeof graduates[0]) => {
    if (completed[activeCategory] || isSubmitting) return;
    if (selectedCandidate?.name === candidate.name) {
      setSelectedCandidate(null);
    } else {
      setSelectedCandidate(candidate);
    }
  };

  const handleConfirmNomination = async () => {
    if (!userSession || !selectedCandidate || completed[activeCategory] || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/nominate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomineeEmail: selectedCandidate.email,
          nomineeName: selectedCandidate.name,
          category: activeCategory,
          buyerEmail: userSession.email
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCompleted((prev) => ({ ...prev, [activeCategory]: { name: selectedCandidate.name } }));
        setSelectedCandidate(null);
      } else {
        alert(data.error || "Submission rejected.");
      }
    } catch (e) {
      alert("Network exception processing ballot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerGlobalLogin = () => {
    window.dispatchEvent(new CustomEvent("trigger-login"));
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#F5E9DA] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#3B2A26]" size={32} />
      </div>
    );
  }

  if (!userSession) {
    return (
      <main className="min-h-screen bg-[#F5E9DA] pt-36 flex flex-col items-center px-6">
        <Navbar />
        <div className="max-w-md text-center space-y-6 bg-white/40 p-8 border border-[#3B2A26]/5 shadow-xl rounded-sm backdrop-blur-md">
          <Award size={48} className="text-[#D4AF37] mx-auto animate-pulse" />
          <h2 className="font-serif text-3xl text-[#3B2A26]">Nomination Portal</h2>
          <p className="text-sm text-[#3B2A26]/70 leading-relaxed font-sans">Please connect your active Profile Pass to access internal award nominations.</p>
          <button onClick={triggerGlobalLogin} className="w-full py-4 bg-[#3B2A26] text-[#F5E9DA] text-[10px] uppercase font-black tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer">Connect Profile Pass</button>
        </div>
      </main>
    );
  }

  const currentCategoryMeta = categories.find((c) => c.id === activeCategory);
  const alreadyNominated = completed[activeCategory];

  return (
    <main className="min-h-screen bg-[#F5E9DA] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <Navbar />

        <header className="text-center mb-12">
          <div className="flex justify-center gap-3 mb-3">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-black">Prodigy Awards &apos;26</span>
            <Sparkles size={16} className="text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3B2A26]">Awards Nomination</h1>
          <p className="text-xs text-[#3B2A26]/50 uppercase tracking-widest mt-2">Phase 1: Select Your Peers From The Registry</p>
        </header>

        <div className="flex flex-wrap gap-2.5 justify-center mb-12 max-w-5xl mx-auto">
          {categories.map((cat) => {
            const categoryDone = completed[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer relative ${activeCategory === cat.id ? "bg-[#3B2A26] text-[#F5E9DA] shadow-xl" : "bg-white/50 text-[#3B2A26]/50 hover:bg-white"
                  }`}
              >
                {cat.icon}
                <span>{cat.title}</span>
                {categoryDone && (
                  <span className="w-2 h-2 rounded-full bg-green-500 absolute top-1 right-2" />
                )}
              </button>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto bg-white border border-[#3B2A26]/5 p-6 rounded-sm shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-serif text-[#3B2A26] font-bold flex items-center justify-center md:justify-start gap-2 mb-1">
              {currentCategoryMeta?.icon} {currentCategoryMeta?.title}
            </h2>
            <p className="text-xs text-[#3B2A26]/60 font-sans">{currentCategoryMeta?.desc}</p>
          </div>

          <div className="flex justify-center shrink-0">
            {alreadyNominated ? (
              <div className="bg-green-50 border border-green-100 px-6 py-2.5 rounded-sm text-green-800 text-center min-w-[200px]">
                <p className="text-[8px] uppercase tracking-wider font-black opacity-60">Your Choice Locked</p>
                <p className="text-xs font-bold font-serif">{alreadyNominated.name}</p>
              </div>
            ) : selectedCandidate ? (
              <button
                onClick={handleConfirmNomination}
                disabled={isSubmitting}
                className="bg-[#3B2A26] text-[#F5E9DA] border border-transparent px-6 py-3 text-[10px] uppercase font-black tracking-widest rounded-sm hover:bg-[#D4AF37] hover:text-[#3B2A26] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    <Check size={12} /> Confirm Nomination for {selectedCandidate.name.split(" ")[0]}
                  </>
                )}
              </button>
            ) : (
              <div className="border border-dashed border-stone-200 text-stone-400 px-6 py-3 text-[9px] uppercase tracking-wider font-bold rounded-sm bg-stone-50/50">
                Click a candidate below to begin
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {graduates.map((grad, idx) => {
            const isConfirmedChoice = alreadyNominated?.name === grad.name;
            const isPendingSelection = selectedCandidate?.name === grad.name;
            const isAnyConfirmed = !!alreadyNominated;

            return (
              <motion.div
                key={idx}
                whileTap={!isAnyConfirmed ? { scale: 0.98 } : undefined}
                onClick={() => handleCardClick(grad)}
                className={`relative rounded-sm overflow-hidden border-2 transition-all duration-300 ${isConfirmedChoice
                    ? "border-green-600 bg-white shadow-lg scale-[1.02]"
                    : isPendingSelection
                      ? "border-[#D4AF37] bg-white shadow-xl scale-[1.02]"
                      : isAnyConfirmed
                        ? "border-transparent opacity-40 cursor-not-allowed"
                        : "border-transparent opacity-90 hover:opacity-100 hover:border-[#D4AF37]/40 cursor-pointer"
                  }`}
              >
                <div className="aspect-[4/5] relative bg-stone-800 flex flex-col items-center justify-center text-center p-4">
                  {grad.image ? (
                    <Image
                      src={grad.image}
                      alt={grad.name}
                      fill
                      sizes="(max-w-768px) 50vw, 20vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-stone-400">
                      <User size={28} />
                      <span className="text-[7px] uppercase tracking-widest">No Photo</span>
                    </div>
                  )}

                  {isPendingSelection && (
                    <div className="absolute inset-0 bg-[#D4AF37]/10 flex items-center justify-center z-10 border border-[#D4AF37]">
                      <span className="bg-[#D4AF37] text-[#3B2A26] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 shadow-md rounded-xs">
                        Selected
                      </span>
                    </div>
                  )}

                  {isConfirmedChoice && (
                    <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center z-10">
                      <CheckCircle size={32} className="text-green-600 bg-white rounded-full p-0.5 shadow-md" />
                    </div>
                  )}
                </div>

                <div className="p-2.5 text-center bg-white border-t border-stone-50">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-[#3B2A26] truncate">
                    {grad.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
      <TicketStatusFloat />
    </main>
  );
}