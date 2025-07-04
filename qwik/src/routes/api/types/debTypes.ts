interface Statistics {
  totalDebts: string;         
  totalDebters: string;       // String representation of a number
  totalRemaining: string;     // String representation of a number
  lastPayment: null | string; // ISO date string or null
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number; 
}

export interface paginatedData {
  debtId: string;
  customerId: string;
  name: string;
  totalDebt: string;
  remainingAmount: string;
  lastPaymentDate: null | string; // ISO date string or null
  createdAt: string; // ISO date string
  payment: {
    totalPaid: number;
    lastPayment: Date | null;
  } | null;
  receipts: {
    date: Date | null;
    product: string;
    quantity: number;
    priceSold: number;
    total: number;
  }[]; 
}

export interface DataItemDebts {
  id?: string; // Optional ID for the data item
  statistics: Statistics;
  madeniYaliyolipwa: number;
  madeniYaliyokusanywa: number;
  totalCollected: number;
  pagination: Pagination;
  paginatedData: paginatedData[];
}
