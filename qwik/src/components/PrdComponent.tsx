import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { fetchWithLang } from '~/routes/function/fetchLang';

interface Product {
  id: string;
  name: string;
  categoryId: string;
  priceSold: number;
  priceBought: number;
  stock: number;
  shopId: string;
  supplierId: string;
  minStock: number;
  status: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  isQRCode: boolean;
}

export const CrudPrdComponent =  component$(() => {
  const products = useSignal<Product[]>([]);
  const total = useSignal(0);
  const search = useSignal('');
  const currentPage = useSignal(1);
  const perPage = 10;
  const isLoading = useSignal(false);
  const selectedProduct = useSignal<Product | null>(null);
  const isEditing = useSignal(false);
  const isDeleting = useSignal(false);


  const fetchProducts = $(async () => {
    isLoading.value = true;
    try {
      const res = await fetchWithLang(
        `http://localhost:3000/products?search=${encodeURIComponent(search.value)}&page=${currentPage.value}&limit=${perPage}`,{
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'sw', // Adjust as necessary
          },
        }
      );

      if (!res.ok) {
        const text = await res.text(); // fallback for non-JSON errors
        throw new Error(`Failed to fetch products: ${text}`);
      }


      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Failed to fetch products');
      }
      products.value = json.data;

      total.value = json.total;
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      isLoading.value = false;
    }
  });

  useTask$(({ track }) => {
    track(() => search.value);
    track(() => currentPage.value);
    fetchProducts();
  });

  const totalPages = () => Math.ceil(total.value / perPage);

  const editProduct = $((product: Product) => {
    selectedProduct.value = { ...product }; // Prepopulate the form with product data
    isEditing.value = true;
  });
  
  const deleteProduct = $(async (productId: string) => {
    try {
      const res = await fetchWithLang(`http://localhost:3000/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        const text = await res.text(); // Fallback for non-JSON errors
        throw new Error(`Failed to delete product: ${text}`);
      }
  
      // If deletion is successful, remove the product from the list
      products.value = products.value.filter(product => product.id !== productId);
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      isDeleting.value = false;
    }
  });
  

  return (
    <div class="p-4 max-w-5xl mx-auto">
      <h1 class="text-xl font-bold mb-4 text-center">Bidhaa:</h1>

      <input
        class="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="🔍 Tafuta kwa jina la bidhaa ..."
        bind:value={search}
      />

      {/* Desktop Table */}
     <div class="hidden sm:block border border-gray-300 rounded overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 font-semibold text-gray-600">
            <tr>
              <th class="p-3 border-b border-gray-200">Jina la Bidhaa</th>
              <th class="p-3 border-b border-gray-200">Bei ya kuuza</th>
              <th class="p-3 border-b border-gray-200">Bei ya kununua</th>
              <th class="p-3 border-b border-gray-200">Hisa</th>
              <th class="p-3 border-b border-gray-200">Kiwango</th>
              <th class="p-3 border-b border-gray-200">Hali</th>
              <th class="p-3 border-b border-gray-200">Kitendo</th>
            </tr>
          </thead>
          <tbody>
            {isLoading.value ? (
              <tr>
                <td colSpan={6} class="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : products.value.length === 0 ? (
              <tr>
                <td colSpan={7} class="p-4 text-center text-gray-500">
                Hakuna bidhaa yoyote, isajili kwanza ....
                </td>
              </tr>
              )
             : (
              products.value.map((product) => (
                <tr key={product.id} class="border-b border-gray-200">
                  <td class="p-3">{product.name}</td>
                  <td class="p-3"> {product.priceSold} /=</td>
                  <td class="p-3"> {product.priceBought} /=</td>
                  <td class="p-3">{product.stock}</td>
                  <td class="p-3">{product.unit}</td>
                  <td class="p-3">
                    <span
                      class={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'available'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td class="p-3 space-x-2">
                    <button class="text-blue-600 hover:underline" onClick$={() => editProduct(product)}>
                        Edit
                    </button>
                    <button
                        class="text-red-600 hover:underline"
                        onClick$={() => {
                        selectedProduct.value = product;
                        isDeleting.value = true;
                        }}
                    >
                        Delete
                    </button>
                    </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div class="sm:hidden space-y-4">
      {isLoading.value ? (
          <div class="text-center text-gray-500 p-4">Loading...</div>
        ) : products.value.length === 0 ? (
          <div class="text-center text-gray-500 p-4">Hakuna bidhaa yoyote, isajili kwanza ....</div>
        ) : (
          products.value.map((product) => (
            <div key={product.id} class="border rounded-lg p-3 bg-white shadow-sm">
              <div class="font-semibold">{product.name}</div>
              <div class="text-sm">Price Sold: Tsh {product.priceSold}</div>
              <div class="text-sm">Price Bought: Tsh {product.priceBought}</div>
              <div class="text-sm">Stock: {product.stock}</div>
              <div class="text-sm">Unit: {product.unit}</div>
              <div class="text-sm mt-1">
                <span
                  class={`inline-block px-2 py-1 text-xs rounded-full ${
                    product.status === 'available'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div class="mt-2 space-x-4">
                <button class="text-blue-600 hover:underline" onClick$={() => editProduct(product)}>
                  Edit
                </button>
                <button
                  class="text-red-600 hover:underline"
                  onClick$={() => {
                    selectedProduct.value = product;
                    isDeleting.value = true;
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div class="mt-6 flex justify-between items-center">
        <button
          onClick$={() => currentPage.value--}
          disabled={currentPage.value === 1}
          class="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm">
          Page {currentPage.value} of {totalPages()}
        </span>
        <button
          onClick$={() => currentPage.value++}
          disabled={currentPage.value >= totalPages()}
          class="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isEditing.value && selectedProduct.value && (
  <div class="fixed inset-0 flex items-center justify-center z-10 bg-gray-600 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold">Edit Product</h2>

      <div class="mt-4">
        <label class="block text-sm">Name</label>
        <input
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedProduct.value.name}
          onInput$={(e) => (selectedProduct.value!.name = (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="mt-4">
        <label class="block text-sm">PriceSold</label>
        <input
          type="number"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedProduct.value.priceSold}
          onInput$={(e) => {
            const value = (e.target as HTMLInputElement).value;
            selectedProduct.value!.priceSold = parseFloat(value);
          }}

        />
      </div>

      <div class="mt-4">
        <label class="block text-sm">PriceBought</label>
        <input
            type="number"
            class="w-full p-2 border border-gray-300 rounded"
            value={selectedProduct.value.priceBought}
            onInput$={(e) => {
              const value = (e.target as HTMLInputElement).value;
              selectedProduct.value!.priceBought = parseFloat(value);
            }
          }
            
        />

      </div>

      <div class="mt-4">
        <label class="block text-sm">Hisa:</label>
        <input
          type="number"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedProduct.value.stock}
          onInput$={(e) => {
            const value = (e.target as HTMLInputElement).value;
            selectedProduct.value!.stock = parseInt(value, 10); // or parseFloat(value) if it's a decimal number
          }}       
        />
      </div>
      <div class="mt-4">
        <label class="block text-sm">Kiwango:</label>
        <input
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedProduct.value.unit}
          onInput$={(e) => (selectedProduct.value!.unit = (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="mt-4 flex gap-2">
        <button
          class="px-4 py-2 bg-gray-700 text-white rounded"
          onClick$={async () => {
            try {
              const res = await fetchWithLang(`http://localhost:3000/products/${selectedProduct.value!.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept-Language': 'sw', // Adjust as necessary
                },
                body: JSON.stringify(selectedProduct.value),
                credentials: 'include',
              });
              if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to update product: ${text}`);
              }
              const updatedProduct = await res.json();
              // Update product in the local list
              const index = products.value.findIndex(p => p.id === updatedProduct.id);
              if (index > -1) {
                products.value[index] = updatedProduct;
              }
              isEditing.value = false;
            } catch (err) {
              console.error('Failed to update product:', err);
            }
          }}
        >
          Save
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded"
          onClick$={() => {
            isEditing.value = false;
            selectedProduct.value = null;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


{isDeleting.value && (
  <div class="fixed inset-0 flex items-center justify-center z-10 bg-gray-600 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold">Confirm Deletion</h2>
      <p class="mt-2 text-sm">Are you sure you want to delete this product?</p>
      <div class="mt-4 flex gap-2">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded"
          onClick$={() => deleteProduct(selectedProduct.value!.id)}
        >
          Delete
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded"
          onClick$={() => {
            isDeleting.value = false;
            selectedProduct.value = null;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
});
