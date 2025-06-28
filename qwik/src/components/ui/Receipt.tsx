import { component$, useSignal } from '@builder.io/qwik';

type Transaction = {
  product: string;
  quantity: number;
  priceSold: number;
};

export const Receipt = component$(() => {
  const showReceipt = useSignal(false);
  const currentPage = useSignal(1);
  const itemsPerPage = 2;

  const transactions: Transaction[] = [
    { product: 'Mafuta ya kupika', quantity: 2, priceSold: 4000 },
    { product: 'Sukari', quantity: 1, priceSold: 2700 },
    { product: 'Mchele', quantity: 3, priceSold: 3000 },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Paginated transactions
  const paginatedTransactions = transactions.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  );

  return (
    <div class="w-full">
      <button
        onClick$={() => (showReceipt.value = !showReceipt.value)}
        class={`underline decoration-1 focus:outline-none cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${
          showReceipt.value
            ? 'text-red-600 decoration-red-600 hover:text-red-700 hover:decoration-2'
            : 'text-green-600 decoration-green-600 hover:text-green-700 hover:decoration-2'
        }`}
      >
        {showReceipt.value ? 'Funga Risiti' : 'Onyesha Risiti'}
      </button>

      {showReceipt.value && (
        <div class="bg-white mt-6 p-4 rounded-lg shadow text-sm text-gray-800 font-mono border w-full">
          <div class="text-center border-b pb-2 mb-2">
            <h2 class="text-base font-semibold">🧾 Risiti ya Mauzo</h2>
            <p class="text-xs text-gray-500">
              Tarehe: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div class="space-y-2">
            {paginatedTransactions.map((item, index) => (
              <div key={index} class="flex justify-between border-b pb-1">
                <div>
                  <div class="font-bold">{item.product}</div>
                  <div class="text-xs text-gray-500">
                    {item.quantity} x {item.priceSold.toLocaleString()} TZS
                  </div>
                </div>
                <div class="font-semibold text-right">
                  {(item.quantity * item.priceSold).toLocaleString()} TZS
                </div>
              </div>
            ))}

          </div>

          {/* Pagination Controls */}
          <div class="mt-4 flex justify-between items-center text-sm">
            <button
              onClick$={() => {
                if (currentPage.value > 1) currentPage.value--;
              }}
              disabled={currentPage.value === 1}
              class={`px-2 py-1 rounded ${
                currentPage.value === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              ◀️ 
            </button>

            <span class="text-gray-600">
              {currentPage.value} kati ya {totalPages}
            </span>

            <button
              onClick$={() => {
                if (currentPage.value < totalPages) currentPage.value++;
              }}
              disabled={currentPage.value === totalPages}
              class={`px-2 py-1 rounded ${
                currentPage.value === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
               ▶️
            </button>
          </div>
        </div>
      )}
    </div>
  );
});