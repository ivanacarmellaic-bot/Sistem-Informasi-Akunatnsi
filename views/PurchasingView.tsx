import React, { useState } from 'react';
import { useSystem } from '../store';
import { SOPBStatus, Supplier } from '../types';
import { Plus, Search, Users, FileStack, ArrowRight } from 'lucide-react';

export const PurchasingView = () => {
  const { createSOPB, sopbs, suppliers, addSupplier } = useSystem();
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');
  
  // Supplier Form State
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});
  const [showSupplierForm, setShowSupplierForm] = useState(false);

  // Filter requests from Production
  const productionRequests = sopbs.filter(s => s.status === SOPBStatus.REQUESTED);
  
  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.address) return;
    addSupplier({
      id: `SUP${Date.now().toString().slice(-3)}`,
      name: newSupplier.name,
      address: newSupplier.address,
      phone: newSupplier.phone
    } as Supplier);
    setNewSupplier({});
    setShowSupplierForm(false);
  };

  const processRequest = (req: any, supplierId: string) => {
    createSOPB(supplierId, req.items.map((i: any) => ({ item: { id: i.itemId, name: i.itemName, price: i.price }, qty: i.qtyOrdered })), req.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Purchasing Department</h2>
          <p className="text-slate-500">Manage Orders (SOPB) and Suppliers.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border shadow-sm">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Order Management
          </button>
          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'suppliers' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Supplier Management
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Production Requests */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600">
              <FileStack className="w-5 h-5" /> Production Requests (PPbb)
            </h3>
            <div className="space-y-4">
              {productionRequests.map(req => (
                <div key={req.id} className="border border-rose-100 bg-rose-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-800">{req.id}</span>
                    <span className="text-xs bg-white border px-2 py-1 rounded">From: Production</span>
                  </div>
                  <div className="text-sm text-slate-600 mb-4">
                    <p>{req.items.length} items requested.</p>
                    <ul className="list-disc ml-4 mt-1 text-xs text-slate-500">
                      {req.items.slice(0, 2).map((i, idx) => <li key={idx}>{i.itemName} (x{i.qtyOrdered})</li>)}
                      {req.items.length > 2 && <li>...</li>}
                    </ul>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select 
                      className="flex-1 text-sm border rounded p-2"
                      onChange={(e) => {
                        if (e.target.value) processRequest(req, e.target.value);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Supplier to Process</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {productionRequests.length === 0 && <p className="text-slate-400 italic text-center py-8">No pending requests from Production.</p>}
            </div>
          </div>

          {/* Active SOPB List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Active Purchase Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Supplier</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sopbs.filter(s => s.status !== SOPBStatus.REQUESTED).map(s => (
                    <tr key={s.id}>
                      <td className="p-2 font-mono">{s.id}</td>
                      <td className="p-2">{s.supplierName}</td>
                      <td className="p-2"><span className="px-2 py-1 bg-slate-100 rounded-full text-xs">{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" /> Registered Suppliers
            </h3>
            <button 
              onClick={() => setShowSupplierForm(!showSupplierForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Supplier
            </button>
          </div>

          {showSupplierForm && (
            <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-sm mb-3">New Supplier Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input 
                  placeholder="Company Name" 
                  className="border p-2 rounded" 
                  value={newSupplier.name || ''}
                  onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                />
                <input 
                  placeholder="Address" 
                  className="border p-2 rounded" 
                  value={newSupplier.address || ''}
                  onChange={e => setNewSupplier({...newSupplier, address: e.target.value})}
                />
                <input 
                  placeholder="Phone" 
                  className="border p-2 rounded" 
                  value={newSupplier.phone || ''}
                  onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSupplierForm(false)} className="px-3 py-1 text-slate-500">Cancel</button>
                <button onClick={handleAddSupplier} className="px-4 py-1 bg-blue-600 text-white rounded">Save Supplier</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map(sup => (
              <div key={sup.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-slate-800">{sup.name}</h4>
                <p className="text-sm text-slate-500 mt-1">{sup.address}</p>
                <p className="text-xs text-slate-400 mt-2">{sup.phone || 'No phone listed'}</p>
                <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400">{sup.id}</span>
                  <button className="text-blue-600 hover:underline">Edit Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};