import { createContextId } from "@builder.io/qwik";


interface NetProfit {
  totalExpenses: number;
  totalSales: number;
  totalPurchases: number;
  netProfit: number;
}

export interface GlobalAnalyticsData {
  success: boolean;
  profitPerProduct: any[]; // You might want to define a more specific interface here
  highestProfitProduct: any | null; // Define a specific interface if possible
  netProfit: NetProfit;
  lowestProduct: any[]; // Define a specific interface if possible
  lowStockProducts: any[]; // Define a specific interface if possible
  mostSoldProductByQuantity: any | null; // Define a specific interface if possible
  mostFrequentProduct: any | null; // Define a specific interface if possible
  longTermDebtUser: any | null; // Define a specific interface if possible
  mostDebtUser: any | null; // Define a specific interface if possible
  daysSinceDebt: string;
  salesByDay: any[]; // Define a specific interface if possible
  expensesByDay: any[]; // Define a specific interface if possible
  netSalesByDay: any[]; // Define a specific interface if possible
  purchasesPerDay: any[]; // Define a specific interface if possible
}

export const globalAnalytics = createContextId<GlobalAnalyticsData>('global-analytics');

