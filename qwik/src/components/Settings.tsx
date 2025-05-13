// src/components/SettingsPage.tsx
import { component$, useSignal, useStore, useResource$, $ } from '@builder.io/qwik';
import { CrudService } from '~/routes/api/base/oop';
import { fetchWithLang } from '~/routes/function/fetchLang';

export const SettingsComponent = component$(() => {
  const currentPassword = useSignal('');
  const newPassword = useSignal('');
  const confirmPassword = useSignal('');
  const isTrial = true;
  const trialEnds = '2025-04-30';

  interface Store {
    shopName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    isTrial?: boolean;
    trialEnds?: string; // You could use `Date` if you want stricter typing
    isLoading?:boolean;
    isPassword?:boolean;
    isDelete?:boolean;
  }

  const store = useStore<Store>({
    shopName: 'MyPOS Tech',
    email: 'admin@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isTrial: true,
    trialEnds: '2025-04-30', // Consider using a Date object if needed
    isLoading: false,
    isPassword: false,
    isDelete: false
  });

  const showModal = useSignal(false);
  const confirmInput = useSignal('');



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
    console.log("DATA: ", result);

    if (!result.success) {
      return;
    }
    console.log("ShopInfo: ", result.data[0].email.email)
    // store.email = result.data[0].email;
    // store.shopName = result.data.shopName;
    try {
      store.isLoading = true; // Start loading ...
      const response = await fetchWithLang("http://localhost:3000/shop", {
        credentials: 'include'
      });
  
      if (!response.ok) {
        console.error("Imeshindwa kupokea ujumbe unaotakiwa");
      }
  
      const data = await response.json();
  
      if (!data.success) {
        console.log(data.message || "Kuna tatizo");
      }
  
      store.email = data.email.email;
      store.shopName = data.shopName.shopName;
    } catch (error) {
      error instanceof Error ? error : "Imeshindwa kuwasiliana na seva"
    } finally{
      store.isLoading = false; // finishes loading ...
    }

  });

  const handleSubmit = $(async () => {
    if (store.isLoading) return;
    store.isLoading = true;
    try {
      const payload = {
        email: store.email,
        shopName: store.shopName
      };
  
      const req = await fetchWithLang("http://localhost:3000/shop", {
        credentials: 'include',
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      if (!req.ok) {
        console.error("Imeshindwa kutuma ombi lako kwa seva");
      }
    } finally {
      store.isLoading = false;
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
    try {
      const payload = {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      };
  
      const req = await fetchWithLang("http://localhost:3000/update-password", {
        credentials: 'include',
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      if (!req.ok) {
        console.error("Imeshindwa kutuma ombi lako kwa seva");
      }

      const res = await req.json();

      console.log(res.message);

    } finally {
      store.isPassword = false;
    }
  });

  // logic to delete the shop
  const handleConfirmDelete = $(async () => {
    if (confirmInput.value.trim().toLowerCase() === "nipo tayari kufuta duka") {
      // original delete logic
      if (store.isDelete) return;

      store.isDelete = true;
      try {
        const req = await fetchWithLang("http://localhost:3000/delete-shop", {
          credentials: 'include',
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
        });
    
        if (!req.ok) {
          console.error("Imeshindwa kutuma ombi lako kwa seva");
        }
  
        // const res = await req.json();
  
        // console.log(res.message);
  
      } finally {
        store.isDelete = false;
      }
      showModal.value = false;
      return true;
    } else {
      alert("Andika sahihi: 'nipo tayari kufuta duka'");
      return false;
    }
  });
  

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h1 class="text-xl font-bold mb-4">⚙️ Settings</h1>

      {/* Shop Info */}
      <section class="mb-6 bg-white shadow rounded-xl p-4">
        <h2 class="text-lg font-semibold mb-2">🛍️ Shop Information</h2>
        <div class="space-y-3">
          <input
            type="text"
            class="w-full p-2 border rounded"
            placeholder="Shop Name"
            value={store.shopName}
            onInput$={(e) => (store.shopName = (e.target as HTMLInputElement).value)}
          />
          <input
            type="email"
            class="w-full p-2 border rounded"
            placeholder="Admin Email"
            value={store.email}
            onInput$={(e) => (store.email = (e.target as HTMLInputElement).value)}
          />
          <button class={`${store.isLoading ? 'bg-gray-400': 'bg-blue-600'} hover:bg-blue-700 text-white px-4 py-2 rounded `}
          onClick$={handleSubmit}
          disabled={store.isLoading}
          >
            {
            store.isLoading ?             
              // Custom Loader
              <div class="inline-flex">
              <div class="loaderCustom"></div>
              </div>
            : '💾 Save Changes'
            }
          </button>
        </div>
      </section>

      {/* Password */}
      <section class="mb-6 bg-white shadow rounded-xl p-4">
        <h2 class="text-lg font-semibold mb-2">🔐 Change Password</h2>
        <div class="space-y-3">
          <input
            type="password"
            class="w-full p-2 border rounded"
            placeholder="Current Password"
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
            placeholder="New Password"
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
            placeholder="Confirm New Password"
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
            : '🔒 Update Password'
            }
          </button>
        </div>
      </section>


      {/* Subscription Info */}
      <section class="mb-6 bg-white shadow rounded-xl p-4">
        <h2 class="text-lg font-semibold mb-2">💳 Subscription</h2>
        {isTrial ? (
          <p class="text-sm text-gray-600">
            You are currently on a <span class="font-bold text-green-600">14-day trial</span>. It expires on{' '}
            <span class="font-semibold">{trialEnds}</span>.
          </p>
        ) : (
          <p class="text-sm text-gray-600">
            Your subscription is active. Next renewal: <span class="font-semibold">2025-05-01</span>
          </p>
        )}
        <button class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          🧾 Manage Billing
        </button>
      </section>

      {/* Danger Zone */}
      <section class="bg-red-100 border border-red-400 rounded-xl p-4">
        <h2 class="text-lg font-semibold text-red-700 mb-2">⚠️ Danger Zone</h2>
        <p class="text-sm text-red-700 mb-3">Deleting your shop is permanent and cannot be undone.</p>
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
                Thibitisha
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
});
