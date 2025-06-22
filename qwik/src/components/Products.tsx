import { component$, useStore, useResource$, $, useContext } from '@builder.io/qwik';
import { SupplierComponent } from './Supplier';
import { fetchCategories, fetchSuppliers, globalStore } from '~/routes/function/helpers';
import { RefetchContext } from './context/refreshContext';
import { CrudService } from '~/routes/api/base/oop';
import { swahiliLabels, swahiliPlaceholders } from '~/routes/api/base/forms';
import { Toast } from './ui/Toast';

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
      // Send data to backend
      interface prdPayload {   
        id?: string; 
        name: string;
        priceSold: number;
        stock: number;
        minStock: number;
        priceBought: number;
        unit: string;
        categoryId: string;
        supplierId: string;
      }
      const newCrudPrd = new CrudService<prdPayload>("products");
      const resData = await newCrudPrd.create(productPayload);
  
      // Check response
      if (!resData.success) { 
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
            <option value="">-- Chagua Kategoria --</option>
            {store.category.length > 0 ? (
              store.category.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.generalName}
                </option>
              ))
            ) : (
              <option disabled>Hakuna Kategoria</option>
            )}
          </select>

          {/* Supplier Dropdown */}
          <select
            class="border p-2 rounded w-full"
            onChange$={(e) => handleInputChange('supplier', (e.target as HTMLSelectElement).value)}
          >
            <option value="">-- Chagua Msambazaji --</option>
            {store.supplier.length > 0 ? (
              store.supplier.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.company}
                </option>
              ))
            ) : (
              <option disabled>Hakuna Msambazaji</option>
            )}
          </select>


        {/* Product Inputs */}
        {Object.keys(store.product).map((key) => (
          <div class="mb-1" key={key}>
            <label class="block mb-1 font-semibold text-sm text-gray-600">
              {swahiliLabels.product[key as keyof typeof swahiliLabels.product]}
            </label>
            <input
              class="border p-2 rounded w-full"
              placeholder={swahiliPlaceholders.product[key as keyof typeof swahiliPlaceholders.product]}
              type={key === 'priceSold' || key === 'stock' || key === 'minStock' ? 'number' : 'text'}
              onInput$={(e) =>
                handleNestedInputChange('product', key, (e.target as HTMLInputElement).value)
              }
            />
          </div>
        ))}

        {/* Purchases Inputs */}
        {Object.keys(store.purchases).map((key) => (
          <div class="mb-1" key={key}>
            <label class="block mb-1 font-semibold text-sm text-gray-600">
              {swahiliLabels.purchases[key as keyof typeof swahiliLabels.purchases]}
            </label>
            <input
              class="border p-2 rounded w-full"
              placeholder={swahiliPlaceholders.purchases[key as keyof typeof swahiliPlaceholders.purchases]}
              type={key === 'priceBought' ? 'number' : 'text'}
              onInput$={(e) =>
                handleNestedInputChange('purchases', key, (e.target as HTMLInputElement).value)
              }
            />
          </div>
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
        
      <h1 class="text-xl font-bold text-gray-700 mt-6 mb-2 border-b-2 pb-2">
        Hatua ya 3:
      </h1>

      <p class="max-w-2xl mx-auto bg-green-200 border-2 border-dashed border-gray-400 text-gray-800 p-5 mt-4 rounded-lg text-base italic">
        Anza kutumia mic au text kufanya mauzo, manunuzi, matumizi au kukopesha
      </p>
      
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
    </>
  );
});