"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Users, BarChart3, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F5E9DA]">
      {/* --- Mobile Header --- */}
      <div className="lg:hidden bg-[#3B2A26] p-4 flex justify-between items-center sticky top-0 z-[160]">
        <h1 className="font-serif text-[#D4AF37] text-xl">Admin Hub</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#D4AF37]">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Sidebar --- */}
      <aside className={`
        fixed pt-16 inset-y-0 left-0 z-155 w-64 bg-[#3B2A26] border-r border-[#D4AF37]/10 transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="p-8 border-b border-[#D4AF37]/10 hidden lg:block">
          <h1 className="font-serif text-[#F5E9DA] text-2xl">Admin <span className="text-[#D4AF37]">Hub</span></h1>
        </div>

        <nav className="p-6 space-y-2">
          {[
            { name: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
            { name: "Tickets", href: "/admin/tickets", icon: <Ticket size={18} /> },
            // { name: "Registry", href: "/admin/registry", icon: <Users size={18} /> },
            { name: "Votes", href: "/admin/votes", icon: <BarChart3 size={18} /> },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-sm text-sm uppercase tracking-widest font-bold ${pathname === link.href ? "bg-[#D4AF37] text-[#3B2A26]" : "text-[#F5E9DA]/60 hover:text-[#F5E9DA]"
                }`}
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}