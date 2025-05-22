import { component$, useSignal, useTask$, $, useContext, useStore } from '@builder.io/qwik';
import { RefetchContext } from './context/refreshContext';
import { CrudService } from '~/routes/api/base/oop';
import type { Supplier } from '~/routes/api/base/typeSafe';
import { Toast } from './ui/Toast';


export const SuppCrudComponent =  component$(() => {
  const supplier = useSignal<Supplier[]>([]);
  const total = useSignal(0);
  const search = useSignal('');
  const currentPage = useSignal(1);
  const perPage = 10;
  const isLoading = useSignal(false);
  const selectedSupplier = useSignal<Supplier | null>(null);
  const isEditing = useSignal(false);
  const isDeleting = useSignal(false);

  const modal = useStore({
    isSuccess: false as boolean,
    isOpen: false as boolean,
    message: '' as string
  });


  const fetchSuppliers = $(async () => {
    isLoading.value = true;
    const fetchSupplierApi = new CrudService<Supplier>(`suppliers?search=${encodeURIComponent(search.value)}&page=${currentPage.value}&limit=${perPage}`);
    const result = await fetchSupplierApi.get();

    if (!result.success) {
    // reset loading
    isLoading.value = false;
    return;
    }
    
    supplier.value = result.data;
    // reset loading
    isLoading.value = false;
  });

  const { supplierRefetch } = useContext(RefetchContext);

  useTask$(({ track }) => {
    track(() => search.value);
    track(() => currentPage.value);
    track(() => supplierRefetch.value);
    fetchSuppliers();
    supplierRefetch.value = false;
  });

  const totalPages = () => Math.ceil(total.value / perPage);

  const editSupplier = $((supplier: Supplier) => {
    selectedSupplier.value = { ...supplier }; // Prepopulate the form with supplier data
    isEditing.value = true;
  });
  
  const deleteSupplier = $(async (supplierId: string) => {
    const deleteSupplierApi = new CrudService<Supplier>("suppliers");

    const result = await deleteSupplierApi.delete(supplierId);
    if (!result.success) {
      // initialize the popup
      modal.isSuccess = false;
      modal.isOpen = true;
      modal.message = result.message || "Tatizo la kimtandao, jaribu tena"
      return;
    }

    modal.isOpen = true;
    modal.isSuccess = true;
    modal.message = result.message || "Umefanikiwa"
    // If deletion is successful, remove the supplier from the list
    supplier.value = supplier.value.filter(supplier => supplier.id !== supplierId);

    // reset delete flag
    isDeleting.value = false;

  });
  

  return (
    <div class="p-4 max-w-5xl mx-auto">

      <h1 class="text-xl font-bold mb-4 text-center"> Wasambazaji </h1>

      <input
        class="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="🔍 Tafuta kwa jina la msambazaji ..."
        bind:value={search}
      />

      {/* Desktop Table */}
     <div class="hidden sm:block border border-gray-300 rounded overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 font-semibold text-gray-600">
            <tr>
              <th class="p-3 border-b border-gray-200">Jina:</th>
              <th class="p-3 border-b border-gray-200">Mawasiliano:</th>
              <th class="p-3 border-b border-gray-200">Kitendo:</th>
            </tr>
          </thead>
          <tbody>
            {isLoading.value ? (
              <tr>
                <td colSpan={6} class="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : supplier.value.length === 0 ? (
              <tr>
                <td colSpan={7} class="p-4 text-center text-gray-500">
                Hakuna msambazaji yoyote, msajili kwanza ....
                </td>
              </tr>
              )
             : (
              supplier.value.map((supplier) => (
                <tr key={supplier.id} class="border-b border-gray-200">
                  <td class="p-3">{supplier.company}</td>
                  <td class="p-3"> {supplier.contact} </td>
                  <div class="p-3 space-x-2">
                    <button class="text-blue-600 hover:underline" onClick$={() => editSupplier(supplier)}>
                        Edit
                    </button>
                    <button
                        class="text-red-600 hover:underline"
                        onClick$={() => {
                        selectedSupplier.value = supplier;
                        isDeleting.value = true;
                        }}
                    >
                        Futa
                    </button>
                    </div>

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
        ) : supplier.value.length === 0 ? (
          <div class="text-center text-gray-500 p-4">Hakuna msambazaji yeyote, msajili kwanza ...</div>
        ) : (
          supplier.value.map((supplier) => (
            <div key={supplier.id} class="border rounded-lg p-3 bg-white shadow-sm">
              <div class="font-semibold">{supplier.company}</div>
              <div class="text-sm">{supplier.contact}</div>
              <div class="mt-2 space-x-4">
                <button class="text-blue-600 hover:underline" onClick$={() => editSupplier(supplier)}>
                  Edit
                </button>
                <button
                  class="text-red-600 hover:underline"
                  onClick$={() => {
                    selectedSupplier.value = supplier;
                    isDeleting.value = true;
                  }}
                >
                  Futa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      <div class="mt-6 flex justify-between items-center">
        <button
        onClick$={() => {
          if (currentPage.value > 1) currentPage.value--;
        }}          
        disabled={currentPage.value === 1}
        class="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Nyuma
        </button>
        <span class="text-sm">
          Kurasa ya {currentPage.value} kati ya {totalPages()}
        </span>
        <button
          onClick$={() => currentPage.value++}
          disabled={currentPage.value >= totalPages()}
          class="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Mbele
        </button>
      </div>

      {isEditing.value && selectedSupplier.value && (
  <div class="fixed inset-0 flex items-center justify-center z-10 bg-gray-600 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold">Edit Muuzaji</h2>

      <div class="mt-4">
        <label class="block text-sm">Jina:</label>
        <input
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedSupplier.value.company}
          onInput$={(e) => (selectedSupplier.value!.company = (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="mt-4">
      <label class="block text-sm">Mawasiliano:</label>
      <input
          type="number"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedSupplier.value.contact}
          onInput$={(e) => {
            const value = (e.target as HTMLInputElement).value;
            selectedSupplier.value!.contact = value;
          }}

        />
      </div>

      <div class="mt-4 flex gap-2">
        <button
          class="px-4 py-2 bg-gray-700 text-white rounded"
          onClick$={async () => {
            const editSupplierApi = new CrudService<Supplier>("suppliers");
            const selectedSuppId = selectedSupplier.value?.id
            if (!selectedSuppId) return;
            const result = await editSupplierApi.updateById(selectedSupplier.value!, selectedSuppId);

            if (!result.success) {
              modal.isOpen = true,
              modal.isSuccess = false,
              modal.message = result.message || "Hitilafu imetokea, jaribu baadae";
              return;
            }
            // Update Supplier in the local list
            const index = supplier.value.findIndex(p => p.id === result.data.id);
            if (index > -1) {
              supplier.value[index] = result.data;
            }
            isEditing.value = false;
          }}
        >
          Hifadhi
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded"
          onClick$={() => {
            isEditing.value = false;
            selectedSupplier.value = null;
          }}
        >
          Ghairi
        </button>
      </div>
    </div>
  </div>
)}

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


{isDeleting.value && (
  <div class="fixed inset-0 flex items-center justify-center z-10 bg-gray-600 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold">Hakiki Ufutaji</h2>
      <p class="mt-2 text-sm">Je, una uhakika unataka kumfuta huyu msambazaji?</p>
      <div class="mt-4 flex gap-2">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded"
          onClick$={() => deleteSupplier(selectedSupplier.value!.id)}
        >
          Futa
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded"
          onClick$={() => {
            isDeleting.value = false;
            selectedSupplier.value = null;
          }}
        >
          Ghairi
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
});
