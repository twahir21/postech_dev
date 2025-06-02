import { $, component$, useSignal } from "@builder.io/qwik";

export default component$(() => {
  const products = useSignal([
    { id: 1, name: "Sukari", times: 8 },
    { id: 2, name: "Mafuta", times: 5 },
    { id: 3, name: "Unga", times: 3 },
  ]);
  const input = useSignal("");

  const addProduct = $(() => {
    if (!input.value.trim()) return;
    products.value = [
      ...products.value,
      { id: Date.now(), name: input.value.trim(), times: 1 },
    ];
    input.value = "";
  });

  const increment = $((id: number) => {
    products.value = products.value.map((p) =>
      p.id === id ? { ...p, times: p.times + 1 } : p
    );
  });

  const remove = $((id: number) => {
    products.value = products.value.filter((p) => p.id !== id);
  });

  return (
    <div class="max-w-md mx-auto p-4 mt-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
      <h2 class="text-xl font-bold text-center text-indigo-700 mb-4">
        📈 Bidhaa Inayouliziwa Sana
      </h2>

      <div>
        <div class="flex items-center gap-2 mb-4">
        <input
          type="text"
          bind:value={input}
          placeholder="Andika jina la bidhaa"
          class="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick$={addProduct}
          class="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700"
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
                  Imeulizwa: {product.times} {product.times > 1 ? "mara" : "mara moja"}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  onClick$={() => increment(product.id)}
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
      </div>
    </div>
  );
});
