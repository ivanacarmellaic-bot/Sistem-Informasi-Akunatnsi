import React from 'react';
import { useSystem } from '../store';
import { SOPBStatus } from '../types';
import { 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  Package
} from 'lucide-react';

export const DashboardView = () => {
  const { sopbs, inventory, journals } = useSystem();

  const lowStockItems = inventory.filter(i => i.stock <= i.safetyStock);
  const pendingApprovals = sopbs.filter(s => s.status === SOPBStatus.SUBMITTED);
  const unpaidInvoices = sopbs.filter(s => s.status === SOPBStatus.INVOICED);
  const totalDebt = unpaidInvoices.reduce((sum, s) => sum + s.totalAmount, 0);
  const recentOrders = [...sopbs].reverse().slice(0, 5);

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-bold text-slate-800 mt-2">{value}</h4>
          {sub && <p className={`text-xs mt-1 ${color}`}>{sub}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Executive Dashboard</h2>
        <p className="text-slate-500">System overview and key performance indicators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Outstanding Debt" 
          value={`Rp ${totalDebt.toLocaleString()}`} 
          sub={`${unpaidInvoices.length} invoices pending`}
          icon={TrendingUp} 
          color="text-red-500" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={pendingApprovals.length} 
          sub="Requires Accounting Action"
          icon={Clock} 
          color="text-orange-500" 
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockItems.length} 
          sub="Below Safety Stock"
          icon={AlertCircle} 
          color="text-rose-600" 
        />
        <StatCard 
          title="Total Orders" 
          value={sopbs.length} 
          sub="All time"
          icon={CheckCircle} 
          color="text-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-400" /> Recent Transactions
          </h3>
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="font-medium text-slate-800">{order.id}</p>
                  <p className="text-xs text-slate-500">{order.supplierName} • {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-700">Rp {order.totalAmount.toLocaleString()}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{order.status}</span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-slate-400 italic">No transactions yet.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" /> Critical Stock Levels
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-2 text-left">Item Name</th>
                  <th className="p-2 text-right">Current</th>
                  <th className="p-2 text-right">Safety</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {lowStockItems.map(item => (
                  <tr key={item.id}>
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2 text-right text-rose-600 font-bold">{item.stock}</td>
                    <td className="p-2 text-right text-slate-500">{item.safetyStock}</td>
                    <td className="p-2 text-center">
                      <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">Low</span>
                    </td>
                  </tr>
                ))}
                {lowStockItems.length === 0 && (
                   <tr>
                     <td colSpan={4} className="p-4 text-center text-green-600">All inventory levels are healthy.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};