import { component$, useSignal, useTask$, $, useContext, useStore } from '@builder.io/qwik';
import { RefetchContext } from './context/refreshContext';
import { CrudService } from '~/routes/api/base/oop';
import { Toast } from './ui/Toast';

interface Customer {
  id: string;
  name: string;
  contact: string
  createdAt: string;
}

export const CustomersCrudComponent =  component$(() => {
  const customer = useSignal<Customer[]>([]);
  const total = useSignal(0);
  const search = useSignal('');
  const currentPage = useSignal(1);
  const perPage = 5;
  const isLoading = useSignal(false);
  const selectedCustomer = useSignal<Customer | null>(null);
  const isEditing = useSignal(false);
  const isDeleting = useSignal(false);

  const store = useStore({
    modal: {
      isOpen: false as boolean,
      isSuccess: false  as boolean,
      message: '' as string
    }
  })


  const fetchCustomers = $(async () => {
    isLoading.value = true;
    const newFetchApi = new CrudService<Customer>(`customers?search=${encodeURIComponent(search.value)}&page=${currentPage.value}&limit=${perPage}`);
    const fetchData = await newFetchApi.get();
    isLoading.value = false;
    if(!fetchData.success) return; // dont give popup if no customer found

    customer.value = fetchData.data;
    total.value = fetchData.total;
  });

  const { customerRefetch } = useContext(RefetchContext);

  useTask$(({ track }) => {
    track(() => search.value);
    track(() => currentPage.value);
    track(() => customerRefetch.value);
    fetchCustomers();
    customerRefetch.value = false;
  });

  const totalPages = () => Math.ceil(total.value / perPage);

  const editCustomer = $((customer: Customer) => {
    selectedCustomer.value = { ...customer }; // Prepopulate the form with customers data
    isEditing.value = true;
  });
  
  const deleteCustomers = $(async (customerId: string) => {
    try {
      const delAPI = new CrudService(`customers/${customerId}`);
      const isDeleted = await delAPI.deleteAll();
      if (!isDeleted.success) {
        store.modal = {
          isOpen: true,
          isSuccess: false,
          message: isDeleted.message || "Imeshindwa kufuta taarifa"
        }
        return;
      }

      store.modal = {
        isOpen: true,
        isSuccess: true,
        message: isDeleted.message || "Imefanikiwa kufuta mteja"
      }
  
      // If deletion is successful, remove the customer from the list
      customer.value = customer.value.filter(customer => customer.id !== customerId);
    } catch (err) {
      console.error('Imeshindwa kufika kwa seva za mteja: ', err);
    } finally {
      isDeleting.value = false;
    }
  });
  

  return (
    <div class="p-4 max-w-5xl mx-auto">
      <h1 class="text-xl font-bold text-gray-700 mt-6 mb-2 border-b-2 pb-2">
        Hatua ya 2:
      </h1>
      <h1 class="text-xl font-bold mb-4 text-center"> Wateja </h1>

      <input
        class="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="text"
        placeholder="🔍 Tafuta kwa jina la mteja ..."
        bind:value={search}
      />

      {/* Desktop Table */}
     <div class="hidden sm:block border border-gray-300 rounded overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 font-semibold text-gray-600">
            <tr>
              <th class="p-3 border-b border-gray-200">Jina: </th>
              <th class="p-3 border-b border-gray-200">Mawasiliano: </th>
              <th class="p-3 border-b border-gray-200">Kitendo: </th>
            </tr>
          </thead>
          <tbody>
            {isLoading.value ? (
              <tr>
                <td colSpan={6} class="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : customer.value.length === 0 ? (
              <tr>
                <td colSpan={7} class="p-4 text-center text-gray-500">
                Hakuna mteja yoyote, msajili kwanza ....
                </td>
              </tr>
              )
             : (
              customer.value.map((customer) => (
                <tr key={customer.id} class="border-b border-gray-200">
                  <td class="p-3">{customer.name}</td>
                  <td class="p-3"> {customer.contact} </td>
                  <div class="p-3 space-x-2">
                    <button class="text-blue-600 hover:underline" onClick$={() => editCustomer(customer)}>
                        Edit
                    </button>
                    <button
                        class="text-red-600 hover:underline"
                        onClick$={() => {
                        selectedCustomer.value = customer;
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
        ) : customer.value.length === 0 ? (
          <div class="text-center text-gray-500 p-4">Hakuna mteja yeyote, msajili kwanza ...</div>
        ) : (
          customer.value.map((customer) => (
            <div key={customer.id} class="border rounded-lg p-3 bg-white shadow-sm">
              <div class="font-semibold">{customer.name}</div>
              <div class="text-sm">{customer.contact}</div>
              <div class="mt-2 space-x-4">
                <button class="text-blue-600 hover:underline" onClick$={() => editCustomer(customer)}>
                  Edit
                </button>
                <button
                  class="text-red-600 hover:underline"
                  onClick$={() => {
                    selectedCustomer.value = customer;
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
          Kurasa {currentPage.value} kati ya {totalPages()}
        </span>
        <button
          onClick$={() => currentPage.value++}
          disabled={currentPage.value >= totalPages()}
          class="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Mbele
        </button>
      </div>

      {isEditing.value && selectedCustomer.value && (
  <div class="fixed inset-0 flex items-center justify-center z-10 bg-gray-600 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold">Edit Mteja</h2>

      <div class="mt-4">
        <label class="block text-sm">Jina:</label>
        <input
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedCustomer.value.name}
          onInput$={(e) => (selectedCustomer.value!.name = (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="mt-4">
      <label class="block text-sm">Mawasiliano: </label>
      <input
          type="number"
          class="w-full p-2 border border-gray-300 rounded"
          value={selectedCustomer.value.contact}
          onInput$={(e) => {
            const value = (e.target as HTMLInputElement).value;
            selectedCustomer.value!.contact = value;
          }}

        />
      </div>

      <div class="mt-4 flex gap-2">
        <button
          class="px-4 py-2 bg-gray-700 text-white rounded"
          onClick$={async () => {
            const newPut = new CrudService<Customer>(`customers/${selectedCustomer.value!.id}`);
            if(selectedCustomer.value === null) {
              store.modal = {
                isOpen: true,
                isSuccess: true,
                message: "Tafadhali chagua mteja"
              }
              return;
            }
            const putRes = await newPut.update(selectedCustomer.value);
            customerRefetch.value = true;

            if (!putRes.success){
              store.modal = {
                isSuccess: false,
                isOpen: true,
                message: putRes.message || "Imeshindwa ku-update taarifa"
              }
              return;
            }
      

            const index = customer.value.findIndex(p => p.id === putRes.data.id);
            if (index > -1) {
              customer.value[index] = putRes.data;
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
            selectedCustomer.value = null;
          }}
        >
          Ghairi
        </button>
      </div>
    </div>
  </div>
)}


{isDeleting.value && (
  <div class="fixed inset-0 flex items-center justify-center z-10 bg-gray-600 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold">Hakiki Ufutaji ... </h2>
      <p class="mt-2 text-sm">Je, unataka kumfuta mteja huyu ?</p>
      <div class="mt-4 flex gap-2">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded"
          onClick$={() => deleteCustomers(selectedCustomer.value!.id)}
        >
          Futa
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded"
          onClick$={() => {
            isDeleting.value = false;
            selectedCustomer.value = null;
          }}
        >
          Ghairi
        </button>
      </div>
    </div>
  </div>
)}

        {/* Modal Popup */}
        {store.modal.isOpen && (
          <Toast
          isOpen={store.modal.isOpen}
          type={store.modal.isSuccess}
          message={store.modal.message}
          onClose$={$(() => {
            store.modal.isOpen = false;
          })}
          />
      )}
    </div>
  );
});
