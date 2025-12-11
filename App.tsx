import React from 'react';
import { SystemProvider, useSystem } from './store';
import { Role } from './types';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { PurchasingView } from './views/PurchasingView';
import { AccountingView } from './views/AccountingView';
import { WarehouseView } from './views/WarehouseView';
import { FinanceView } from './views/FinanceView';
import { SupplierView } from './views/SupplierView';
import { ProductionView } from './views/ProductionView';
import { AIAuditor } from './components/AIAuditor';

const DashboardContent = () => {
  const { role } = useSystem();

  const renderView = () => {
    switch (role) {
      case Role.DASHBOARD: return <DashboardView />;
      case Role.PRODUCTION: return <ProductionView />;
      case Role.PURCHASING: return <PurchasingView />;
      case Role.ACCOUNTING: return <AccountingView />;
      case Role.WAREHOUSE: return <WarehouseView />;
      case Role.FINANCE: return <FinanceView />;
      case Role.SUPPLIER: return <SupplierView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
      <AIAuditor />
    </div>
  );
};

const App = () => {
  return (
    <SystemProvider>
      <DashboardContent />
    </SystemProvider>
  );
};

export default App;