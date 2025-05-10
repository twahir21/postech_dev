// src/components/ReceiptsPage.tsx
import { component$, useSignal, useStore } from '@builder.io/qwik';
import { format } from 'date-fns';

interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

interface Receipt {
  id: string;
  date: string;
  customer: string;
  paymentType: 'Cash' | 'Debt';
  total: number;
  items: ReceiptItem[];
}

export const ReceiptComponent = component$(() => {
  const search = useSignal('');
  const filterDate = useSignal('today');

  const filters = useStore({
    startDate: '',
    endDate: '',
  });

  const dummyReceipts: Receipt[] = [
    {
      id: 'RCPT-1001',
      date: new Date().toISOString(),
      customer: 'John Doe',
      paymentType: 'Cash',
      total: 18500,
      items: [
        { name: 'Chips', qty: 2, price: 2500 },
        { name: 'Juice', qty: 1, price: 3500 },
        { name: 'Water', qty: 3, price: 1000 },
      ],
    },
    {
      id: 'RCPT-1002',
      date: new Date().toISOString(),
      customer: 'Jane Smith',
      paymentType: 'Debt',
      total: 7200,
      items: [
        { name: 'Bread', qty: 2, price: 1200 },
        { name: 'Milk', qty: 2, price: 2400 },
        { name: 'Eggs', qty: 1, price: 2400 },
      ],
    },
  ];

  const filtered = dummyReceipts.filter((r) =>
    r.customer.toLowerCase().includes(search.value.toLowerCase())
  );

  return (
    <div class="p-4 space-y-4">
      {/* Header */}
      <h1 class="text-xl font-bold text-gray-800 md:text-2xl">🧾 Risiti za Mauzo</h1>

      {/* Filters */}
      <div class="flex flex-wrap gap-2">
        <select
          class="border px-3 py-2 rounded text-sm"
          value={filterDate.value}
          onChange$={(e) => (filterDate.value = (e.target as HTMLSelectElement).value)}
        >
          <option value="today">Leo</option>
          <option value="yesterday">Jana</option>
          <option value="week">Wiki Hii</option>
          <option value="month">Mwezi Huu</option>
          <option value="custom">Tarehe Maalum</option>
        </select>
        {filterDate.value === 'custom' && (
          <>
            <input
              type="date"
              class="border px-3 py-2 rounded text-sm"
              onChange$={(e) => (filters.startDate = (e.target as HTMLInputElement).value)}
            />
            <input
              type="date"
              class="border px-3 py-2 rounded text-sm"
              onChange$={(e) => (filters.endDate = (e.target as HTMLInputElement).value)}
            />
          </>
        )}
        <input
          type="text"
          placeholder="Tafuta Mteja"
          class="border px-3 py-2 rounded text-sm flex-1"
          onInput$={(e) => (search.value = (e.target as HTMLInputElement).value)}
        />
      </div>

      {/* Receipt List */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            class="bg-white p-4 rounded-xl shadow-sm text-sm space-y-2 border border-gray-500"
          >
            <div class="flex justify-between text-xs text-gray-500">
              <span>Risiti: <strong>{r.id}</strong></span>
              <span>{format(new Date(r.date), 'dd MMM yyyy, HH:mm')}</span>
            </div>
            <div class="font-semibold text-gray-800">👤 {r.customer}</div>
            <div class="text-gray-700">
              {r.items.map((item) => (
                <div class="flex justify-between" key={item.name}>
                  <span>{item.name} x{item.qty}</span>
                  <span>{item.price * item.qty} TZS</span>
                </div>
              ))}
            </div>
            <div class="flex justify-between font-bold text-gray-800 pt-2 border-t mt-2">
              <span>Jumla</span>
              <span>{Intl.NumberFormat().format(r.total)} TZS</span>
            </div>
            <div class="text-right text-xs text-gray-500">Malipo: {r.paymentType}</div>
            {/* Export */}
            <div class="pt-1 flex justify-center">
                <button
                    onClick$={() => window.print()}
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                    Print Risiti 🖨️
                </button>
            </div>
            <div>
                
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div class="text-center text-gray-400 italic mt-6 col-span-full">
            Hakuna risiti zilizopatikana
          </div>
        )}
      </div>
    </div>
  );
});


