// src/components/SettingsPage.tsx
import { component$, useSignal, useStore, useResource$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { env } from '~/routes/api/base/config';
import { CrudService } from '~/routes/api/base/oop';

export const SettingsComponent = component$(() => {
  const currentPassword = useSignal('');
  const newPassword = useSignal('');
  const confirmPassword = useSignal('');
  const isTrial = true;
  const trialEnds = '30-4-2025';

  interface Store {
    shopName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    isTrial?: boolean;
    trialEnds?: string;
    isLoading?:boolean;
    isPassword?:boolean;
    isDelete?:boolean;
    isDelLoading: boolean;
    modal: {
      isSuccess: boolean;
      message: string;
      isOpen: boolean;
    }
  }

  const store = useStore<Store>({
    shopName: 'Loading ...',
    email: 'Loading ...',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isTrial: true,
    trialEnds: '2025-04-30', // Consider using a Date object if needed
    isLoading: false,
    isPassword: false,
    isDelete: false,
    isDelLoading: false,
    modal: {
      isSuccess: false,
      message: '',
      isOpen: false
    }
  });

  const showModal = useSignal(false);
  const confirmInput = useSignal('');
  const navigation = useNavigate();



  // logic for shopName and email
  useResource$(async () => {
    if (store.isLoading) return; // prevent multiple reqs
    interface shopInfo {
      id: string,
      email: { email: string},
      shopName: { shopName: string}
    }
    const shopApi = new CrudService<shopInfo>("shop");
    
    const result = await shopApi.get();

    if (!result.success) {
      store.isLoading = false; // finishes loading ...
      return;
    }
    store.email = result.data[0].email.email;
    store.shopName = result.data[0].shopName.shopName;
    store.isLoading = false; // finishes loading ...
  });

  const handleSubmit = $(async () => {
    if (store.isLoading) return;
      store.isLoading = true;
          const payload = {
        email: store.email,
        shopName: store.shopName
      };
      interface payloadEdit { id?: string; email: string; shopName: string}
      const editShopAPI = new CrudService<payloadEdit>("shop");
      const editShopData = await editShopAPI.update(payload);
      store.isLoading = false; //stop loading ...

      store.modal = {
        isOpen: true,
        isSuccess: editShopData.success,
        message: editShopData.message || (editShopData.success ? "Umefanikiwa ku-update" : "Tatizo limetokea wakati wa kubadili taarifa za duka")
      }
  });


  // logic for password change
  const handlePswdSubmit = $(async () => {
    if (store.isPassword) return;
    // validate inputs
    if (
      currentPassword.value.length < 6 ||
      newPassword.value.length < 6 ||
      confirmPassword.value !== newPassword.value
    ) {
      return;
    }

    store.isPassword = true;
      const payload = {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      };
      interface payloadPassword {id?: string; currentPassword: string; newPassword: string }
      const updatePasswordAPI = new CrudService<payloadPassword>("update-password");
      const updatePswd = await updatePasswordAPI.update(payload);

      store.isPassword = false;
      store.modal = {
        isOpen: true,
        isSuccess: updatePswd.success,
        message: updatePswd.message || (updatePswd.success ? "Umefanikiwa kubadili nenosiri" : "Hitilafu imetokea wakati wa kubadili nenosiri")
      }
  });

  // logic to delete the shop
  const handleConfirmDelete = $(async () => {
    if (confirmInput.value.trim().toLowerCase() === "nipo tayari kufuta duka") {
      // original delete logic
      if (store.isDelete) return; // prevent multiple reqs

      store.isDelete = true;
      store.isDelLoading = true;
      const deleteApi = new CrudService("delete-shop");
      const delResult = await deleteApi.deleteAll();

      store.isDelete = false // clear delete flag
      store.isDelLoading = false
      showModal.value = false; // close modal

      const frontendURL = env.mode === 'development'
                          ? env.frontendURL_DEV
                          : env.frontendURL;

      store.modal = {
        isOpen: true,
        isSuccess: delResult.success,
        message: delResult.message || (delResult.success ? "Umefanikiwa" : "Imeshindwa kufuta duka")
      }
      return navigation(frontendURL);
    }
  });
  

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h1 class="text-xl font-bold mb-4">⚙️ Mipangilio</h1>

      {/* Shop Info */}
      <section class="mb-6 bg-gray-100 shadow rounded-xl p-4 border-2 border-gray-600">
        <h2 class="text-lg font-semibold mb-2">🛍️ Taarifa za duka</h2>
        <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700 m-0">Jina la Duka:</label>
          <input
            type="text"
            class="w-full p-2 border rounded"
            placeholder="Shop Name"
            value={store.shopName}
            onInput$={(e) => (store.shopName = (e.target as HTMLInputElement).value)}
          />
          <label class="block text-sm font-medium text-gray-700 m-0">Email (barua pepe):</label>
          <input
            type="email"
            class="w-full p-2 border rounded"
            placeholder="Admin Email"
            value={store.email}
            onInput$={(e) => (store.email = (e.target as HTMLInputElement).value)}
          />
          <button class={`${store.isLoading ? 'bg-gray-400': 'bg-gray-600'} hover:bg-gray-700 text-white px-4 py-2 rounded `}
          onClick$={handleSubmit}
          disabled={store.isLoading}
          >
            {
            store.isLoading ?             
              // Custom Loader
              <div class="inline-flex">
              <div class="loaderCustom"></div>
              </div>
            : '💾 Hifadhi mabadiliko'
            }
          </button>
        </div>
      </section>

      {/* Password */}
      <section class="mb-6 bg-yellow-50 shadow rounded-xl p-4 border-2 border-yellow-500">
        <h2 class="text-lg font-semibold mb-2">🔐 Badili Nenosiri</h2>
        <div class="space-y-3">
          <input
            type="password"
            class="w-full p-2 border rounded"
            placeholder="Nenosiri ya sasa"
            bind:value={currentPassword}
          />
            {/* Message for current password */}
            {currentPassword.value.length > 0 && (
              <p class={`text-sm ${currentPassword.value.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                {currentPassword.value.length >= 6 ? '✅ Sahihi' : '❌ Nenosiri fupi mno (min 6)'}
              </p>
            )}
          <input
            type="password"
            class="w-full p-2 border rounded"
            placeholder="Nenosiri mpya"
            bind:value={newPassword}
          />
            {/* Message for new password */}
            {newPassword.value.length > 0 && (
              <p class={`text-sm ${newPassword.value.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                {newPassword.value.length >= 6 ? '✅ Sahihi' : '❌ Nenosiri fupi mno (min 6)'}
              </p>
            )}
          <input
            type="password"
            class="w-full p-2 border rounded"
            placeholder="Hakiki nenosiri mpya"
            bind:value={confirmPassword}
          />
            {/* Message for confirm password */}
            {confirmPassword.value.length > 0 && (
              <p class={`text-sm ${
                confirmPassword.value === newPassword.value && confirmPassword.value.length >= 6
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {
                  confirmPassword.value === newPassword.value && confirmPassword.value.length >= 6
                    ? '✅ Sahihi'
                    : '❌ Nenosiri hazifanani'
                }
              </p>
            )}
          <button 
          class={`${store.isPassword ? 'bg-yellow-300': 'bg-yellow-600'} text-white px-4 py-2 rounded hover:bg-yellow-700`}
          disabled={store.isPassword}
          onClick$={handlePswdSubmit}
          >
           
            {
            store.isPassword ?             
              // Custom Loader
              <div class="inline-flex">
              <div class="loaderCustom"></div>
              </div>
            : '🔒 Badili Nenosiri'
            }
          </button>
        </div>
      </section>


      {/* Subscription Info */}
      <section class="mb-6 bg-indigo-50 shadow rounded-xl p-4 border-2 border-indigo-500">
        <h2 class="text-lg font-semibold mb-2">💳 Malipo ya huduma</h2>
        {isTrial ? (
          <p class="text-sm text-gray-600">
            Kwa sasa upo kwenye ofa ya siku <span class="font-bold text-green-600">14 bure</span>. Itaisha {' '}
            <span class="font-semibold">{trialEnds}</span>.
          </p>
        ) : (
          <p class="text-sm text-gray-600">
            Huduma yako ipo active. Utalipia tena tarehe : <span class="font-semibold">01-05-2025</span>
          </p>
        )}
        <button class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          🧾 Angalia vifurushi
        </button>
      </section>

      {/* Danger Zone */}
      <section class="bg-red-100 border border-red-400 rounded-xl p-4">
        <h2 class="text-lg font-semibold text-red-700 mb-2">⚠️ Eneo Hatari</h2>
        <p class="text-sm text-red-700 mb-3">Kufuta duka ni moja kwa moja, taarifa zako haziwezi kurudishwa.</p>
        <button class={`${store.isDelete ? 'bg-red-400': 'bg-red-600'} text-white px-4 py-2 rounded hover:bg-red-700`}
        disabled={store.isDelete}
        onClick$={() => showModal.value = true}
        >
          {
            store.isDelete ?             
              // Custom Loader
              <div class="inline-flex">
              <div class="loaderCustom"></div>
              </div>
            : '🗑️ Futa Duka'
            }
        </button>
      </section>
      
      {/* Modal for deletion confirmation */}
      {showModal.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-60 backdrop-blur-[1px]">
          <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-bold mb-4 text-red-600">⚠️ Thibitisha Kufuta Duka</h3>
            <p class="mb-3 text-sm">
              Andika: <strong class="text-red-700">nipo tayari kufuta duka</strong> kuthibitisha.
            </p>

            <input
              type="text"
              class="w-full border rounded p-2 mb-1"
              placeholder="Andika hapa..."
              bind:value={confirmInput}
            />

            {/* Validation message */}
            {confirmInput.value.length > 0 && (
              <p class={`text-sm ${confirmInput.value === 'nipo tayari kufuta duka' ? 'text-green-600' : 'text-red-600'}`}>
                {
                  confirmInput.value === 'nipo tayari kufuta duka'
                    ? '✅ Umeandika sahihi'
                    : '❌ Andika sentensi kamili ili kuthibitisha'
                }
              </p>
            )}

            <div class="flex justify-end gap-2 mt-4">
              <button 
                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                onClick$={() => {
                  confirmInput.value = '';
                  showModal.value = false;
                }}
              >
                Ghairi
              </button>

              <button 
                class={`px-4 py-2 rounded text-white ${
                  confirmInput.value === 'nipo tayari kufuta duka'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
                }`}
                disabled={confirmInput.value !== 'nipo tayari kufuta duka'}
                onClick$={handleConfirmDelete}
              >
                {
                store.isDelLoading ?             
                  // Custom Loader
                  <div class="inline-flex">
                  <div class="loaderCustom"></div>
                  </div>
                : 'Thibitisha'
                }
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Modal Popup */}
        {store.modal.isOpen && (
        <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-neutral-500 z-50">
          <div class="bg-white p-6 rounded shadow-lg text-center">
            <p class={store.modal.isSuccess ? 'text-green-600' : 'text-red-600'}>{store.modal.message}</p>
            <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick$={() => (store.modal.isOpen = false)}>
              Sawa
            </button>
          </div>
        </div>
      )}

    </div>
  );
});
