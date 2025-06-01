import { createContextId } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";

interface NetSalesData {
  netSales: Signal<{ day: string; netSales: number }[]>;
}

export const netSalesGraph = createContextId<NetSalesData>('netSales-graph');

