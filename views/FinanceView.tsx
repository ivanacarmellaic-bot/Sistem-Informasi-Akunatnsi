import React from 'react';
import { useSystem } from '../store';
import { SOPBStatus } from '../types';
import { DollarSign, CreditCard } from 'lucide-react';

export const FinanceView = () => {
  const { sopbs, payInvoice } = useSystem();

  const invoices = sopbs.filter(s => s.status === SOPBStatus.INVOICED);
  const paidHistory = sopbs.filter(s => s.status === SOPBStatus.PAID);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Finance Department</h2>
        <p className="text-slate-500">Review Invoices and process Payments.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Unpaid Invoices */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" /> Payable Invoices
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-slate-500 border-b">
                <tr>
                  <th className="pb-3">Invoice Ref (SOPB)</th>
                  <th className="pb-3">Supplier</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="py-4 font-mono text-slate-700">{inv.id}</td>
                    <td className="py-4">{inv.supplierName}</td>
                    <td className="py-4 text-sm text-red-500 font-medium">Immediate</td>
                    <td className="py-4 text-right font-bold text-slate-800">Rp {inv.totalAmount.toLocaleString()}</td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => payInvoice(inv.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded shadow-sm hover:bg-green-700 text-sm transition-transform active:scale-95"
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">All caught up! No pending invoices.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 opacity-80">
          <h3 className="text-md font-semibold mb-4 text-slate-600">Payment History</h3>
          <div className="space-y-2">
            {paidHistory.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded border border-slate-200">
                 <div className="flex items-center gap-3">
                   <div className="bg-green-100 p-2 rounded-full"><CreditCard className="w-4 h-4 text-green-600" /></div>
                   <div>
                     <p className="font-medium text-slate-700">Paid to {p.supplierName}</p>
                     <p className="text-xs text-slate-400">Ref: {p.id}</p>
                   </div>
                 </div>
                 <span className="font-mono text-slate-500">Rp {p.totalAmount.toLocaleString()}</span>
              </div>
            ))}
             {paidHistory.length === 0 && <p className="text-slate-400 text-sm italic">No payment history.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};