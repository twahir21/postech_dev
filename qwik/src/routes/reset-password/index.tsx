// src/components/ResetPassword.tsx
import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { CrudService } from '../api/base/oop';
import { Toast } from '~/components/ui/Toast';

export default component$(() => {
  const location = useLocation();
  const token = location.url.searchParams.get('token') || '';
  const email = location.url.searchParams.get('email') || '';

  const password = useSignal('');
  const confirmPassword = useSignal('');
  const message = useSignal('');
  const loading = useSignal(false);

  const state = useStore({
    showPassword: false,
    showConfirmPassword: false,
  });

  const modal = useStore({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  const handleSubmit = $(async () => {
    if (!password.value || password.value !== confirmPassword.value) {
      message.value = 'Nenosiri halilingani au limeachwa wazi.';
      return;
    }

    loading.value = true;
    const api = new CrudService<{ id?: string; email: string; token: string; password: string}>('reset-confirm');
    const res = await api.create({ email, token, password: password.value });

    // fire the popup toast
    modal.isOpen = true;
    modal.isSuccess = res.success;
    modal.message = res.message || (res.success ? "Imekubali kubadili nenosiri" : "Imeshindikana kubadili nenosiri.");

    loading.value = false;
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div class="w-full max-w-md bg-white shadow rounded-xl p-6 space-y-4">
        <h2 class="text-xl font-bold text-center">Badilisha Nenosiri</h2>

        {/* Password */}
        <div class="relative">
          <input
            type={state.showPassword ? 'text' : 'password'}
            class="w-full border p-2 rounded pr-10"
            placeholder="Nenosiri jipya"
            value={password.value}
            onInput$={(e) => (password.value = (e.target as HTMLInputElement).value)}
          />
          <button
            type="button"
            onClick$={() => (state.showPassword = !state.showPassword)}
            class="absolute top-1/2 pt-2 right-3 transform -translate-y-1/2 text-xl"
          >
            {state.showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Confirm Password */}
        <div class="relative">
          <input
            type={state.showConfirmPassword ? 'text' : 'password'}
            class="w-full border p-2 rounded pr-10"
            placeholder="Rudia nenosiri"
            value={confirmPassword.value}
            onInput$={(e) => (confirmPassword.value = (e.target as HTMLInputElement).value)}
          />
          <button
            type="button"
            onClick$={() => (state.showConfirmPassword = !state.showConfirmPassword)}
            class="absolute top-1/2 pt-2 right-3 transform -translate-y-1/2 text-xl"
          >
            {state.showConfirmPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button
          onClick$={handleSubmit}
          disabled={loading.value}
          class="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {loading.value ? 'Inatuma...' : 'Badilisha Nenosiri'}
        </button>

        {message.value && (
          <p class="text-center text-sm text-red-500 mt-2">{message.value}</p>
        )}
      </div>

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
    </div>
  );
});
