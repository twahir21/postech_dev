import { component$, useContext, useResource$, useSignal } from "@builder.io/qwik";
import { DebtComponentGraph } from "./Debt";
import { CashDebt } from "./CashDebt";
import { Salexp } from "./Salexp";
import { StockComponent } from "./Stock";
import { CrudService } from "~/routes/api/base/oop";
import type { GraphData } from "~/routes/api/types/graphTypes";
import { stockGraph } from "../context/store/netSales";

export const MainGraph =  component$(() => {
  const selected = useSignal<'debts' | 'cash' | 'expenses' | 'stock' | null>(null);
  const { stock } = useContext(stockGraph);
  useResource$(async () => {
    const graphAPI = new CrudService<GraphData>("graph");
    const result = await graphAPI.get();

    if (!result.success) return;
    // Update stock data with the fetched graph data
    stock.value = result.data[0].stockTrend.map((item) => ({
      day: item.day,
      totalStock: item.totalStock
    }));

  });

  return (
    <div class="p-4 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          class="border rounded-xl p-4 bg-white shadow hover:bg-blue-50 transition text-left"
          onClick$={() => (selected.value = 'debts')}
        >
          <h3 class="text-lg font-semibold">📊 Madeni</h3>
          <p class="text-sm text-gray-600">Angalia madeni yote ya wateja</p>
        </button>
        <button
          class="border rounded-xl p-4 bg-white shadow hover:bg-green-50 transition text-left"
          onClick$={() => (selected.value = 'cash')}
        >
          <h3 class="text-lg font-semibold">💵 Cash vs Madeni</h3>
          <p class="text-sm text-gray-600">Mapato yote kwa asilimia</p>
        </button>
        <button
          class="border rounded-xl p-4 bg-white shadow hover:bg-red-50 transition text-left"
          onClick$={() => (selected.value = 'expenses')}
        >
          <h3 class="text-lg font-semibold">💸 Matumizi</h3>
          <p class="text-sm text-gray-600">Tazama matumizi ya biashara</p>
        </button>
        <button
          class="border rounded-xl p-4 bg-white shadow hover:bg-yellow-50 transition text-left"
          onClick$={() => (selected.value = 'stock')}
        >
          <h3 class="text-lg font-semibold">📦 Stoku (Hisa)</h3>
          <p class="text-sm text-gray-600">Hisa zilizopo kwa sasa</p>
        </button>
      </div>

      {/* Display selected component */}
      {selected.value && (
        <div class="border rounded-xl p-4 shadow mt-4 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
          <h2 class="text-lg font-bold mb-2">
            {selected.value === 'debts' && '📊 Madeni'}
            {selected.value === 'cash' && '💵 Cash vs Madeni'}
            {selected.value === 'expenses' && '💸 Matumizi'}
            {selected.value === 'stock' && '📦 Stoku (Hisa)'}
          </h2>
          <div class="text-sm text-gray-700 ">
            {/* Render actual components based on selection */}
            {selected.value === 'debts' && <DebtComponentGraph />}
            {selected.value === 'cash' && <CashDebt />}
            {selected.value === 'expenses' && <Salexp />}
            {selected.value === 'stock' && <StockComponent />}          
            </div>
        </div>
      )}
    </div>
  );
});
