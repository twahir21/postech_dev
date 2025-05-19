import { component$, useStore, useResource$, $, useContext } from '@builder.io/qwik';
import { SupplierComponent } from './Supplier';
import { QrPdf } from './QRPdf';
import { fetchCategories, fetchSuppliers, globalStore } from '~/routes/function/helpers';
import { RefetchContext } from './context/refreshContext';

interface Product {
  name: string;
  priceSold: string;
  stock: string;
  minStock: string;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  unit: string;
  categoryId?: string;
  supplierId?: string;
}

interface Purchases {
  priceBought: string;
}

interface Store {
  category: {
    id: string;
    generalName: string;
  }[];
  supplier: {
    id: string;
    company: string;
  }[];
  product: Product;
  purchases: Purchases;
  modal: {
    isOpen: boolean;
    message: string;
    isSuccess: boolean;
  };
  isLoading?: boolean
}

export const ProductComponent = component$(() => {
  const store = useStore<Store>({
    category: [],
    supplier: [],
    product: {
      name: '',
      priceSold: '',
      stock: '',
      minStock: '',
      unit: '',
    },
    purchases: {
      priceBought: '',
    },
    modal: {
      isOpen: false,
      message: '' as string,
      isSuccess: false,
    },
    isLoading: false
  });

 const { 
         supplierRefetch, 
         categoryRefetch, 
         qrCodeRefetch     
  } = useContext(RefetchContext);

  // Fetch categories from backend with error handling
  useResource$<any>(async ({ track }) => {
    track(() => categoryRefetch.value);


    try {
      await fetchCategories(); // initial fetch
      store.category = globalStore.categoriesData;
      categoryRefetch.value = false;
      return globalStore.categoriesData
    } catch (error) {
      store.category = [];
      store.modal = { 
        isOpen: true, 
        message: error instanceof Error ? error.message : 'Tatizo limejitokeza', 
        isSuccess: false 
      };
      return []; // Return empty array in case of an error
    }
  });

    // Fetch suppliers from backend with error handling
    useResource$<any>(async ({ track }) => {
      track(() => supplierRefetch.value);
  
      try {
        await fetchSuppliers(); // initial fetch
        store.supplier = globalStore.supplierData;
        // ✅ Reset the flag immediately after
        supplierRefetch.value = false;
        return globalStore.supplierData;
      } catch (error) {
        store.supplier = [];
        store.modal = { 
          isOpen: true, 
          message: error instanceof Error ? error.message : 'Tatizo limejitokeza', 
          isSuccess: false 
        };
      return []; // Return empty array in case of an error
      }
    });  

  // Handle input changes for the form
  const handleInputChange = $((field: keyof Store, value: string) => {
    if (field === 'category') {
      const selectedCategory = store.category.find(cat => cat.id === value);
      if (selectedCategory) store.category = [selectedCategory]; // Ensure it's an array
    } else if (field === 'supplier') {
      const selectedSupplier = store.supplier.find(sup => sup.id === value);
      if (selectedSupplier) store.supplier = [selectedSupplier];
    }
    else {
      (store[field] as any) = value;
    }
  });
  
  // Handle nested input changes for product and purchases
  const handleNestedInputChange = $((field: keyof Store, key: string, value: string) => {
    (store[field] as any)[key] = value;
  });

  // Handle form submission
  const handleSubmit = $(async () => {
    if (store.isLoading) return; // prevent multiple reqs
    try {
      store.isLoading = true; // Start loading ...
      // Ensure no fields are empty
      if (!store.product.name || !store.product.priceSold || !store.product.stock || 
          !store.product.minStock || !store.product.unit || !store.purchases.priceBought ||
          store.category.length === 0 || store.supplier.length === 0) {
        store.modal = { isOpen: true, message: 'Tafadhali jaza taarifa zote sahihi', isSuccess: false };
        return;
      }
  
      // Convert priceSold, stock, minStock, priceBought to numbers
      const priceSold = Number(store.product.priceSold);
      const stock = Number(store.product.stock);
      const minStock = Number(store.product.minStock);
      const priceBought = Number(store.purchases.priceBought);
  
      if (isNaN(priceSold) || isNaN(stock) || isNaN(minStock) || isNaN(priceBought)) {
        store.modal = { isOpen: true, message: 'Tafadhali weka namba tu sehemu zinazohitajika', isSuccess: false };
        return;
      }
  
      // Restructure payload
      const productPayload = {
        name: store.product.name,
        priceSold,
        stock,
        minStock,
        priceBought,
        unit: store.product.unit,
        categoryId: store.category[0]?.id, // Use ID instead of full object
        supplierId: store.supplier[0]?.id,
      };
      console.log(productPayload, " product payload")
      // Send data to backend

      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
        credentials: 'include',
      });

      qrCodeRefetch.value = true;
      const resData = await response.json();
  
      // Check response
      if (!response.ok || !resData.success) { 
        store.modal = { isOpen: true, message: resData.message || 'Tatizo limejitokeza', isSuccess: false };
        return;
      }
  
      store.modal = { isOpen: true, message: resData.message || 'Umefanikiwa', isSuccess: true };
  
    } catch (error) {
      store.modal = { 
        isOpen: true, 
        message: error instanceof Error ? error.message : 'Tatizo limejitokeza', 
        isSuccess: false 
      };
      } finally {
      store.isLoading = false; // end loading ...
    }
  });
  
  return (
    <>
      <h1 class="text-xl font-bold text-gray-700 mt-6 mb-2 border-b-2 pb-2">
        Hatua ya 1:
      </h1>
      <SupplierComponent />
      <h1 class="text-xl font-bold text-gray-700 mt-6 mb-2 border-b-2 pb-2">
        Hatua ya 2:
      </h1>

      <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-5 border-2 border-gray-600">
        <h2 class="text-2xl font-bold mb-4">
          Ongeza Bidhaa:
        </h2>

        <div class="grid grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <select
            class="border p-2 rounded w-full"
            onChange$={(e) => handleInputChange('category', (e.target as HTMLSelectElement).value)}
          >
            <option value="">Select Category</option>
            {store.category.length > 0 ? (
              store.category.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.generalName}
                </option>
              ))
            ) : (
              <option disabled>No Categories Found</option>
            )}
          </select>

          {/* Supplier Dropdown */}
          <select
            class="border p-2 rounded w-full"
            onChange$={(e) => handleInputChange('supplier', (e.target as HTMLSelectElement).value)}
          >
            <option value="">Select Supplier</option>
            {store.supplier.length > 0 ? (
              store.supplier.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.company}
                </option>
              ))
            ) : (
              <option disabled>No Supplier Found</option>
            )}
          </select>

          {/* Product Inputs */}
          {Object.keys(store.product).map((key) => (
            <input
              key={key}
              class="border p-2 rounded w-full"
              placeholder={`Product ${key.charAt(0).toUpperCase() + key.slice(1)}`}
              type={key === 'priceSold' || key === 'stock' || key === 'minStock' ? 'number' : 'text'}
              onInput$={(e) => handleNestedInputChange('product', key, (e.target as HTMLInputElement).value)}
            />
          ))}

          {/* Purchases Inputs */}
          {Object.keys(store.purchases).map((key) => (
            <input
              key={key}
              class="border p-2 rounded w-full"
              placeholder={`Purchases ${key.charAt(0).toUpperCase() + key.slice(1)}`}
              type={key === 'priceBought' ? 'number' : 'text'}
              onInput$={(e) => handleNestedInputChange('purchases', key, (e.target as HTMLInputElement).value)}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          class="bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full hover:bg-gray-500"
          onClick$={handleSubmit}
        >
          { 
            store.isLoading ?
            // Custom Loader
            <div class="inline-flex">
            <div class="loaderCustom"></div>
            </div>
           : 'Tuma'
          }
        </button>
      </div>
        
      <QrPdf />
      
        {/* Modal Popup */}
        {store.modal.isOpen && (
          <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-neutral-500 z-50">
            <div class="bg-white p-6 rounded shadow-lg text-center">
              <p class={store.modal.isSuccess ? 'text-green-600' : 'text-red-600'}>{store.modal.message}</p>
              <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick$={() => (store.modal.isOpen = false)}>
                Ok
              </button>
            </div>
          </div>
        )}
    </>
  );
});