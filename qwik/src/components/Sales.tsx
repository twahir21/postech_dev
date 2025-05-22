import { component$, useSignal, useStore, $, useTask$ } from '@builder.io/qwik';
import { format } from 'date-fns';
import { CrudService } from '~/routes/api/base/oop';

interface Sale {
  id?: string;
  name: string;
  date: string;
  total: number;
  priceBought: number;
  quantity: number;
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
      const newApiSales = new CrudService<Sale>(`sales?${params}`);
      const salesGetData = await newApiSales.get();

      if (!salesGetData.success) return;

      sales.value = salesGetData.data;

      totalPages.value = Math.ceil(salesGetData.total / limit);

    } catch (err) {
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

        {dateFilter.value === 'Tarehe_maalumu' && (
          <>
            <label class="text-sm mt-2">Kuanzia:</label>
            <input
              type="date"
              class="border px-3 py-2 rounded"
              onChange$={(e) => (filters.startDate = (e.target as HTMLInputElement).value)}
            />
            <label class="text-sm mt-2">Mpaka:</label>
            <input
              type="date"
              class="border px-3 py-2 rounded"
              onChange$={(e) => (filters.endDate = (e.target as HTMLInputElement).value)}
            />
          </>
        )}

        <input
          type="text"
          placeholder="Tafuta kwa jina la bidhaa ..."
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
              <th class="p-2">Tarehe</th>
              <th class="p-2">Bidhaa</th>
              <th class="p-2">Jumla</th>
              <th class="p-2">Faida</th>
              <th class="p-2">Idadi</th>
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
            (sale.total - (sale.priceBought * sale.quantity)) > 0 ? 'text-green-600' : 'text-red-400'
          }`}
        >
          {Intl.NumberFormat().format(sale.total - (sale.priceBought * sale.quantity))}
        </td>
        <td class="p-2">{sale.quantity}</td>
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
              Nyuma
            </button>
            <span>
              Kurasa {page.value} kati ya {totalPages.value}
            </span>
            <button
              class="bg-gray-300 text-black px-3 py-2 rounded"
              disabled={page.value >= totalPages.value}
              onClick$={() => (page.value = Math.min(totalPages.value, page.value + 1))}
            >
              Mbele
            </button>
          </div>

          {/* Export CSV */}
          <a
            href={`http://localhost:3000/export-sales`}
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            ⬇️ Toa kwa CSV
          </a>
        </div>
      )}
    </div>
  );
});
