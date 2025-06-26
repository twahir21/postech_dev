import { component$, useStore, $, useComputed$, useContext } from "@builder.io/qwik";
import { CustomersCrudComponent } from "./CustComp";
import { RefetchContext } from "./context/refreshContext";
import { CrudService } from "~/routes/api/base/oop";
import { Toast } from "./ui/Toast";
import { subscriptionData } from "./context/store/netSales";

export const CustomerComponent =  component$(() => {
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
  const { subscription } = useContext(subscriptionData)

  const handleSubmit = $(async () => {
    const name = customer.name.trim().toLowerCase();
    const contact = customer.contact.trim().toLowerCase();

    const newPost = new CrudService<{id?: string; name: string; contact: string}>("customers");
    const postData = await newPost.create({ name, contact });
    customerRefetch.value = true;

    if(!postData.success) {
      modal.isOpen = true;
      modal.isSuccess = false;
      modal.message = postData.message || "Imeshindwa kutunza taarifa za mteja"
      return; 
    }

    customer.name = "";
    customer.contact = "";
     // Instead of replacing modal, update its properties individually
    modal.isOpen = true;
    modal.message = postData.message || "Mteja amehifadhiwa kwa mafanikio";
    modal.isSuccess = true;

  });

  if (subscription.value === 'Msingi'){
  return (
    <>
      <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
        <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
        <h3 class="text-sm font-medium">Usajili wa wateja</h3>
        <p class="text-lg font-semibold mt-2">Lipia Lite au zaidi</p>
      </div>
    </>
  )
}

  return (
<>
      <h1 class="text-xl font-bold text-gray-700 mt-6 mb-2 border-b-2 pb-2">
        Hatua ya 1:
      </h1>
    <div class="flex justify-center pt-4">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md border-2 border-gray-600">
        <h2 class="text-lg font-semibold mb-4 text-center">Fomu ya Mteja: </h2>
        <form preventdefault:submit onSubmit$={handleSubmit}>
          <div class="mb-4">
            <label class="block text-gray-800 mb-1">Jina la Mteja: </label>
            <input
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. Salim Ali"
              value={customer.name}
              onInput$={(e) => handleInputChange(e, "name")}
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-800 mb-1">Mawasiliano: </label>
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
            Tuma
          </button>
        </form>
      </div>
    </div>

    <CustomersCrudComponent />

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
</>
  );
});
