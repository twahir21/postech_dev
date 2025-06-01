import { createContextId } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";

interface NetSalesData {
  netSales: Signal<{ day: string; netSales: number }[]>;
}

interface NetExpensesData {
  netExpenses: Signal<{ day: string; netExpenses: number }[]>;
}

interface NetPurchasesData {
  netPurchases: Signal<{ day: string; netPurchases: number }[]>;
}

interface SalesData {
  sales: Signal<{ day: string; Sales: number }[]>;
}

interface Stock {
  stock: Signal<{ day: string; totalStock: number }[]>;
}

export const netSalesGraph = createContextId<NetSalesData>('netSales-graph');
export const netExpensesGraph = createContextId<NetExpensesData>('netExpenses-graph');
export const netPurchasesGraph = createContextId<NetPurchasesData>('netPurchases-graph');
export const salesGraph = createContextId<SalesData>('sales-graph');
export const stockGraph = createContextId<Stock>('stock-graph');