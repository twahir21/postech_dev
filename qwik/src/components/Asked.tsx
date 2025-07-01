import { $, component$, useContext, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { subscriptionData } from "./context/store/netSales";
import { CrudService } from "~/routes/api/base/oop";
import { Toast } from "./ui/Toast";

export const AskedProducts = component$(() => {
  const { subscription } = useContext(subscriptionData);

  const input = useSignal("");
  const name = useStore({ id: '', name: '' });

  // pagination
  const page = useSignal(1);
  const perPage = 3;
  const totalPages = useSignal(1);

  const modal = useStore({ isOpen: false, isSuccess: false, message: '' });

  const fetched = useSignal<{ id?: string; name: string; count: number }[] | null>(null);

  const fetchData = $(async () => {
    const newApi = new CrudService<{ id?: string; data: { id?: string; name: string; count: number }[]; currentPage?: string; totalPages: number }>("asked");
    const apiRes = await newApi.getWithParams({ page: page.value, limit: perPage });

    if (!apiRes.success) {
      return;
    }

    fetched.value = apiRes.data[0].data;
    totalPages.value = apiRes.data[0].totalPages
  });

  const sendData = $(async () => {
    const newApi = new CrudService<{ id?: string; name: string }>("asked");
    const apiRes = await newApi.create({ name: name.name });

    modal.isOpen = true;
    modal.isSuccess = apiRes.success;
    modal.message = apiRes.message || (apiRes.success ? "Imehifadhiwa" : "Imeshindwa kuhifadhi");

    if (apiRes.success) await fetchData();
  });

  const updateData = $(async (prdId: string) => {
    const item = fetched.value?.find((i) => i.id === prdId);
    if (!item) return;

 
    const newApi = new CrudService<{ id?: string; count: number }>(`asked/${prdId}`);
    const apiRes = await newApi.update({ id: prdId, count: item.count + 1 });

    modal.isOpen = true;
    modal.isSuccess = apiRes.success;
    modal.message = apiRes.message || (apiRes.success ? "Imebadilishwa kiukamilifu" : "Imeshindwa kubadilishwa");

    if (apiRes.success) await fetchData();
  });

  const deleteData = $(async (prdId: string) => {

    const newApi = new CrudService<{ id?: string }>("asked");
    const apiRes = await newApi.delete(prdId);

    modal.isOpen = true;
    modal.isSuccess = apiRes.success;
    modal.message = apiRes.message || (apiRes.success ? "Imefutwa" : "Imeshindwa kufuta");

    if (apiRes.success) await fetchData();
  });

  const addProduct = $(async () => {
    if (!input.value.trim()) return;
    name.name = input.value.trim();
    input.value = "";
    await sendData();
  });

  useVisibleTask$(() => {
    fetchData();
  });

  if (subscription.value === "Msingi") {
    return (
      <div class="max-w-md mx-auto p-6 mt-8 bg-white shadow-2xl rounded-2xl border border-gray-600">
        <h2 class="text-xl font-bold text-center text-gray-700 mb-4">📈 Bidhaa Inayouliziwa Sana</h2>
        <p class="text-center text-gray-500 mb-4">🚫 Huduma hii inapatikana kwa wateja wa Lite na kuendelea.</p>
      </div>
    );
  }

  return (
    <div class="max-w-md mx-auto p-6 mt-8 bg-white shadow-2xl rounded-2xl border border-gray-600">
      <h2 class="text-xl font-bold text-center text-gray-700 mb-4">📈 Bidhaa Inayouliziwa Sana</h2>

      <div>
        <div class="flex items-center gap-2 mb-4">
          <input
            type="text"
            bind:value={input}
            placeholder="Andika jina la bidhaa"
            class="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick$={addProduct}
            class="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
          >
            Ongeza
          </button>
        </div>

        {fetched.value === null ? (
          <p class="text-center text-gray-400 italic">Inapakia...</p>
        ) : fetched.value.length === 0 ? (
          <p class="text-center text-gray-500">Hakuna bidhaa bado.</p>
        ) : (
          <ul class="space-y-3">
            {fetched.value.map((product) => (
              <li
                key={product.id}
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
              >
                <div>
                  <p class="text-sm font-medium text-gray-700">🛒 {product.name}</p>
                  <p class="text-xs text-gray-500">
                    Imeulizwa {product.count > 1 ? "mara" : "mara moja"} {product.count}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    onClick$={async () => await updateData(product.id!)}
                    class="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600"
                  >
                    ➕
                  </button>
                  <button
                    onClick$={async () => await deleteData(product.id!)}
                    class="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div class="flex justify-center mt-6 space-x-4">
          <button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick$={() => {
              if (page.value > 1) {
                page.value--;
                fetchData();
              }
            }}
            disabled={page.value === 1}

          >
            ⬅️ Nyuma
          </button>
          <span class="px-4 py-2">{`Ukurasa ${page.value} ya ${totalPages.value}`}</span>
          <button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick$={() => {
              if (page.value < totalPages.value) {
                page.value++;
                fetchData();
              }
            }}
            disabled={page.value === totalPages.value}
          >
            Mbele ➡️
          </button>
        </div>

        {modal.isOpen && (
          <Toast
            isOpen={modal.isOpen}
            type={modal.isSuccess}
            message={modal.message}
            onClose$={$(() => {
              modal.isOpen = false;
            })}
          />
        )}
      </div>
    </div>
  );
});
