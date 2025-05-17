import { component$, useResource$, useSignal } from "@builder.io/qwik";
import { DebtComponentGraph } from "./Debt";
import { CashDebt } from "./CashDebt";
import { Salexp } from "./Salexp";
import { StockComponent } from "./Stock";

export const MainGraph =  component$(() => {
  const selected = useSignal<'debts' | 'cash' | 'expenses' | 'stock' | null>(null);
  useResource$(async () => {
    try {
      const res = await fetch("http://localhost:3000/graph", {
        credentials: 'include'
      });
  
      if (!res.ok) {
        console.error("Invalid response from server");
      }
  
      const data = await res.json();

      console.log(data)
    } catch (error) {
      if (error instanceof Error ){
        console.error(error.message);
      }else{
        console.log("Unknown error occured")
      }
    }
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
          <h3 class="text-lg font-semibold">💵 Mauzo ya Cash</h3>
          <p class="text-sm text-gray-600">Mapato yote kwa pesa taslimu</p>
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
          <h3 class="text-lg font-semibold">📦 Stoo</h3>
          <p class="text-sm text-gray-600">Hisa zilizopo kwa sasa</p>
        </button>
      </div>

      {/* Display selected component */}
      {selected.value && (
        <div class="border rounded-xl p-4 shadow mt-4 bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
          <h2 class="text-lg font-bold mb-2">
            {selected.value === 'debts' && '📊 Madeni'}
            {selected.value === 'cash' && '💵 Mauzo ya Cash'}
            {selected.value === 'expenses' && '💸 Matumizi'}
            {selected.value === 'stock' && '📦 Stoo'}
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
