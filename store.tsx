import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SOPB, SOPBStatus, Item, Supplier, JournalEntry, MOCK_ITEMS, MOCK_SUPPLIERS, Role, InventoryItem } from './types';

interface SystemContextType {
  role: Role;
  setRole: (role: Role) => void;
  sopbs: SOPB[];
  journals: JournalEntry[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  createSOPB: (supplierId: string, items: { item: Item, qty: number }[], fromRequestId?: string) => void;
  requestPurchase: (items: { item: Item, qty: number }[]) => void;
  updateSOPBStatus: (id: string, status: SOPBStatus, note?: string) => void;
  receiveGoods: (id: string, receivedItems: { itemId: string, qtyReceived: number }[]) => void;
  payInvoice: (id: string) => void;
  resetSystem: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider = ({ children }: { children?: ReactNode }) => {
  const [role, setRole] = useState<Role>(Role.DASHBOARD);
  const [sopbs, setSopbs] = useState<SOPB[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };

  // Used by Production to create a PPbb
  const requestPurchase = (items: { item: Item, qty: number }[]) => {
    const totalAmount = items.reduce((sum, i) => sum + (i.item.price * i.qty), 0);
    const newRequest: SOPB = {
      id: `PPbb-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString(),
      supplierId: '', // To be filled by Purchasing
      supplierName: 'Pending Assignment',
      items: items.map(i => ({
        itemId: i.item.id,
        itemName: i.item.name,
        price: i.item.price,
        qtyOrdered: i.qty
      })),
      status: SOPBStatus.REQUESTED,
      totalAmount,
      logs: [`Purchase Request (PPbb) created by Production at ${new Date().toLocaleTimeString()}`],
      requestedBy: 'Production'
    };
    setSopbs(prev => [...prev, newRequest]);
  };

  // Used by Purchasing to finalize/create an SOPB
  const createSOPB = (supplierId: string, items: { item: Item, qty: number }[], fromRequestId?: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    // If converting from a request, update the existing one, else create new
    if (fromRequestId) {
      setSopbs(prev => prev.map(order => {
        if (order.id === fromRequestId) {
          return {
            ...order,
            id: `SOPB-${Date.now().toString().slice(-4)}`, // Convert ID to SOPB
            supplierId,
            supplierName: supplier.name,
            status: SOPBStatus.SUBMITTED,
            logs: [...order.logs, `Converted to SOPB and Submitted by Purchasing to ${supplier.name}`]
          };
        }
        return order;
      }));
    } else {
      const totalAmount = items.reduce((sum, i) => sum + (i.item.price * i.qty), 0);
      const newSOPB: SOPB = {
        id: `SOPB-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString(),
        supplierId,
        supplierName: supplier.name,
        items: items.map(i => ({
          itemId: i.item.id,
          itemName: i.item.name,
          price: i.item.price,
          qtyOrdered: i.qty
        })),
        status: SOPBStatus.SUBMITTED,
        totalAmount,
        logs: [`Created and Submitted by Purchasing at ${new Date().toLocaleTimeString()}`],
        requestedBy: 'Purchasing'
      };
      setSopbs(prev => [...prev, newSOPB]);
    }
  };

  const updateSOPBStatus = (id: string, status: SOPBStatus, note?: string) => {
    setSopbs(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          status,
          logs: [...order.logs, `Status changed to ${status} at ${new Date().toLocaleTimeString()} ${note ? `(${note})` : ''}`]
        };
      }
      return order;
    }));
  };

  const receiveGoods = (id: string, receivedItems: { itemId: string, qtyReceived: number }[]) => {
    setSopbs(prev => prev.map(order => {
      if (order.id === id) {
        const isMatch = receivedItems.every(ri => {
          const original = order.items.find(i => i.itemId === ri.itemId);
          return original && original.qtyOrdered === ri.qtyReceived;
        });

        const newStatus = isMatch ? SOPBStatus.RECEIVED : SOPBStatus.REJECTED;
        
        // Update item details with received qty
        const updatedItems = order.items.map(item => {
            const received = receivedItems.find(r => r.itemId === item.itemId);
            return { ...item, qtyReceived: received ? received.qtyReceived : 0 };
        });

        // Update Inventory Stock
        if (newStatus === SOPBStatus.RECEIVED) {
          setInventory(invPrev => invPrev.map(invItem => {
            const rec = receivedItems.find(r => r.itemId === invItem.id);
            if (rec) {
              return { ...invItem, stock: invItem.stock + rec.qtyReceived };
            }
            return invItem;
          }));
        }

        return {
          ...order,
          items: updatedItems,
          status: newStatus,
          logs: [...order.logs, `Goods received by Warehouse. Check Result: ${newStatus}`]
        };
      }
      return order;
    }));
  };

  const payInvoice = (id: string) => {
    const order = sopbs.find(s => s.id === id);
    if (!order) return;

    updateSOPBStatus(id, SOPBStatus.PAID);

    // Auto-create journal entry
    const journal: JournalEntry = {
      id: `JRN-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      refId: order.id, 
      description: `Payment for Order ${order.id} to ${order.supplierName}`,
      debit: order.totalAmount,
      credit: order.totalAmount
    };
    setJournals(prev => [...prev, journal]);
  };

  const resetSystem = () => {
    setSopbs([]);
    setJournals([]);
    setInventory(MOCK_ITEMS);
  };

  return (
    <SystemContext.Provider value={{
      role, setRole, sopbs, journals, inventory, suppliers, addSupplier, createSOPB, requestPurchase, updateSOPBStatus, receiveGoods, payInvoice, resetSystem
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within SystemProvider");
  return context;
};