import React, { useState, useEffect } from 'react';
import { useSystem } from '../store';
import { SOPBStatus, SOPB } from '../types';
import { PackageCheck, AlertTriangle } from 'lucide-react';

export const WarehouseView = () => {
  const { sopbs, receiveGoods } = useSystem();
  // Filter for orders that have been shipped by supplier
  const incomingOrders = sopbs.filter(s => s.status === SOPBStatus.SHIPPED);
  
  const [selectedOrder, setSelectedOrder] = useState<SOPB | null>(null);
  const [receiveForm, setReceiveForm] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (selectedOrder) {
      // Pre-fill form with 0
      const initial: any = {};
      selectedOrder.items.forEach(i => initial[i.itemId] = 0);
      setReceiveForm(initial);
    }
  }, [selectedOrder]);

  const handleInputChange = (itemId: string, val: number) => {
    setReceiveForm(prev => ({ ...prev, [itemId]: val }));
  };

  const handleReceive = () => {
    if (!selectedOrder) return;
    const items = Object.entries(receiveForm).map(([itemId, qty]) => ({
      itemId,
      qtyReceived: qty
    }));
    receiveGoods(selectedOrder.id, items);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Warehouse Department</h2>
        <p className="text-slate-500">Receive goods and validate against Surat Jalan (Delivery Note).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Incoming List */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-amber-700">Incoming Deliveries</h3>
          <div className="space-y-3">
            {incomingOrders.map(order => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedOrder?.id === order.id ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-700">{order.id}</span>
                  <PackageCheck className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm text-slate-500">{order.supplierName}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(order.date).toLocaleDateString()}</p>
              </div>
            ))}
            {incomingOrders.length === 0 && <p className="text-slate-400 italic text-sm">No incoming shipments.</p>}
          </div>
        </div>

        {/* Inspection Form */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          {selectedOrder ? (
            <div>
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold text-slate-800">Receiving Checklist: {selectedOrder.id}</h3>
                <p className="text-sm text-slate-500">Verify quantity received against Surat Jalan.</p>
              </div>

              <div className="space-y-4 mb-8">
                {selectedOrder.items.map(item => (
                  <div key={item.itemId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{item.itemName}</p>
                      <p className="text-xs text-slate-500">Ordered: {item.qtyOrdered}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-slate-600">Qty Received:</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-20 border rounded p-1 text-right"
                        value={receiveForm[item.itemId] || 0}
                        onChange={(e) => handleInputChange(item.itemId, parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  If "Qty Received" does not match "Ordered", the delivery will be marked as <strong>Rejected</strong> (Tidak Cocok) automatically.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReceive}
                  className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 shadow-sm"
                >
                  Confirm Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
              <PackageCheck className="w-16 h-16 mb-4 opacity-20" />
              <p>Select an incoming delivery to inspect.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};