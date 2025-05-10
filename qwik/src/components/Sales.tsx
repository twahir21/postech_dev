import { component$, useSignal, useStore, $, useTask$ } from '@builder.io/qwik';
import { format } from 'date-fns';

interface Sale {
  name: string;
  date: string;
  total: number;
  paymentType: string;
  customer: string;
  products: { name: string; qty: number }[];
}

export const SalesComponent = component$(() => {
  const dateFilter = useSignal('Leo');
  const search = useSignal('');
  const page = useSignal(1);
  const limit = 10;
  const totalPages = useSignal(1);
  const sales = useSignal<Sale[]>([]);
  const isLoading = useSignal(true);

  const filters = useStore({
    startDate: '',
    endDate: '',
  });

  const fetchSales = $(async () => {
    isLoading.value = true;

    const params = new URLSearchParams({
      search: search.value,
      date: dateFilter.value,
      page: String(page.value),
      limit: String(limit),
    });

    if (dateFilter.value === 'custom') {
      if (filters.startDate) params.append('from', filters.startDate);
      if (filters.endDate) params.append('to', filters.endDate);
    }

    try {
      console.log(params);
      const res = await fetch(`http://localhost:3000/sales?${params}`, {
        credentials: 'include'
      });
      const data = await res.json();

      sales.value = data.sales;

      console.log(sales.value)
      totalPages.value = Math.ceil(data.total / limit);
    } catch (err) {
      console.error('Fetch error:', err);
      sales.value = [];
    } finally {
      isLoading.value = false;
    }
  });

  useTask$(({ track }) => {
    track(() => search.value);
    track(() => dateFilter.value);
    track(() => page.value);
    track(() => filters.startDate);
    track(() => filters.endDate);

    fetchSales();
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl md:text-3xl font-bold text-center mb-6 text-primary text-gray-800">
        💰 Mauzo Yaliyofanyika
      </h1>

      {/* Filters */}
      <div class="flex flex-wrap gap-2 mb-4">
        <select
          class="border px-3 py-2 rounded"
          value={dateFilter.value}
          onChange$={(e) => {
            dateFilter.value = (e.target as HTMLSelectElement).value;
            page.value = 1;
          }}
        >
          <option value="Leo">Leo</option>
          <option value="Jana">Jana</option>
          <option value="Wiki_hii">Wiki hii</option>
          <option value="Mwezi_huu">Mwezi huu</option>
          <option value="Tarehe_maalumu">Tarehe maalumu</option>
        </select>

        {dateFilter.value === 'custom' && (
          <>
            <label class="text-sm mt-2">From:</label>
            <input
              type="date"
              class="border px-3 py-2 rounded"
              onChange$={(e) => (filters.startDate = (e.target as HTMLInputElement).value)}
            />
            <label class="text-sm mt-2">To:</label>
            <input
              type="date"
              class="border px-3 py-2 rounded"
              onChange$={(e) => (filters.endDate = (e.target as HTMLInputElement).value)}
            />
          </>
        )}

        <input
          type="text"
          placeholder="Search customer"
          class="border px-3 py-2 rounded flex-1"
          onInput$={(e) => {
            search.value = (e.target as HTMLInputElement).value;
            page.value = 1;
          }}
        />
      </div>

      {/* Desktop view */}
      <div class="overflow-x-auto border rounded shadow">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2">Date</th>
              <th class="p-2">Products</th>
              <th class="p-2">Total</th>
              <th class="p-2">Payment</th>
              <th class="p-2">Customer</th>
            </tr>
          </thead>
          <tbody>
  {isLoading.value ? (
    <tr>
      <td colSpan={5} class="p-4 text-center text-gray-500">
        ⏳ Inaleta mauzo...
      </td>
    </tr>
  ) : sales.value.length === 0 ? (
    <tr>
      <td colSpan={5} class="p-4 text-center text-gray-500">
        🚫 Hakuna mauzo bado...
      </td>
    </tr>
  ) : (
    sales.value.map((sale, index) => (
      <tr key={index} class="border-t">
        <td class="p-2">{format(new Date(sale.date), 'dd MMM yyyy')}</td>
        <td class="p-2">{sale.name}</td> {/* show product name */}
        <td class="p-2">{Intl.NumberFormat().format(sale.total)}</td>
        <td
          class={`p-2 font-semibold ${
            sale.paymentType === 'cash' ? 'text-green-600' : 'text-yellow-600'
          }`}
        >
          {sale.paymentType}
        </td>
        <td class="p-2">{sale.customer}</td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      {/* Footer */}
      {!isLoading.value && (
        <div class="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div class="flex gap-2">
            <button
              class="bg-gray-300 text-black px-3 py-2 rounded"
              disabled={page.value <= 1}
              onClick$={() => (page.value = Math.max(1, page.value - 1))}
            >
              Previous
            </button>
            <span>
              Page {page.value} of {totalPages.value}
            </span>
            <button
              class="bg-gray-300 text-black px-3 py-2 rounded"
              disabled={page.value >= totalPages.value}
              onClick$={() => (page.value = Math.min(totalPages.value, page.value + 1))}
            >
              Next
            </button>
          </div>

          {/* Export CSV */}
          <a
            href={`http://localhost:3000/export-sales`}
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            ⬇️ Export CSV
          </a>
        </div>
      )}
    </div>
  );
});
