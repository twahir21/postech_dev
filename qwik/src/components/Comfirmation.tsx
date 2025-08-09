import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Toast } from "~/components/ui/Toast";
import { SendIcon } from "lucide-qwik";
import { CrudService } from "~/routes/api/base/oop";

export const Confirmation =  component$(() => {
  // State management
  const isLoading = useSignal(true);
  const responseData = useSignal<ResponseDataFallback | null>(null);
  const modal = useSignal({
    isOpen: false,
    isSuccess: false,
    message: ''
  });
  const modalPopup = useSignal(false);

  // Define types
  type ResponseDataFallback = {
    id?: string;
    products?: string;
    customers?: string;
    actionDetected?: {
      action: string;
      discount?: number | null;
      quantity: number;
      usedFor?: {
        usedForWhat: string | null;
        usedForAmount?: number | null;
      };
    };
    sentence: string;
  };

  // Fetch Data from the server
  useVisibleTask$(async () => {
    try {
      const api = new CrudService<ResponseDataFallback>('fallback');
      const response = await api.get();

      if (!response.success) {
        modal.value = {
          isOpen: true,
          isSuccess: false,
          message: response.message || "An error occurred while fetching data."
        };
        return;
      }

      if (response.data.length > 0) {
        responseData.value = response.data[0];
      }
    } catch (error) {
      modal.value = {
        isOpen: true,
        isSuccess: false,
        message: "Failed to fetch data from server."
      };
    } finally {
      isLoading.value = false;
    }
  });


  return (
    <>
      <button
        class="px-4 py-2 hover:text-gray-500 text-sm transition duration-300 ease-in-out cursor-pointer"
        onClick$={$(() => {
          modalPopup.value = true;
        })}
      >
        <SendIcon />
      </button>

      {modalPopup.value && (
        <div class="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4 border-5 border-double">
            <h2 class="text-lg font-semibold border-b pb-2">Taarifa ya Mchanganuo</h2>

            {responseData.value?.products && (
              <div>
                <label class="text-sm font-medium text-gray-700">Bidhaa</label>
                <input
                  type="text"
                  value={responseData.value.products}
                  readOnly
                  class="w-full p-2 mt-1 border rounded text-sm"
                />
              </div>
            )}

            {responseData.value?.customers && (
              <div>
                <label class="text-sm font-medium text-gray-700">Mteja</label>
                <input
                  type="text"
                  value={responseData.value.customers}
                  readOnly
                  class="w-full p-2 mt-1 border rounded text-sm"
                />
              </div>
            )}

            {responseData.value?.actionDetected && (
              <div class="space-y-2">
                <h3 class="font-semibold text-sm text-gray-800">Mchanganuo wa Kitendo</h3>

                <div>
                  <label class="text-sm">Kitendo</label>
                  <input
                    type="text"
                    value={responseData.value.actionDetected.action}
                    readOnly
                    class="w-full p-2 mt-1 border rounded text-sm"
                  />
                </div>

                {responseData.value.actionDetected.discount !== null && (
                  <div>
                    <label class="text-sm">Punguzo</label>
                    <input
                      type="number"
                      value={responseData.value.actionDetected.discount}
                      readOnly
                      class="w-full p-2 mt-1 border rounded text-sm"
                    />
                  </div>
                )}

                <div>
                  <label class="text-sm">Kiasi</label>
                  <input
                    type="number"
                    value={responseData.value.actionDetected.quantity}
                    readOnly
                    class="w-full p-2 mt-1 border rounded text-sm"
                  />
                </div>

                {responseData.value.actionDetected.usedFor && (
                  <>
                    <div>
                      <label class="text-sm">Matumizi</label>
                      <input
                        type="text"
                        value={responseData.value.actionDetected.usedFor.usedForWhat}
                        readOnly
                        class="w-full p-2 mt-1 border rounded text-sm"
                      />
                    </div>

                    {responseData.value.actionDetected.usedFor.usedForAmount !== null && (
                      <div>
                        <label class="text-sm">Kiasi cha matumizi</label>
                        <input
                          type="number"
                          value={responseData.value.actionDetected.usedFor.usedForAmount}
                          readOnly
                          class="w-full p-2 mt-1 border rounded text-sm"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div>
              <label class="text-sm font-medium text-gray-700 underline">Sentensi ya mwanzo</label>
              <p class="mt-1 text-gray-800 text-sm">
                {responseData.value?.sentence || "—"}
              </p>
            </div>

            <div class="flex justify-between pt-4 border-t">
              <button
                class="px-4 py-2"
                onClick$={$(() => modalPopup.value = false)}
                title="Funga"
              >
                ❌
              </button>
              <button
                class="px-4 py-2"
                title="Tuma"
                onClick$={$(() => {
                  // Add submit logic here
                  console.log("Tuma clicked");
                })}
              >
                <SendIcon />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toast notification */}
      {modal.value.isOpen && (
        <Toast
          isOpen={modal.value.isOpen}
          type={modal.value.isSuccess}
          message={modal.value.message}
          onClose$={$(() => {
            modal.value.isOpen = false;
          })}
        />
      )}
    </>
  );
});