"use client";
import { Check, X, Eye, Search, Filter } from "lucide-react";

export default function TicketsAdmin() {
  return (
    <div className="space-y-8">
      {/* Header Section: Stacks on mobile, Side-by-side on desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#3B2A26]">Ticket Registry</h1>
          <p className="text-sm text-[#3B2A26]/60 mt-2">Manage event access and verify bank transfers.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B2A26]/30" size={16} />
            <input
              type="text"
              placeholder="Search name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#3B2A26]/10 rounded-sm text-sm outline-none text-gray-400 focus:border-[#D4AF37]"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#3B2A26]/10 text-[10px] uppercase tracking-widest font-bold text-[#3B2A26] hover:bg-[#3B2A26] hover:text-[#D4AF37] transition-all">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Table Section: Wrapped in overflow-x-auto to allow horizontal swipe on mobile */}
      <div className="bg-white rounded-sm border border-[#3B2A26]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]"> {/* min-w ensures content doesn't squash */}
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
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[9px] font-bold uppercase rounded-full whitespace-nowrap">
                      Pending
                    </span>
                  </td>
                  <td className="p-5 text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-all" title="Decline"><X size={18} /></button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-sm transition-all" title="Approve"><Check size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Hint */}
        <div className="md:hidden p-3 bg-[#3B2A26]/5 text-center">
          <p className="text-[8px] uppercase tracking-widest text-[#3B2A26]/40 italic">Swipe left to see more info →</p>
        </div>
      </div>
    </div>
  );
}