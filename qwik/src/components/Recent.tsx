import { component$, useContext, useSignal } from "@builder.io/qwik";
import { lowStockProductsData } from "./context/store/netSales";

export const RecentProductsTable = component$(() => {
  const errorMessage = useSignal<string | null>(null);

  const { lowStockProducts } = useContext(lowStockProductsData);

  return (
    <div class="overflow-x-auto">
      <h1 class="font-semibold text-1xl">
        Bidhaa zilizopungua
      </h1>

      {errorMessage.value ? (
        <p class="text-red-500">⚠️ {errorMessage.value}</p>
      ) : lowStockProducts.value.length === 0 ? (
        <p class="text-gray-600">✅ Hakuna bidhaa ya kuagiza.</p>
      ) : (
        <table class="min-w-full border border-gray-300 shadow-md mt-4">
          <thead>
            <tr class="bg-gray-700 text-white">
              <th class="border border-black px-4 py-2">#</th>
              <th class="border border-black px-4 py-2">
                Bidhaa
              </th>
              <th class="border border-black px-4 py-2">
                Bei
              </th>
              <th class="border border-black px-4 py-2">
                Hisa
              </th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.value.map((product, index) => (
              <tr
                key={index}
                class={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-200"}
              >
                <td class="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">{product.name}</td>
                <td class="border border-gray-300 px-4 py-2">{product.priceSold + "/=" || '-'}</td>
                <td class="border border-gray-300 px-4 py-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});
