import { component$, useSignal, useTask$, $, useContext } from '@builder.io/qwik';
import { fetchWithLang } from '~/routes/function/fetchLang';
import { RefetchContext } from './context/refreshContext';

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
  const perPage = 10;
  const isLoading = useSignal(false);
  const selectedCustomer = useSignal<Customer | null>(null);
  const isEditing = useSignal(false);
  const isDeleting = useSignal(false);


  const fetchCustomers = $(async () => {
    isLoading.value = true;
    try {
      const res = await fetchWithLang(
        `http://localhost:3000/customers?search=${encodeURIComponent(search.value)}&page=${currentPage.value}&limit=${perPage}`,{
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
        throw new Error(`Imeshindwa kujibu kuhusu wateja: ${text}`);
      }


      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Imeshindwa kuleta wateja kutoka kwenye seva');
      }
      customer.value = json.data;

      total.value = json.total;
    } catch (err) {
      console.error('Imeshindwa kuleta mteja:', err);
    } finally {
      isLoading.value = false;
    }
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
      const res = await fetchWithLang(`http://localhost:3000/${customerId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        const text = await res.text(); // Fallback for non-JSON errors
        throw new Error(`Imeshindwa kufuta mteja: ${text}`);
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
                        Delete
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
        onClick$={() => {
          if (currentPage.value > 1) currentPage.value--;
        }}          
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

      {isEditing.value && selectedCustomer.value && (
  <div class="fixed inset-0 flex items-center justify-center z-10 bg-gray-600 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 class="text-lg font-semibold">Edit Customers</h2>

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
            try {
              const res = await fetchWithLang(`http://localhost:3000/customers/${selectedCustomer.value!.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept-Language': 'sw', // Adjust as necessary
                },
                body: JSON.stringify(selectedCustomer.value),
                credentials: 'include',
              });

              customerRefetch.value = true;
              if (!res.ok) {
                const text = await res.text();
                throw new Error(`Imeshindwa ku-update mteja: ${text}`);
              }
              const updatedCustomer = await res.json();
              // Update Customer in the local list
              const index = customer.value.findIndex(p => p.id === updatedCustomer.id);
              if (index > -1) {
                customer.value[index] = updatedCustomer;
              }
              isEditing.value = false;
            } catch (err) {
              console.error('Imeshindwa ku-update mteja:', err);
            }
          }}
        >
          Save
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded"
          onClick$={() => {
            isEditing.value = false;
            selectedCustomer.value = null;
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
      <p class="mt-2 text-sm">Are you sure you want to delete this customer?</p>
      <div class="mt-4 flex gap-2">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded"
          onClick$={() => deleteCustomers(selectedCustomer.value!.id)}
        >
          Delete
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded"
          onClick$={() => {
            isDeleting.value = false;
            selectedCustomer.value = null;
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
