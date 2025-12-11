import React from 'react';
import { useSystem } from '../store';
import { SOPBStatus } from '../types';
import { Truck, FileCheck, Send } from 'lucide-react';

export const SupplierView = () => {
  const { sopbs, updateSOPBStatus } = useSystem();

  // Orders that have been approved by accounting but not shipped
  const toShip = sopbs.filter(s => s.status === SOPBStatus.APPROVED);
  // Orders received by warehouse but not invoiced
  const toInvoice = sopbs.filter(s => s.status === SOPBStatus.RECEIVED);

  return (
    <div className="space-y-8">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
        <h2 className="text-2xl font-bold text-orange-900">External Supplier Portal</h2>
        <p className="text-orange-700">This view simulates the external supplier actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Queue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
            <Truck className="w-5 h-5" /> Pending Shipments
          </h3>
          <div className="space-y-4">
            {toShip.map(order => (
              <div key={order.id} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{order.id}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">New Order</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">Items: {order.items.length}</p>
                <button 
                  onClick={() => updateSOPBStatus(order.id, SOPBStatus.SHIPPED, 'Shipped by Supplier')}
                  className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-900 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Goods & Surat Jalan
                </button>
              </div>
            ))}
            {toShip.length === 0 && <p className="text-slate-400 italic text-center py-4">No new orders to ship.</p>}
          </div>
        </div>

        {/* Invoicing Queue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
            <FileCheck className="w-5 h-5" /> Pending Invoices
          </h3>
          <div className="space-y-4">
            {toInvoice.map(order => (
              <div key={order.id} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{order.id}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Goods Accepted</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">Total: Rp {order.totalAmount.toLocaleString()}</p>
                <button 
                  onClick={() => updateSOPBStatus(order.id, SOPBStatus.INVOICED, 'Invoice Sent by Supplier')}
                  className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 flex items-center justify-center gap-2"
                >
                   Send Invoice (Faktur)
                </button>
              </div>
            ))}
            {toInvoice.length === 0 && <p className="text-slate-400 italic text-center py-4">No pending payments to invoice.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};