import { component$, useSignal } from '@builder.io/qwik';

type Transaction = {
  product: string;
  quantity: number;
  priceSold: number;
};

export default  component$(() => {
  const showReceipt = useSignal(false);

  const transactions: Transaction[] = [
    { product: 'Mafuta ya kupika', quantity: 2, priceSold: 4000 },
    { product: 'Sukari', quantity: 1, priceSold: 2700 },
    { product: 'Mchele', quantity: 3, priceSold: 3000 },
  ];

  const totalAmount = transactions.reduce(
    (sum, item) => sum + item.quantity * item.priceSold,
    0
  );

  return (
    <div class="max-w-md mx-auto mt-6 p-4">
      <button
        onClick$={() => (showReceipt.value = !showReceipt.value)}
        class={`underline decoration-1 focus:outline-none cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95
          ${
            showReceipt.value
              ? 'text-red-600 decoration-red-600 hover:text-red-700 hover:decoration-2'
              : 'text-green-600 decoration-green-600 hover:text-green-700 hover:decoration-2'
          }`}
      >
        {showReceipt.value ? 'Funga Risiti' : 'Onyesha Risiti'}
      </button>


      {showReceipt.value && (
        <div class="bg-white mt-6 p-4 sm:p-6 rounded-lg shadow text-sm text-gray-800 font-mono border">
          <div class="text-center border-b pb-2 mb-2">
            <h2 class="text-base font-semibold">🧾 Risiti ya Mauzo</h2>
            <p class="text-xs text-gray-500">Tarehe: {new Date().toLocaleDateString()}</p>
          </div>

          <div class="space-y-2">
            {transactions.map((item, index) => (
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

            <div class="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
              <span>Jumla</span>
              <span>{totalAmount.toLocaleString()} TZS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
