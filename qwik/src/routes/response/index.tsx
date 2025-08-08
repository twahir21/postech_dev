import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { CrudService } from '../api/base/oop';

interface VerifyResponse {
    id?: string;
  products: string;
  customers?: string;
  actionDetected?: {
    action: string;
    discount: number | null;
    quantity: number;
    usedFor: {
      usedForWhat: string;
      usedForAmount: number | null;
    } | null;
  };
  sentence: string;
}

export default component$(() => {
  // Simulate response data (replace with your actual data fetching)
  const responseData = useSignal<VerifyResponse | null>(null);

  // Mock function to simulate API call
  const fetchData = $(async () => {
    // Replace this with your actual API call
    const mockResponse: VerifyResponse = {
      products: "Sample Product",
      customers: "John Doe",
      actionDetected: {
        action: "kutumia",
        discount: 10,
        quantity: 2,
        usedFor: {
          usedForWhat: "msiba wa kaka",
          usedForAmount: 5000
        }
      },
      sentence: "Sample sentence"
    };
    responseData.value = mockResponse;
  });

  useVisibleTask$(async () => {
    const api = new CrudService<VerifyResponse>("fallback");
    const result = await api.get();
    console.log("Fetched data:", result);
    if (!result.success) return;
    console.log(result.data)
    responseData.value = result.data;
  })

  return (
    <div class="p-4 max-w-md mx-auto">
      <button 
        onClick$={fetchData}
        class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Load Data
      </button>

      {responseData.value ? (
        <div class="space-y-4">
          {/* Products Section */}
          {responseData.value.products && (
            <div class="border p-4 rounded">
              <h3 class="font-bold mb-2">Products</h3>
              <input
                type="text"
                value={responseData.value.products}
                class="w-full p-2 border rounded"
              />
            </div>
          )}

          {/* Customers Section */}
          {responseData.value.customers && (
            <div class="border p-4 rounded">
              <h3 class="font-bold mb-2">Customers</h3>
              <input
                type="text"
                value={responseData.value.customers}
                class="w-full p-2 border rounded"
              />
            </div>
          )}

          {/* Action Detected Section */}
          {responseData.value.actionDetected && (
            <div class="border p-4 rounded space-y-3">
              <h3 class="font-bold">Action Details</h3>
              
              <div>
                <label class="block text-sm">Action</label>
                <input
                  type="text"
                  value={responseData.value.actionDetected.action}
                  class="w-full p-2 border rounded"
                />
              </div>

              {responseData.value.actionDetected.discount !== null && (
                <div>
                  <label class="block text-sm">Discount</label>
                  <input
                    type="number"
                    value={responseData.value.actionDetected.discount}
                    class="w-full p-2 border rounded"
                  />
                </div>
              )}

              <div>
                <label class="block text-sm">Quantity</label>
                <input
                  type="number"
                  value={responseData.value.actionDetected.quantity}
                  class="w-full p-2 border rounded"
                />
              </div>

              {responseData.value.actionDetected.usedFor && (
                <div class="space-y-2">
                  <div>
                    <label class="block text-sm">Used For</label>
                    <input
                      type="text"
                      value={responseData.value.actionDetected.usedFor.usedForWhat}
                      class="w-full p-2 border rounded"
                    />
                  </div>
                  {responseData.value.actionDetected.usedFor.usedForAmount !== null && (
                    <div>
                      <label class="block text-sm">Amount</label>
                      <input
                        type="number"
                        value={responseData.value.actionDetected.usedFor.usedForAmount}
                        class="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sentence */}
          <div class="border p-4 rounded">
            <h3 class="font-bold mb-2">Original Sentence</h3>
            <p>{responseData.value.sentence}</p>
          </div>
        </div>
      ) : (
        <p class="text-gray-500">No data loaded yet. Click the button above.</p>
      )}
    </div>
  );
});