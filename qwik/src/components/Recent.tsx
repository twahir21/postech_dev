import { component$, useContext, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Translate } from "./Language";
import { fetchWithLang } from "~/routes/function/fetchLang";
import { RefetchContext } from "./context/refreshContext";

export const RecentProductsTable = component$((props: { lang: string }) => {
  const lowStockProducts = useSignal<any[]>([]);
  const errorMessage = useSignal<string | null>(null);

  const { productRefetch } = useContext(RefetchContext);

  useVisibleTask$(async ({ track }) => {
    track(() => productRefetch.value);
    try {
      const response = await fetchWithLang("http://localhost:3000/analytics", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();

      lowStockProducts.value = data.lowStockProducts || [];
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      errorMessage.value = error.message;
    }
  });

  return (
    <div class="overflow-x-auto">
      <h1 class="font-semibold text-1xl">
        <Translate lang={props.lang} keys={['recently_added_products']} />
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
                <Translate lang={props.lang} keys={['product']} />
              </th>
              <th class="border border-black px-4 py-2">
                <Translate lang={props.lang} keys={['price']} />
              </th>
              <th class="border border-black px-4 py-2">
                <Translate lang={props.lang} keys={['stock']} />
              </th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.value.map((product, index) => (
              <tr
                key={product.id || index}
                class={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-200"}
              >
                <td class="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td class="border border-gray-300 px-4 py-2">{product.name}</td>
                <td class="border border-gray-300 px-4 py-2">{product.priceSold || '-'}</td>
                <td class="border border-gray-300 px-4 py-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});
