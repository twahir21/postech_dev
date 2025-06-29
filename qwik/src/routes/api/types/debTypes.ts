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

interface paginatedData {
  payment: {
    totalPaid: number;
    lastPayment: Date;
  } | null;
  receipts: {
    date: Date;
    product: string;
    quantity: number;
    priceSold: number;
    total: number;
  }[]; 
}[]

export interface DataItemDebts {
  id?: string; // Optional ID for the data item
  statistics: Statistics;
  madeniYaliyolipwa: number;
  madeniYaliyokusanywa: number;
  totalCollected: number;
  pagination: Pagination;
  paginatedData: paginatedData;
}
