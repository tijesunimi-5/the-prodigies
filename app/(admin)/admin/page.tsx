"use client";
import { motion } from "framer-motion";
import { Check, X, Eye, Clock, CreditCard } from "lucide-react";

// Placeholder data for the pending queue
const pendingPayments = [
  { id: "TX-1001", name: "Egbedeyi Tomiwa", event: "Dinner Night", amount: "₦4,500", coupon: "PRODIGY500", timestamp: "10 mins ago" },
  { id: "TX-1002", name: "Amos Daniel", event: "Dinner Night", amount: "₦5,000", coupon: "None", timestamp: "25 mins ago" },
];

export default function AdminOverview() {
  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", value: "₦125,500", icon: <CreditCard className="text-[#D4AF37]" /> },
          { label: "Pending Approvals", value: "12", icon: <Clock className="text-orange-500" /> },
          { label: "Confirmed Guests", value: "48", icon: <Check className="text-green-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-sm shadow-sm border border-[#3B2A26]/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#3B2A26]/40 font-bold">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-3xl font-serif text-[#3B2A26]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Approval Table */}
      <div className="bg-white rounded-sm shadow-sm border border-[#3B2A26]/5 overflow-hidden">
        <div className="p-6 border-b border-[#3B2A26]/5 flex justify-between items-center">
          <h3 className="font-serif text-xl text-[#3B2A26]">Payment Verification Queue</h3>
          <span className="px-3 py-1 bg-[#3B2A26] text-[#D4AF37] text-[9px] uppercase font-bold tracking-widest">Live Updates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#3B2A26]/5 text-[10px] uppercase tracking-widest text-[#3B2A26]/40">
                <th className="p-4 pl-6">Transaction ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Coupon</th>
                <th className="p-4">Receipt</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B2A26]/5">
              {pendingPayments.map((payment) => (
                <tr key={payment.id} className="text-sm text-[#3B2A26] hover:bg-white transition-colors group">
                  <td className="p-4 pl-6 font-mono text-xs font-bold text-[#D4AF37]">{payment.id}</td>
                  <td className="p-4">
                    <p className="font-bold">{payment.name}</p>
                    <p className="text-[10px] opacity-40 uppercase tracking-tighter">{payment.timestamp}</p>
                  </td>
                  <td className="p-4 font-bold">{payment.amount}</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${payment.coupon !== 'None' ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-400'}`}>
                      {payment.coupon}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] hover:text-[#3B2A26]">
                      <Eye size={14} /> View Image
                    </button>
                  </td>
                  <td className="p-4 text-right pr-6 space-x-2">
                    <button className="p-2 text-red-400 hover:bg-red-50 rounded-sm transition-colors" title="Decline"><X size={18} /></button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-sm transition-colors" title="Approve"><Check size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}