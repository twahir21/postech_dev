interface Statistics {
  totalDebts: string;         
  totalDebters: string;       // String representation of a number
  totalRemaining: string;     // String representation of a number
  lastPayment: null | string; // ISO date string or null
}

export interface CustomerDebt {
  customerId: string;
  name: string;
  totalDebt: string;          // String representation of a number
  remainingAmount: string;    // String representation of a number
  lastPaymentDate: null | string; // ISO date string or null
  createdAt: null | string;
}

export interface RecentPayment {
  // Define this if recentPayments have structure
  // Example:
  // paymentId: string;
  // amountPaid: string;
  // paymentDate: string;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: string; // Could also be number depending on backend
}

export interface DataItemDebts {
  id?: string; // Optional ID for the data item
  statistics: Statistics;
  customerDebts: CustomerDebt[];
  recentPayments: RecentPayment[];
  pagination: Pagination;
}
