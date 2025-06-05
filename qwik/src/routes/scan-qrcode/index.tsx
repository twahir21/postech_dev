import {
  component$,
  useTask$,
  useStore,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { CrudService } from "../api/base/oop";
import { Toast } from "~/components/ui/Toast";
import { formatDateTime, formatMoney } from "../function/helpers";

export default component$(() => {
  const location = useLocation();

  // Define state
  const state = useStore({
    query: {} as Record<string, string>,
    rawParams: {} as Record<string, string>,
    isLoading: true,
    productId: "",
    // generatedAt: "",
    editableFields: {
      quantity: "1",
      saleType: "cash",
      discount: "0",
      description: "",
      typeDetected: "sales", // Default to 'sales'
    },
    supplierId: "",
    calculatedTotal: 0, // Calculated dynamically
    showCalculator: false,
    input: "",
    isSubmitting: false, // Track if submission is in progress
    modal: {
      isOpen: false,
      message: '',
      isSuccess: false,
    },
    customerId: "",
    customers: [] as { id: string; name: string }[],
  });

  useVisibleTask$(async() => {
    interface customers {id: string; name: string}
    const getCustomersApi = new CrudService<customers>("getCustomers");
    const customersData = await getCustomersApi.get();
    if(!customersData.success) return;

    state.customers = customersData.data
  })

  // Parse URL parameters and initialize state
  useTask$(() => {
    const urlParams = new URLSearchParams(location.url.search);
    const params: Record<string, string> = {};

    const uiParams: Record<string, string> = {};

    urlParams.forEach((value, key) => {
      // Assign directly to state for known keys
      if (key === "productId") {
        state.productId = value;
        return;
      }

      if (key === "supplierId") {
        state.supplierId = value;
        return;
      }

      // Skip keys we don't want to include in params
      if (["shopId", "userId"].includes(key)) return;

      // Map keys to human-readable labels with optional formatting
      const labelMap: Record<string, string> = {
        generatedAt: "Imetengenezwa",
        name: "Jina la bidhaa",
        priceBought: "Bei ya kununua"
      };

      const label = labelMap[key] || key;

      params[key] = value; // origional

      uiParams[label] =
        key === "generatedAt"
          ? formatDateTime(value) || "Hakuna"
          : key === "priceBought"
          ? `${formatMoney(Number(value))}/=`
          : value;
    });


    state.query = params;
    state.rawParams = uiParams;
    state.editableFields.quantity = params.quantity || "1";
    state.editableFields.saleType = params.saleType || "cash";
    state.editableFields.discount = params.discount || "0";
    state.editableFields.description = params.description || "";
    state.editableFields.typeDetected = params.typeDetected || "sales"; // Default to sales

    // Calculate initial total amount
    const priceSold = parseFloat(params.priceSold || "0");
    const quantity = parseFloat(state.editableFields.quantity); // Parse as float
    const discount = parseFloat(state.editableFields.discount);
    state.calculatedTotal = (quantity * priceSold) - discount;

    state.isLoading = false;
  });

  // Handle input changes
  const handleChange = $((e: Event, field: keyof typeof state.editableFields) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    state.editableFields[field] = target.value;

    // Recalculate total when quantity, priceSold, or discount changes
    if (field === "quantity" || field === "discount") {
      const priceSold = parseFloat(state.query.priceSold || "0");
      const quantity = parseFloat(state.editableFields.quantity);
      const discount = parseFloat(state.editableFields.discount);
      state.calculatedTotal = (quantity * priceSold) - discount;
    }
  });

// Handle form submission with a 4-second cooldown
const handleSubmit = $(async () => {
  if (state.isSubmitting) return;

  state.isSubmitting = true;

  const numericQuantity = parseFloat(state.editableFields.quantity);
  const numericDiscount = parseFloat(state.editableFields.discount);

  const validatedQuantity = isNaN(numericQuantity) ? 1 : numericQuantity;
  const validatedDiscount = isNaN(numericDiscount) ? 0 : numericDiscount;

  if (!state.productId) {
    state.modal = {
      isOpen: true,
      message: "Product ID inatakiwa!",
      isSuccess: false
    };
    state.isSubmitting = false;
    return;
  }

  if (!state.customerId && state.editableFields.saleType === "debt") {
    // If saleType is "debt" and no customer is selected, show an error
    state.modal = {
      isOpen: true,
      message: "Lazima uchague mteja au msajili kwanza",
      isSuccess: false
    };
    state.isSubmitting = false;
    return;
  }

  const requestData = {
    ...state.query,
    ...state.editableFields,
    quantity: validatedQuantity,
    discount: validatedDiscount,
    productId: state.productId,
    priceSold: Number(state.query.priceSold),
    priceBought: Number(state.query.priceBought),
    supplierId: state.supplierId,
    customerId: state.customerId,
    calculatedTotal: state.calculatedTotal,
  };


        interface sendData {
        id?: string;
        quantity: number;
        discount: number;
        productId: string;
        priceSold: number;
        priceBought: number;
        supplierId: string;
        customerId: string;
        calculatedTotal: number;
        saleType: string;
        description: string;
        typeDetected: string;
    }

  const sendDataApi = new CrudService<sendData>("get-data");
  const sendResult = await sendDataApi.create(requestData);
  state.isSubmitting = false;

  state.modal = {
    isOpen: true,
    message: sendResult.message || (sendResult.success ? "Umefanikiwa" : "Tatizo limejitokeza"),
    isSuccess: sendResult.success
  };
});


const handleButtonClick = $((btn: string) => {
  if (btn === "C") {
    state.input = "";
  } else if (btn === "=") {
    try {
      state.input = Function('"use strict"; return (' + state.input + ')')();
    } catch {
      state.input = "Error";
    }
  } else {
    state.input += btn;
  }
});

  
  return (
    <div class="p-4 max-w-2xl mx-auto text-sm sm:text-base">
      <h1 class="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        📦 Taarifa za bidhaa kutoka kwa QR Code 
      </h1>

      {state.isLoading ? (
        <p class="text-gray-600">Loading...</p>
      ) : Object.keys(state.rawParams).length === 0 ? (
        <p class="text-red-500">❌ Hakuna query parameters zilizopatikana!</p>
      ) : (
        <div class="bg-white rounded-xl shadow-lg p-4 border border-gray-200 space-y-4">
          {/* Display product details */}
          <div class="grid sm:grid-cols-2 gap-4">
            {Object.entries(state.rawParams).map(([key, value]) => {
              if (
                ["quantity", "saleType", "discount", "description", "priceSold", "typeDetected"].includes(
                  key
                )
              )
                return null;

              return (
                <div key={key}>
                  <p class="text-gray-500 font-medium">{key}</p>
                  <p class="text-gray-900 font-semibold">
                    {decodeURIComponent(value)}
                  </p>
                </div>
              );
            })}

{/* Calculator Button & Modal */}
<div class="text-left mb-4">
  <button
    class="p-2 text-white rounded-full"
    onClick$={() => (state.showCalculator = true)}
  >
    📱
  </button>

  {state.showCalculator && (
    <div class="absolute inset-0 flex justify-evenly items-center bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80 relative border-2 border-b-blue-900">
        <button
          class="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          onClick$={() => (state.showCalculator = false)}
        >
          ✖
        </button>

        <input
          type="text"
          class="w-full p-2 text-right text-xl border rounded mb-4"
          value={state.input}
          disabled
        />

        <div class="grid grid-cols-4 gap-2">
          {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "=", "+"].map(
            (btn) => (
              <button
                key={btn}
                class={`p-4 rounded text-xl ${
                  btn === "C"
                    ? "bg-red-500 text-white"
                    : btn === "="
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200"
                }`}
                onClick$={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )}
</div>

          </div>

          <div class="relative inline-block group cursor-help">
            <p class="text-green-600 underline">
              ℹ️ Bonyeza hapa (Jinsi ya kuweka hisa)
            </p>
            <div class="absolute z-10 hidden group-hover:block bg-white border border-gray-300 text-sm text-gray-700 p-2 rounded-md shadow-md w-64 mt-2">
              <p>🟢 <strong>Robo</strong> = 0.25</p>
              <p>🟢 <strong>Nusu</strong> = 0.5</p>
              <p>🟢 <strong>Robotatu</strong> = 0.75</p>
              <p>🟢 <strong>Kilo na nusu</strong> = 1.5</p>
            </div>
          </div>


          {/* Editable fields */}
          <div class="border-t pt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-600 font-medium mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={state.editableFields.quantity}
                onInput$={(e) => handleChange(e, "quantity")}
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-lg font-bold text-green-600"
              />
            </div>

            <div>
              <label class="block text-gray-600 font-medium mb-1">
                Aina iliyoonekana
              </label>
              <select
                value={state.editableFields.typeDetected}
                onChange$={(e) => handleChange(e, "typeDetected")}
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="sales">Mauzo</option>
                <option value="purchases">Manunuzi</option>
                <option value="expenses">Matumizi</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-600 font-medium mb-1">
                Aina ya Mauzo
              </label>
              <select
                value={state.editableFields.saleType}
                onChange$={(e) => handleChange(e, "saleType")}
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="cash">Cash</option>
                {state.editableFields.typeDetected === "sales" && (<option value="debt">Deni</option>)}
              </select>
            </div>

            <div>
              <label class="block text-gray-600 font-medium mb-1">
                Punguzo (%)
              </label>
              <input
                type="number"
                value={state.editableFields.discount}
                onInput$={(e) => handleChange(e, "discount")}
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            {/* Conditionally show description for "Expenses" */}
            {state.editableFields.typeDetected === "expenses" && (
              <div class="sm:col-span-2">
                <label class="block text-gray-600 font-medium mb-1">
                  Maelezo:
                </label>
                <textarea
                  value={state.editableFields.description}
                  onInput$={(e) => handleChange(e, "description")}
                  rows={3}
                  placeholder="e.g. Nauli, chakula, bando, n.k. ..."
                  class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                ></textarea>
              </div>
            )}

            {/* Fetch Customers */}
            {state.editableFields.saleType === "debt" && state.editableFields.typeDetected === "sales" && (
              <div class="sm:col-span-2">
                <p class="text-gray-600 font-medium mb-2">Chagua Mteja:</p>
                {state.customers.length > 0 ? (
                  <select
                    value={state.customerId || ""} // Bind the selected value to state.customerId
                    onChange$={(e) => {
                      const target = e.target as HTMLSelectElement;
                      state.customerId = target.value; // Update state.customerId with the selected value
                    }}
                    class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">-- Chagua mteja --</option>
                    {state.customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} 
                      </option>
                    ))}
                  </select>
                ) : (
                  <p class="text-gray-500 italic">Hakuna mteja aliyepatikana.</p>
                )}
              </div>
            )}
          </div>

          {/* Display calculated total amount */}
          <div class="pt-4 text-center">
          <p class="text-2xl sm:text-3xl font-bold text-green-600">
            💰 Total: {new Intl.NumberFormat('en-US').format(state.calculatedTotal)}/=
          </p>
            <p class="text-sm text-gray-500">
              ({state.editableFields.quantity} × {state.query.priceSold} - {state.editableFields.discount})
            </p>
          </div>

          {/* Submit button */}

        <button
          onClick$={handleSubmit}
          disabled={state.isSubmitting} // Disable button during submission
          class="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-400 transition duration-300 ease-in-out"
        >
          {state.isSubmitting ? `Tafadhali subiri ` : "Tuma muamala"}
        </button>
        </div>
      )}

      {/* Modal Popup */}
      {state.modal.isOpen && (
        <Toast
          isOpen={state.modal.isOpen}
          type={state.modal.isSuccess}
          message={state.modal.message}
          onClose$={$(() => {
            state.modal.isOpen = false;
        })}
        />
      )}

    </div>
  );
});