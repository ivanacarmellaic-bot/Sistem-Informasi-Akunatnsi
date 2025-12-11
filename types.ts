export enum Role {
  DASHBOARD = 'DASHBOARD',
  PURCHASING = 'PEMBELIAN',
  ACCOUNTING = 'AKUNTANSI',
  SUPPLIER = 'SUPPLIER',
  WAREHOUSE = 'GUDANG',
  FINANCE = 'KEUANGAN',
  PRODUCTION = 'PRODUKSI'
}

export enum SOPBStatus {
  REQUESTED = 'Requested', // Created by Production (PPbb)
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted', // PPbb submitted to Accounting
  APPROVED = 'Approved', // Approved by Accounting, sent to Supplier
  SHIPPED = 'Shipped', // Supplier sent goods
  RECEIVED = 'Received', // Warehouse received goods
  REJECTED = 'Rejected', // Warehouse rejected goods
  INVOICED = 'Invoiced', // Supplier sent invoice
  PAID = 'Paid' // Finance paid
}

export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface InventoryItem extends Item {
  stock: number;
  safetyStock: number;
  unit: string;
}

export interface SOPBItem {
  itemId: string;
  itemName: string;
  qtyOrdered: number;
  qtyReceived?: number;
  price: number;
}

export interface SOPB {
  id: string; // NoSOPB
  date: string;
  supplierId: string;
  supplierName: string;
  items: SOPBItem[];
  status: SOPBStatus;
  totalAmount: number;
  logs: string[];
  requestedBy?: string; // Department that requested it
}

export interface JournalEntry {
  id: string;
  date: string;
  refId: string; // NoFaktur
  description: string;
  debit: number;
  credit: number;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone?: string;
}

// Initial Mock Data
export const MOCK_ITEMS: InventoryItem[] = [
  { id: 'BRG01', name: 'Laptop High-End', price: 15000000, stock: 5, safetyStock: 10, unit: 'Unit' },
  { id: 'BRG02', name: 'Mouse Wireless', price: 250000, stock: 50, safetyStock: 20, unit: 'Pcs' },
  { id: 'BRG03', name: 'Monitor 24in', price: 2000000, stock: 8, safetyStock: 5, unit: 'Unit' },
  { id: 'BRG04', name: 'Mechanical Keyboard', price: 800000, stock: 12, safetyStock: 15, unit: 'Pcs' },
  { id: 'RAW01', name: 'PCB Board', price: 50000, stock: 100, safetyStock: 200, unit: 'Sheet' },
  { id: 'RAW02', name: 'Processor Chip', price: 3000000, stock: 20, safetyStock: 50, unit: 'Unit' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'SUP01', name: 'PT. Tech Solution', address: 'Jakarta', phone: '021-555555' },
  { id: 'SUP02', name: 'CV. Maju Hardware', address: 'Bandung', phone: '022-123456' },
];