interface Statistics {
  totalDebts: string;         
  totalDebters: string;       // String representation of a number
  totalRemaining: string;     // String representation of a number
  lastPayment: null | string; // ISO date string or null
}

export interface CustomerDebt {
  debtId: string;
  customerId: string;
  name: string;
  totalDebt: string;          
  remainingAmount: string;    
  lastPaymentDate: null | string; 
  createdAt: null | string;
}

export interface RecentPayment {
  customerId: string;
  name: string;
  totalPaid: string;
  paymentDate: string;
}

interface debtReceipts {
  customerId: string;
  product: string;
  quantity: number;
  priceSold: string;
  total: string;
}[]

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number; 
}

export interface DataItemDebts {
  id?: string; // Optional ID for the data item
  statistics: Statistics;
  customerDebts: CustomerDebt[];
  recentPayments: RecentPayment[];
  madeniYaliyolipwa: number;
  madeniYaliyokusanywa: number;
  totalCollected: number;
  pagination: Pagination;
  debtReceipts: debtReceipts;
}
