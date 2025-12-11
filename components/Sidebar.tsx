import React from 'react';
import { useSystem } from '../store';
import { Role } from '../types';
import { 
  ShoppingCart, 
  FileText, 
  Truck, 
  Package, 
  DollarSign, 
  Activity,
  Factory,
  LayoutDashboard
} from 'lucide-react';

export const Sidebar = () => {
  const { role, setRole } = useSystem();

  const menuItems = [
    { role: Role.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', color: 'text-indigo-500' },
    { role: Role.PRODUCTION, icon: Factory, label: 'Production', color: 'text-rose-500' },
    { role: Role.PURCHASING, icon: ShoppingCart, label: 'Purchasing', color: 'text-blue-500' },
    { role: Role.ACCOUNTING, icon: FileText, label: 'Accounting', color: 'text-purple-500' },
    { role: Role.WAREHOUSE, icon: Package, label: 'Warehouse', color: 'text-amber-600' },
    { role: Role.FINANCE, icon: DollarSign, label: 'Finance', color: 'text-green-600' },
    { role: Role.SUPPLIER, icon: Truck, label: 'Supplier Portal', color: 'text-orange-500' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-700">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-2">
        <Activity className="text-blue-400" />
        <span className="text-xl font-bold tracking-tight">System<span className="text-blue-400">Kredit</span></span>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Modules</p>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.role}
              onClick={() => setRole(item.role)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                role === item.role 
                  ? 'bg-slate-800 text-white shadow-md border-l-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${role === item.role ? item.color : ''}`} />
              <span className="font-medium text-left">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400">Current View</p>
          <p className="font-bold text-lg text-white capitalize">{role.toLowerCase()}</p>
        </div>
      </div>
    </div>
  );
};