"use client";
import { Check, X, Eye, Search, Filter } from "lucide-react";

export default function TicketsAdmin() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif text-[#3B2A26]">Ticket Registry</h1>
          <p className="text-sm text-[#3B2A26]/60 mt-2">Manage event access and verify bank transfers.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B2A26]/30" size={16} />
            <input type="text" placeholder="Search name..." className="pl-10 pr-4 py-2 bg-white border border-[#3B2A26]/10 rounded-sm text-sm outline-none focus:border-[#D4AF37]" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3B2A26]/10 text-[10px] uppercase tracking-widest font-bold text-[#3B2A26]">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-[#3B2A26]/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#3B2A26] text-[#D4AF37] text-[10px] uppercase tracking-[0.2em]">
            <tr>
              <th className="p-5 pl-8">Guest</th>
              <th className="p-5">Event</th>
              <th className="p-5">Amount</th>
              <th className="p-5">Receipt</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right pr-8">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3B2A26]/5">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="text-sm text-[#3B2A26] hover:bg-[#F5E9DA]/30 transition-colors">
                <td className="p-5 pl-8">
                  <p className="font-bold">Student Name {i}</p>
                  <p className="text-[10px] opacity-50">0801234567{i}</p>
                </td>
                <td className="p-5 font-medium">Dinner Night</td>
                <td className="p-5 font-bold">₦4,500</td>
                <td className="p-5">
                  <button className="flex items-center gap-2 text-[#D4AF37] font-bold text-[10px] uppercase hover:underline">
                    <Eye size={14} /> View OPay
                  </button>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[9px] font-bold uppercase rounded-full">Pending</span>
                </td>
                <td className="p-5 text-right pr-8 space-x-2">
                  <button className="p-2 text-red-400 hover:bg-red-50 rounded-sm"><X size={18} /></button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-sm"><Check size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}