import { component$, useResource$, useSignal } from '@builder.io/qwik';
import { fetchWithLang } from '~/routes/function/fetchLang';

export const ExpensesComponent = component$(() => {
  const dummyExpenses = [
    {
      id: 1,
      category: 'Usafiri',
      amount: 5000,
      date: '2025-04-10',
      note: 'Nauli ya kwenda sokoni',
    },
    {
      id: 2,
      category: 'Matumizi ya Nyumbani',
      amount: 8000,
      date: '2025-04-12',
      note: 'Ununuzi wa chakula',
    },
    {
      id: 3,
      category: 'Mengineyo',
      amount: 2500,
      date: '2025-04-15',
      note: 'Vocha ya simu',
    },
  ];

  const totalExpenses = useSignal("0");

  useResource$(async () => {
    try {
      const res = await fetchWithLang("http://localhost:3000/analytics", {
        credentials: 'include'
      });

      if (!res.ok) {
        console.error("Response from the server is not ok")
      }

      const data = await res.json();
      
  
      const formatMoney = (amount: number | undefined) =>
        typeof amount === 'number' ? new Intl.NumberFormat().format(amount) : '0';
      totalExpenses.value = formatMoney(data?.netProfit?.totalExpenses);
      
      // then fetch total rows for expenses and purchases
  
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }else{
        console.error("Unknown error occured!")
      }
    }
  })

  return (
    <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Summary */}
      <div class="bg-green-100 rounded-xl shadow p-4 md:p-6 text-gray-800">
        <h2 class="text-lg md:text-2xl font-bold mb-3">📉 Muhtasari wa Matumizi</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
          <div class="bg-rose-100 p-3 rounded-xl">💸 Jumla ya Matumizi: <strong>{totalExpenses.value} TZS</strong></div>
        </div>
      </div>

      {/* Expense List */}
      <div>
        <h2 class="text-xl font-bold mb-3 text-teal-700">📋 Orodha ya Matumizi</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dummyExpenses.map((expense) => (
            <div key={expense.id} class="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-lg text-gray-800">📁 {expense.category}</h3>
                <span class="text-sm text-gray-500">{expense.date}</span>
              </div>
              <div class="text-sm text-gray-700 space-y-1">
                <p>💰 Gharama: <span class="font-semibold text-red-600">{expense.amount.toLocaleString()} TZS</span></p>
                <p>📝 Maelezo: {expense.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
