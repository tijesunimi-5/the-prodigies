"use client";
import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Timer, Users, ShieldAlert, RefreshCw, BarChart3, ListOrdered } from "lucide-react";

interface AuditLog {
  id: number;
  buyerEmail: string;
  category: string;
  nomineeName: string;
}

interface Standing {
  category: string;
  name: string;
  votes: number;
}

export default function SecretAdminGate() {
  const [clockState, setClockState] = useState({ status: "not_started", secondsLeft: 0, canVote: false, voteCountdown: 0 });
  const [votingStatus, setVotingStatus] = useState("paused");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [liveStandings, setLiveStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminMetrics = useCallback(async () => {
    try {
      const clockRes = await fetch("/api/admin/voting-clock");
      const clockData = await clockRes.json();
      setClockState(clockData);
      setVotingStatus(clockData.votingStatus || "paused");

      const logRes = await fetch("/api/admin/audit-votes");
      if (logRes.ok) {
        const logData = await logRes.json();
        setAuditLogs(logData.logs || []);
        setLiveStandings(logData.standings || []);
      }
    } catch (err) {
      console.error("Failed syncing admin control metrics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminMetrics();
    const interval = setInterval(fetchAdminMetrics, 5000); // Polls database every 5 seconds for live tracking
    return () => clearInterval(interval);
  }, [fetchAdminMetrics]);

  const handleStartRegistration = async () => {
    if (!confirm("Are you ready to initiate the absolute 2-Hour Voter Registration Window live?")) return;
    try {
      const res = await fetch("/api/admin/voting-clock", { method: "POST" });
      if (res.ok) await fetchAdminMetrics();
    } catch (error) {
      alert("Network error updating countdown clock state.");
    }
  };

  const toggleVoteStream = async (targetStatus: string) => {
    try {
      const res = await fetch("/api/admin/toggle-voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) await fetchAdminMetrics();
    } catch (error) {
      console.error("Failed sending stream status toggle:", error);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Helper calculation to isolate leaders category by category for backend observation
  const categoriesList = Array.from(new Set(liveStandings.map((s) => s.category)));

  if (loading) return <div className="min-h-screen bg-stone-900 text-amber-500 flex items-center justify-center tracking-widest font-mono text-xs">INITIALIZING SECURE ADMINISTRATIVE LAYER...</div>;

  return (
    <main className="min-h-screen bg-[#1c1615] text-[#F5E9DA] p-6 md:p-12 font-sans selection:bg-[#D4AF37] selection:text-black">
      <header className="border-b border-white/10 pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#D4AF37] tracking-wide">Command Center: Elite Voting Ledger</h1>
          <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mt-1">Strict Personal Admin Access Only — Encrypted Live Channel</p>
        </div>
        <button onClick={fetchAdminMetrics} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-sm text-[#D4AF37] transition-all cursor-pointer"><RefreshCw size={14} /></button>
      </header>

      {/* Top Core Metrics Dashboard Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/5 p-6 rounded-sm">
          <h3 className="text-xs tracking-wider uppercase font-bold opacity-60 flex items-center gap-2 mb-4"><Timer size={14} className="text-[#D4AF37]" /> Registration Window</h3>
          {clockState.status === "not_started" ? (
            <button onClick={handleStartRegistration} className="w-full py-3.5 bg-[#D4AF37] text-[#1c1615] uppercase font-black tracking-widest text-[10px] rounded-sm hover:bg-amber-400 transition-all cursor-pointer">Start 2-Hour Clock</button>
          ) : (
            <div>
              <p className="text-3xl font-mono font-bold text-amber-400 tracking-wider">{clockState.secondsLeft > 0 ? formatTime(clockState.secondsLeft) : "WINDOW EXPIRED"}</p>
              <p className="text-[9px] uppercase tracking-wider text-white/40 mt-1.5">{clockState.status === "registration_open" ? "Accepting Entries Live" : "Registration Gate Sealed"}</p>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/5 p-6 rounded-sm">
          <h3 className="text-xs tracking-wider uppercase font-bold opacity-60 flex items-center gap-2 mb-4"><ShieldAlert size={14} className="text-[#D4AF37]" /> Voting Status Engine</h3>
          <div className="flex gap-4 items-center">
            {votingStatus === "live" ? (
              <button onClick={() => toggleVoteStream("paused")} className="flex-1 py-3.5 bg-red-800 text-white uppercase font-black tracking-widest text-[10px] rounded-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all cursor-pointer"><Pause size={12} /> Pause Voting</button>
            ) : (
              <button onClick={() => toggleVoteStream("live")} className="flex-1 py-3.5 bg-green-800 text-white uppercase font-black tracking-widest text-[10px] rounded-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer"><Play size={12} /> Make Live</button>
            )}
            <div className="px-4 py-2.5 bg-black/40 rounded-sm font-mono text-xs uppercase text-amber-400 tracking-widest font-black border border-white/5">{votingStatus}</div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-6 rounded-sm">
          <h3 className="text-xs tracking-wider uppercase font-bold opacity-60 flex items-center gap-2 mb-4"><Users size={14} className="text-[#D4AF37]" /> Verified Roster Data</h3>
          <p className="text-3xl font-mono font-bold text-[#D4AF37] tracking-wider">{auditLogs.length} <span className="text-xs font-sans text-white/40 font-normal tracking-normal">ballot lines stored</span></p>
          <p className="text-[9px] uppercase tracking-wider text-white/30 mt-1.5">Clean Entries Only (Duplicates Blocked)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* NEW SECTION: Left Column showing EXACT Numbers and who is leading */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/5 rounded-sm p-6">
            <h2 className="text-lg font-serif text-[#D4AF37] mb-6 flex items-center gap-2 border-b border-white/10 pb-3"><BarChart3 size={18} /> Central Live Standings (Secret Exact Counts)</h2>

            {categoriesList.length === 0 ? (
              <p className="text-xs opacity-40 italic font-sans text-center py-8">No vote metrics compiled yet. Metrics calculate instantly upon submission.</p>
            ) : (
              <div className="space-y-6">
                {categoriesList.map((categoryName) => {
                  const categoryStandings = liveStandings
                    .filter((s) => s.category === categoryName)
                    .sort((a, b) => b.votes - a.votes);

                  return (
                    <div key={categoryName} className="space-y-2 bg-black/20 p-4 border border-white/5 rounded-sm">
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-400">{categoryName.replace(/_/g, " ")}</h4>
                      <div className="divide-y divide-white/5 font-mono text-xs pt-1">
                        {categoryStandings.map((standing, index) => (
                          <div key={standing.name} className="flex justify-between items-center py-2">
                            <div className="flex gap-2 text-white/80 max-w-[70%] truncate">
                              <span className={index === 0 ? "text-[#D4AF37] font-bold" : "opacity-40"}>{index + 1}.</span>
                              <span className={index === 0 ? "text-[#D4AF37] font-bold" : ""}>{standing.name}</span>
                            </div>
                            <span className={`font-bold ${index === 0 ? "text-green-400 text-sm" : "text-white/60"}`}>{standing.votes} Votes</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right Column tracking Who Voted Who row-by-row */}
        <section className="lg:col-span-7 bg-white/5 border border-white/5 rounded-sm p-6">
          <h2 className="text-lg font-serif text-[#D4AF37] mb-6 flex items-center gap-2 border-b border-white/10 pb-3"><ListOrdered size={18} /> Live Ballot Audit Stream (Anti-Cheat Tracer)</h2>
          <div className="overflow-x-auto max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
            <table className="w-full text-left text-xs text-white/80 border-collapse">
              <thead>
                <tr className="border-b border-white/10 opacity-50 uppercase tracking-wider text-[9px]">
                  <th className="py-3">Ballot ID</th>
                  <th className="py-3">Verified Voter Account</th>
                  <th className="py-3">Award Category</th>
                  <th className="py-3">Nominee Voted For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {auditLogs.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center opacity-40 italic">No verified ballots logged in the database registry yet.</td></tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors duration-150">
                      <td className="py-3 text-amber-400 font-bold">#{log.id}</td>
                      <td className="py-3 text-white font-medium select-all max-w-[180px] truncate">{log.buyerEmail}</td>
                      <td className="py-3 opacity-50 max-w-[120px] truncate">{log.category.replace(/_/g, " ")}</td>
                      <td className="py-3 text-[#D4AF37] font-bold max-w-[160px] truncate">{log.nomineeName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}