import { component$ } from '@builder.io/qwik';

export const DebtComponent = component$(() => {
  const dummyDebts = [
    {
      id: 1,
      customer: 'Juma Kipanga',
      total: 50000,
      paid: 20000,
      dueDate: '2025-04-30',
      lastPayment: '2025-04-14',
      history: [
        { date: '2025-04-10', amount: 30000 },
        { date: '2025-04-14', amount: 20000 },
      ],
    },
    {
      id: 2,
      customer: 'Mwanaidi J.',
      total: 75000,
      paid: 0,
      dueDate: '2025-05-02',
      lastPayment: null,
      history: [],
    },
  ];

  return (
    <>
      <div class="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Summary */}
        <div class="bg-white rounded-xl shadow p-4 md:p-6 text-gray-800">
        <h2 class="text-lg md:text-2xl font-bold mb-3">📊 Muhtasari wa Madeni</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
            <div class="bg-teal-100 p-3 rounded-xl">💰 Jumla ya Madeni: <strong>12,000 TZS</strong></div>
            <div class="bg-yellow-100 p-3 rounded-xl">👥 Wateja Wenye Madeni: <strong>1</strong></div>
            <div class="bg-green-100 p-3 rounded-xl">✅ Madeni Yaliyolipwa: <strong>1</strong></div>
            <div class="bg-blue-100 p-3 rounded-xl">📈 Malipo Yaliyokusanywa: <strong>6,000 TZS</strong></div>
        </div>
        </div>


        {/* Actions */}
        <div class="bg-white rounded-xl shadow p-4 md:p-6 text-gray-800">
          <h2 class="text-lg md:text-2xl font-bold mb-4">⚙️ Hatua za Haraka</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm md:text-base">
            <button class="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600">👁️ Angalia Madeni</button>
            <button class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">💸 Lipisha</button>
            <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">🖨️ Chapisha Risiti</button>
            <button class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">🧹 Futa Yaliyolipwa</button>
          </div>
        </div>

        {/* Analytics */}
        <div class="bg-white rounded-xl shadow p-4 md:p-6 text-gray-800">
          <h2 class="text-lg md:text-2xl font-bold mb-3">📈 Takwimu Muhimu</h2>
          <div class="grid gap-3 text-sm md:text-base md:grid-cols-3">
            <div class="bg-orange-50 rounded p-3">🔥 Wateja Wanaodaiwa Zaidi: <strong>John Doe</strong> (12,000 TZS)</div>
            <div class="bg-purple-50 rounded p-3">🕰️ Madeni ya Muda Mrefu: <strong>John Doe</strong> (Tangu 2025-03-01)</div>
            <div class="bg-indigo-50 rounded p-3">🔁 Wateja Wanaorudia Mara Kwa Mara: <strong>John Doe</strong></div>
          </div>
        </div>

        {/* Debt Cards */}
        <div>
          <h2 class="text-2xl md:text-3xl font-bold mb-4 text-teal-700">📒 Madeni ya Wateja</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {dummyDebts.map((debt) => {
              const remaining = debt.total - debt.paid;
              return (
                <div
                  key={debt.id}
                  class="bg-white rounded-2xl shadow-md p-4 md:p-6 flex flex-col gap-3 border border-gray-200 hover:shadow-lg transition"
                >
                  <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-lg md:text-xl text-gray-800">{debt.customer}</h3>
                    <span class="text-sm text-gray-500">💳 {debt.dueDate}</span>
                  </div>

                  <div class="text-sm md:text-base text-gray-600 space-y-1">
                    <p>💰 Jumla ya Deni: <span class="font-semibold text-red-600">{debt.total.toLocaleString()} TZS</span></p>
                    <p>✅ Alicholipa: {debt.paid.toLocaleString()} TZS</p>
                    <p>🕒 Bado: <span class="font-semibold text-orange-600">{remaining.toLocaleString()} TZS</span></p>
                    <p>📅 Malipo ya Mwisho: {debt.lastPayment || '—'}</p>
                  </div>

                  {debt.history.length > 0 && (
                    <details class="mt-2 text-sm md:text-base">
                      <summary class="cursor-pointer text-blue-600 hover:underline">📜 Angalia Historia</summary>
                      <ul class="ml-4 mt-1 list-disc text-gray-700">
                        {debt.history.map((h, i) => (
                          <li key={i}>
                            {h.date}: {h.amount.toLocaleString()} TZS
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <button class="mt-3 text-sm md:text-base bg-teal-600 hover:bg-teal-700 text-white py-1.5 px-4 rounded-md self-start">
                    Ongeza Malipo
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
});
