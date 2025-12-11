import React, { useState } from 'react';
import { useSystem } from '../store';
import { SOPBStatus } from '../types';
import { CheckCircle, XCircle, FileText, PieChart, BarChart } from 'lucide-react';

export const AccountingView = () => {
  const { sopbs, updateSOPBStatus, journals } = useSystem();
  const [viewMode, setViewMode] = useState<'approvals' | 'journals' | 'reports'>('approvals');

  const pendingApproval = sopbs.filter(s => s.status === SOPBStatus.SUBMITTED);
  
  // Reporting Data
  const totalPurchases = journals.reduce((sum, j) => sum + j.debit, 0);
  const totalTransactions = journals.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Accounting Department</h2>
          <p className="text-slate-500">Validate Purchase Requests, Record Journals & Generate Reports.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border shadow-sm">
          <button onClick={() => setViewMode('approvals')} className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'approvals' ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}>Approvals</button>
          <button onClick={() => setViewMode('journals')} className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'journals' ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}>Journals</button>
          <button onClick={() => setViewMode('reports')} className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'reports' ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}>Reports</button>
        </div>
      </div>

      {viewMode === 'approvals' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Pending Approvals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApproval.map(order => (
              <div key={order.id} className="border border-purple-100 bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-800">{order.id}</p>
                    <p className="text-sm text-slate-500">{order.supplierName}</p>
                  </div>
                  <p className="font-bold text-purple-700">Rp {order.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-xs text-slate-500 mb-4">
                  {order.items.map(i => `${i.itemName} (x${i.qtyOrdered})`).join(', ')}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateSOPBStatus(order.id, SOPBStatus.APPROVED, 'Approved by Accounting')}
                    className="flex-1 bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    Approve SOPB
                  </button>
                  <button className="px-3 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-100">
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingApproval.length === 0 && (
              <p className="col-span-2 text-center py-8 text-slate-400 italic">No pending requests.</p>
            )}
          </div>
        </div>
      )}

      {viewMode === 'journals' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">
            <FileText className="w-5 h-5" /> General Ledger / Jurnal Umum
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Ref</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-right">Debit</th>
                  <th className="p-2 text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {journals.map(entry => (
                  <tr key={entry.id}>
                    <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="p-2 font-mono text-xs">{entry.refId}</td>
                    <td className="p-2">{entry.description}</td>
                    <td className="p-2 text-right text-slate-600">Rp {entry.debit.toLocaleString()}</td>
                    <td className="p-2 text-right text-slate-600">Rp {entry.credit.toLocaleString()}</td>
                  </tr>
                ))}
                 {journals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 italic">No journal entries recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg"><PieChart className="w-6 h-6 text-purple-600" /></div>
                <div>
                  <p className="text-sm text-slate-500">Total Purchase Volume</p>
                  <h3 className="text-2xl font-bold text-slate-800">Rp {totalPurchases.toLocaleString()}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-500">Across {totalTransactions} recorded transactions.</p>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg"><BarChart className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-slate-500">Active Ledger Entries</p>
                  <h3 className="text-2xl font-bold text-slate-800">{journals.length}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-500">Verified entries in the system.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-lg mb-4">Monthly Purchase Report</h3>
             <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400">
               [Chart Visualization Placeholder]
             </div>
          </div>
        </div>
      )}
    </div>
  );
};