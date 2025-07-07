import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { RefetchContext } from "./context/refreshContext";
import { CrudService } from "~/routes/api/base/oop";
import type { supplierData } from "~/routes/api/base/typeSafe";
import { Toast } from "./ui/Toast";

export const SupplierComponent = component$(() => {
  const formState = useStore({
    name: "",
    contact: "",
    errors: {
      name: "",
      contact: ""
    } as {[key: string]: string},
    valid: {
      name: false,
      contact: false
    } as {[key: string]: boolean},
    modal: {
      isOpen: false,
      message: "" as string,
      isSuccess: false,
    },
    isLoading: false as boolean
  });
  const { supplierRefetch }  = useContext(RefetchContext);



  // Validation Function

  const validateField = $((field: string, value: string) => {
    let error = "";
    let isValid = false;

    if (field === "name" || field === "contact") {
      isValid = value.trim().length >= 3;
      error = isValid ? "" : "Lazima iwe na herufi 3 au zaidi";
    }

    formState.errors[field] = error;
    formState.valid[field] = isValid;
  });

  // Handle Input Change
  type FormField = keyof Pick<typeof formState, "name" | "contact">;

  const handleInputChange = $((field: FormField, value: string) => {
    formState[field] = value.trim(); // Now type-safe
    validateField(field, value);
  });

  const handleSubmit = $(async (event: Event) => {
    event.preventDefault();

    if (!formState.valid.name || !formState.valid.contact) {
      formState.modal = { isOpen: true, message: "Tafadhali jaza taarifa zote sahihi", isSuccess: false };
      return;
    }

      if (formState.isLoading) return; // prevent multiple reqs

      formState.isLoading = true; // Start loading ...

      // Send supplier data
      const supplierDataApi = new CrudService<supplierData>("suppliers");

      supplierRefetch.value = true;
      const result = await supplierDataApi.create({ company: formState.name.trim().toLowerCase(), contact: formState.contact.trim() });

      formState.modal = {
        isOpen: true,
        message: result.message || "Tayari!",
        isSuccess: result.success,
      };
      
      if (result.success) {
        formState.name = "";
        formState.contact = "";
        formState.errors = { name: "", contact: "" };
        formState.valid = { name: false, contact: false };
      }

      formState.isLoading = false; // end loading ...
    
  });

  return (
    <>
        <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-5 border-2 border-gray-600">
      <h2 class="text-xl font-bold mb-4">
        Ongeza Msambazaji:
        </h2>
      <form onSubmit$={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Jina la Msambazaji</label>
          <input
            type="text"
            class="w-full mt-1 p-2 border rounded-lg"
            placeholder="e.g. Bonite, Pepsi, Mo"
            value={formState.name}
            onInput$={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
          />
          {formState.errors.name && <p class="text-red-500 text-sm">{formState.errors.name}</p>}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Mawasiliano</label>
          <input
            type="text"
            class="w-full mt-1 p-2 border rounded-lg"
            placeholder="e.g. 0723 456 789"
            value={formState.contact}
            onInput$={(e) => handleInputChange('contact', (e.target as HTMLInputElement).value)}
          />
          {formState.errors.contact && <p class="text-red-500 text-sm">{formState.errors.contact}</p>}
        </div>

        <button
          type="button"
          onClick$={(e) => handleSubmit(e)}
          disabled={!formState.valid.name || !formState.valid.contact || formState.isLoading}
          class="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full hover:bg-gray-500"
        >
          { 
            formState.isLoading ?
            // Custom Loader
            <div class="inline-flex">
            <div class="loaderCustom"></div>
            </div>
           : 'Tuma'
          }
        </button>
      </form>

      {/* Modal Popup */}
      {formState.modal.isOpen && (
        <Toast
          isOpen={formState.modal.isOpen}
          type={formState.modal.isSuccess}
          message={formState.modal.message}
          onClose$={$(() => {
            formState.modal.isOpen = false;
        })}
        />
      )}
    </div>
    </>
  );
});