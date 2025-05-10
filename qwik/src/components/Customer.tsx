import { component$, useStore, $, useComputed$, useContext } from "@builder.io/qwik";
import { CustomersCrudComponent } from "./CustComp";
import { fetchWithLang } from "~/routes/function/fetchLang";
import { Translate } from "./Language";
import { RefetchContext } from "./context/refreshContext";

export const CustomerComponent =  component$((props:{lang: string}) => {
  const customer = useStore({
    name: "",
    contact: "",
  });

  const modal = useStore({
    isOpen: false,
    message: "",
    isSuccess: false,
  });

  const handleInputChange = $((event: Event, field: keyof typeof customer) => {
    const target = event.target as HTMLInputElement;
    customer[field] = target.value;
  });

  const isFormInvalid = useComputed$(() => {
    return (
      customer.name.trim().length < 3 || customer.contact.trim().length < 3
    );
  });

  const { customerRefetch } = useContext(RefetchContext);

  const handleSubmit = $(async () => {
    const name = customer.name.trim().toLowerCase();
    const contact = customer.contact.trim().toLowerCase();

    const response = await fetchWithLang("http://localhost:3000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, contact }),
    });
    customerRefetch.value = true;

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Imeshindwa kusajili mteja.");
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Imeshindwa kusajili mteja.");
    }

    customer.name = "";
    customer.contact = "";
     // Instead of replacing modal, update its properties individually
    modal.isOpen = true;
    modal.message = data.message || "Customer created successfully";
    modal.isSuccess = true;

  });

  return (
<>
      <h1 class="text-xl font-bold text-gray-700 mt-6 mb-2 border-b-2 pb-2">
        <Translate lang={props.lang} keys={['step_1']} /> 
      </h1>
    <div class="flex justify-center pt-4">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md border-2 border-gray-600">
        <h2 class="text-lg font-semibold mb-4 text-center"><Translate lang={props.lang} keys={['customerForm']} /> </h2>
        <form preventdefault:submit onSubmit$={handleSubmit}>
          <div class="mb-4">
            <label class="block text-gray-800 mb-1"><Translate lang={props.lang} keys={['customerName']} /></label>
            <input
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. Salim Ali"
              value={customer.name}
              onInput$={(e) => handleInputChange(e, "name")}
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-800 mb-1"><Translate lang={props.lang} keys={['contact']} /></label>
            <input
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. 0723 456 789"
              value={customer.contact}
              onInput$={(e) => handleInputChange(e, "contact")}
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gray-700 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isFormInvalid.value}
          >
            <Translate lang={props.lang} keys={['submit']} />
          </button>
        </form>
      </div>
    </div>

    <CustomersCrudComponent lang={props.lang}/>

    {/* Modal Popup */}
    {modal.isOpen && (
    <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-neutral-500 z-50">
      <div class="bg-white p-6 rounded shadow-lg text-center">
        <p class={modal.isSuccess ? 'text-green-600' : 'text-red-600'}>{modal.message}</p>
        <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick$={() => (modal.isOpen = false)}>
          Ok
        </button>
      </div>
    </div>
  )}
</>
  );
});
