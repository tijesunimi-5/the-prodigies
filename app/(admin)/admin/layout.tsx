"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Users, BarChart3, Settings, LogOut } from "lucide-react";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { name: "Tickets & Payments", href: "/admin/tickets", icon: <Ticket size={18} /> },
  // { name: "Class Registry", href: "/admin/registry", icon: <Users size={18} /> },
  { name: "Voting Stats", href: "/admin/votes", icon: <BarChart3 size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#1A1210]">
      {/* --- Admin Sidebar --- */}
      <aside className="w-64 bg-[#3B2A26] border-r border-[#D4AF37]/10 flex flex-col fixed h-full">
        <div className="p-8 border-b border-[#D4AF37]/10">
          <h1 className="font-serif text-[#F5E9DA] text-2xl">Admin <span className="text-[#D4AF37]">Hub</span></h1>
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#F5E9DA]/40 mt-1">Prodigies &apos;26 Control</p>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-sm transition-all text-sm uppercase tracking-widest font-bold ${isActive
                    ? "bg-[#D4AF37] text-[#3B2A26]"
                    : "text-[#F5E9DA]/60 hover:bg-white/5 hover:text-[#F5E9DA]"
                  }`}
              >
                {link.icon} {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#D4AF37]/10">
          <button className="flex items-center gap-4 px-4 py-3 text-[#F5E9DA]/40 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-bold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-64 p-10 bg-[#F5E9DA]">
        {children}
      </main>
    </div>
  );
}