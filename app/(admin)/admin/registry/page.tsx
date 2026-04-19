"use client";
import { UserPlus, Mail, MessageCircle, MoreVertical } from "lucide-react";

export default function RegistryAdmin() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-serif text-[#3B2A26]">Covenant Registry</h1>
        <button className="bg-[#3B2A26] text-[#D4AF37] px-6 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
          <UserPlus size={16} /> Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 4].map((i) => (
          <div key={i} className="bg-white p-6 border border-[#3B2A26]/5 flex items-center justify-between group hover:border-[#D4AF37]/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F5E9DA] rounded-full" />
              <div>
                <h3 className="font-serif text-[#3B2A26] text-lg">Amos Daniel Eniola</h3>
                <p className="text-[10px] text-[#3B2A26]/40 uppercase tracking-widest">Prayer Team • CS</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-[#F5E9DA] text-[#3B2A26] rounded-full hover:bg-[#3B2A26] hover:text-[#D4AF37] transition-all"><Mail size={14} /></button>
              <button className="p-2 bg-[#F5E9DA] text-[#3B2A26] rounded-full hover:bg-[#3B2A26] hover:text-[#D4AF37] transition-all"><MessageCircle size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}