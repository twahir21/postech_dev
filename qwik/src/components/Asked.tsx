import { $, component$, useContext, useSignal, useStore } from "@builder.io/qwik";
import { subscriptionData } from "./context/store/netSales";
import { CrudService } from "~/routes/api/base/oop";
import { Toast } from "./ui/Toast";

export const AskedProducts = component$(() => {

  const { subscription } = useContext(subscriptionData);

  const products = useSignal([
    { id: 1, name: "Sukari", times: 8 },
    { id: 2, name: "Mafuta", times: 5 },
    { id: 3, name: "Unga", times: 3 },
  ]);
  const input = useSignal("");
  const name = useStore({
    id: '' as string,
    name: '' as string
  });

  const modal = useStore({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  const fetched = useSignal <{id?: string; name: string; count: number }[] | null>(null);

  const sendData = $(async () => {
    const newApi = new CrudService<{ id?: string; name: string}>("asked");

    const apiRes = await newApi.create(name);
    
    // fire a toast
    modal.isOpen = true;
    modal.isSuccess = apiRes.success;
    modal.message = apiRes.message || (apiRes.success ? "umefanikiwa kuhifadhi" : "Imefeli kuhifadhi");

  })


  const deleteData = $(async () => {
    const newApi = new CrudService<{ id?: string; name: string}>("asked");

    const apiRes = await newApi.delete();
    
    // fire a toast
    modal.isOpen = true;
    modal.isSuccess = apiRes.success;
    modal.message = apiRes.message || (apiRes.success ? "umefanikiwa kufuta" : "Imefeli kufuta");

  })

  const updateData = $(async () => {
    const newApi = new CrudService<{ id?: string; name: string}>("asked");

    const apiRes = await newApi.update();
    
    // fire a toast
    if(!apiRes.success) {
      modal.isOpen = true;
      modal.isSuccess = false;
      modal.message = apiRes.message || "Imeshindwa kuongeza tarifa";
      return
    }
  })

  const fetchData = $(async () => {
    const newApi = new CrudService<{id?: string; data: { id?: string; name: string; count: number }[]}>("asked");

    const apiRes = await newApi.get();
    
    // fire a toast
    if(!apiRes.success) {
      modal.isOpen = true;
      modal.isSuccess = false;
      modal.message = apiRes.message || "Imeshindwa kuongeza tarifa";
      return
    }

    fetched.value = apiRes.data[0].data

    console.log("Feched: ", fetched.value)
    
  })


  const addProduct = $(async () => {
    if (!input.value.trim()) return;
    products.value = [
      ...products.value,
      { id: Date.now(), name: input.value.trim(), times: 1 },
    ];
    name.name = input.value.trim();
    input.value = ""; // clear it
    await sendData();
  });

  const increment = $((id: number) => {
    products.value = products.value.map((p) =>
      p.id === id ? { ...p, times: p.times + 1 } : p
    );
  });

  const remove = $((id: number) => {
    products.value = products.value.filter((p) => p.id !== id);
  });


    if (subscription.value === "Msingi" ) {
    return (
    <div class="max-w-md mx-auto p-6 mt-8 bg-white shadow-2xl rounded-2xl border border-gray-600">
        <h2 class="text-xl font-bold text-center text-gray-700 mb-4">
            📈 Bidhaa Inayouliziwa Sana
        </h2>
        <p class="text-center text-gray-500 mb-4">
        🚫 Huduma hii inapatikana kwa wateja wa Lite na kuendelea.
        </p>
    </div>
    );
    }

  return (
    <div class="max-w-md mx-auto p-6 mt-8 bg-white shadow-2xl rounded-2xl border border-gray-600">
      <h2 class="text-xl font-bold text-center text-gray-700 mb-4">
        📈 Bidhaa Inayouliziwa Sana
      </h2>

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

      {products.value.length === 0 ? (
        <p class="text-center text-gray-500">Hakuna bidhaa bado.</p>
      ) : (
        <ul class="space-y-3">
          {products.value.map((product) => (
            <li
              key={product.id}
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
            >
              <div>
                <p class="text-sm font-medium text-gray-700">
                  🛒 {product.name}
                </p>
                <p class="text-xs text-gray-500">
                  Imeulizwa: {product.times > 1 ? "mara" : "mara moja"} {product.times} 
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  onClick$={async () => {increment(product.id); await fetchData()}}
                  class="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600"
                >
                  ➕
                </button>
                <button
                  onClick$={() => remove(product.id)}
                  class="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

        {/* Pagination */}
        <div class="flex justify-center mt-6 space-x-4">
          <button
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            ⬅️ Nyuma
          </button>
          <span class="px-4 py-2">{`Ukurasa 1 ya 1`}</span>
          <button
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Mbele ➡️
          </button>
        </div>

        {/* Modal Popup */}
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
