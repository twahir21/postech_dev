import {
  component$,
  useSignal,
  useVisibleTask$,
  useStore,
  $,
} from '@builder.io/qwik';
import { CrudService } from '~/routes/api/base/oop';
import { formatDateTime, formatMoney } from '~/routes/function/helpers';

export const ExpensesComponent = component$(() => {
  const totalExpenses = useSignal('0');
  const page = useSignal(1);
  const perPage = 6;
  const state = useStore({
    items: [] as { description: string; amount: number; date: string }[],
    totalPages: 1,
  });

  interface ExpensesApiResponse {
    id?: string;
    items: { description: string; amount: number; date: string }[];
    totalAmount: string;
    totalPages: number;
  }

  const fetchExpenses = $(async () => {
    const expApi = new CrudService<ExpensesApiResponse>('expenses');
    const expResult = await expApi.getWithParams({ page: page.value, limit: perPage });

    if (expResult.success) {
      const { items, totalAmount, totalPages } = expResult.data[0];
      totalExpenses.value = formatMoney(Number(totalAmount));
      state.items = items;
      state.totalPages = totalPages;
    }
  });

  useVisibleTask$(() => {
    fetchExpenses();
  });

  return (
    <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Summary */}
      <div class="bg-green-100 rounded-xl shadow p-4 md:p-6 text-gray-800">
        <h2 class="text-lg md:text-2xl font-bold mb-3">📉 Muhtasari wa Matumizi</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
          <div class="bg-rose-100 p-3 rounded-xl">
            💸 Jumla ya Matumizi: <strong>{totalExpenses.value} TZS</strong>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div>
        <h2 class="text-xl font-bold mb-3 text-teal-700">📋 Orodha ya Matumizi</h2>
        {state.items.length > 0 ? (<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {state.items.map((expense, index) => (
            <div
              key={index}
              class="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <div class="text-sm text-gray-500 font-bold mb-2">
                {formatDateTime(expense.date)}
              </div>
              <div class="text-sm text-gray-700 space-y-1">
                <p>
                  💰 Gharama:{' '}
                  <span class="font-semibold text-red-600">
                    {formatMoney(Number(expense.amount))} TZS
                  </span>
                </p>
                <p>📝 Maelezo: {expense.description}</p>
              </div>
            </div>
          ))}
        </div>): (
          <div class="text-gray-500">
            <p>Hakuna matumizi yaliyopatikana.</p>
          </div>
        )}

        {/* Pagination */}
        <div class="flex justify-center mt-6 space-x-4">
          <button
            onClick$={() => {
              if (page.value > 1) {
                page.value--;
                fetchExpenses();
              }
            }}
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={page.value === 1}
          >
            ⬅️ Nyuma
          </button>
          <span class="px-4 py-2">{`Ukurasa ${page.value} ya ${state.totalPages}`}</span>
          <button
            onClick$={() => {
              if (page.value < state.totalPages) {
                page.value++;
                fetchExpenses();
              }
            }}
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={page.value === state.totalPages}
          >
            Mbele ➡️
          </button>
        </div>
      </div>
    </div>
  );
});
