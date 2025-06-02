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

interface trialEnd{
  trialEnd: Signal<string>;
}

interface lowStockProducts {
  lowStockProducts: Signal<{ name: string; priceSold: string; stock: number}[]>;
}

interface Subscription {
  subscription: Signal<"Msingi" | "Lite" | "Business" | "Pro" | "AI" | "Trial">;
}

export const netSalesGraph = createContextId<NetSalesData>('netSales-graph');
export const netExpensesGraph = createContextId<NetExpensesData>('netExpenses-graph');
export const netPurchasesGraph = createContextId<NetPurchasesData>('netPurchases-graph');
export const salesGraph = createContextId<SalesData>('sales-graph');
export const stockGraph = createContextId<Stock>('stock-graph');
export const trialEndData = createContextId<trialEnd>('trialEnd');
export const lowStockProductsData = createContextId<lowStockProducts>('lowStockProducts');
export const subscriptionData = createContextId<Subscription>('subscription');