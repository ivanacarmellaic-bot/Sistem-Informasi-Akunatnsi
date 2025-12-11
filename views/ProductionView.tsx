import React, { useState } from 'react';
import { useSystem } from '../store';
import { InventoryItem } from '../types';
import { AlertTriangle, PlusCircle, Factory } from 'lucide-react';

export const ProductionView = () => {
  const { inventory, requestPurchase } = useSystem();
  const [cart, setCart] = useState<{ item: InventoryItem, qty: number }[]>([]);

  const addToRequest = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 10 } : i);
      }
      return [...prev, { item, qty: 10 }]; // Default 10 units for production
    });
  };

  const handleRequest = () => {
    if (cart.length === 0) return;
    requestPurchase(cart);
    setCart([]);
    alert("Purchase Request (PPbb) generated successfully.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Production Department</h2>
        <p className="text-slate-500">Monitor raw material stock and generate Purchase Requests (PPbb).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Monitor */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Factory className="w-5 h-5 text-rose-500" /> Inventory / Raw Materials
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3 text-right">Stock</th>
                  <th className="p-3 text-right">Safety Stock</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventory.map(item => {
                  const isLow = item.stock <= item.safetyStock;
                  return (
                    <tr key={item.id} className={isLow ? 'bg-rose-50' : ''}>
                      <td className="p-3 font-mono">{item.id}</td>
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className={`p-3 text-right font-bold ${isLow ? 'text-rose-600' : 'text-slate-700'}`}>
                        {item.stock} {item.unit}
                      </td>
                      <td className="p-3 text-right text-slate-500">{item.safetyStock} {item.unit}</td>
                      <td className="p-3 text-center">
                         {isLow ? (
                           <span className="flex items-center justify-center gap-1 text-rose-600 text-xs font-bold">
                             <AlertTriangle className="w-3 h-3" /> Critical
                           </span>
                         ) : (
                           <span className="text-green-600 text-xs font-medium">OK</span>
                         )}
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => addToRequest(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Add to Purchase Request"
                        >
                          <PlusCircle className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-rose-100 h-fit">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Draft Purchase Request (PPbb)</h3>
          
          <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
            {cart.map((line, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-slate-800">{line.item.name}</p>
                  <p className="text-xs text-slate-500">Unit Cost: Rp {line.item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-16 border rounded p-1 text-right text-sm"
                    value={line.qty}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCart(prev => prev.map((p, i) => i === idx ? { ...p, qty: val } : p));
                    }}
                  />
                  <button 
                    onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
                <p>Select items from inventory to request restock.</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
             <div className="flex justify-between text-sm text-slate-600 mb-4">
               <span>Estimated Cost:</span>
               <span className="font-bold">Rp {cart.reduce((s, i) => s + (i.item.price * i.qty), 0).toLocaleString()}</span>
             </div>
             <button 
              disabled={cart.length === 0}
              onClick={handleRequest}
              className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 disabled:bg-slate-300 transition-colors font-medium shadow-sm"
             >
               Submit PPbb
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};