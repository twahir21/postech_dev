// src/components/ForgotPassword.tsx
import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { CrudService } from '../api/base/oop';
import { Toast } from '~/components/ui/Toast';

export default component$(() => {
  const email = useSignal('');
  const error = useSignal('');
  const submitted = useSignal(false);
  const loading = useSignal(false);

  const modal = useStore({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  const validateEmail = $((value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    // error.value = isValid ? '' : 'Barua pepe si sahihi'; it also shows error when input is empty
    error.value = value
    ? isValid
        ? ''
        : 'Barua pepe si sahihi'
    : ''; // fire error if email is not empty

  });

  const handleInput = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    email.value = target.value;
    validateEmail(email.value);
  });

  const handleSubmit = $( async () => {
    if (error.value || !email.value) return;

    loading.value = true;
    // send info to backend
    const api = new CrudService<{ id?: string; email: string }>("reset-password");

    const result = await api.create({ email: email.value});

    modal.isOpen = true;
    modal.message = result.message || (result.success ? "Imefanikiwa kutuma email" : "Imeshindwa kutuma email jaribu tena");
    modal.isSuccess = result.success;

    if (submitted.value) submitted.value = false;
    submitted.value = true;
    loading.value = false;
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-300 px-4">
      <div class="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-4">
        {submitted.value ? (
          <div class="text-center">
            <h2 class="text-xl font-semibold text-green-600">Angalia barua pepe yako</h2>
            <p class="text-sm text-gray-600 mt-2">
              Tumetuma link ya kubadili nenosiri kwenye email yako.
            </p>
          </div>
        ) : (
          <>
            <h2 class="text-xl font-semibold text-gray-800 text-center">🔐 Umesahau nenosiri?</h2>
            <p class="text-sm text-gray-500 text-center">
               Tafadhali andika barua pepe yako ili kupata link ya kubadili nenosiri.
            </p>

            {/* FOMU YA KUTUMA  */}
            <div class="space-y-4">
            <label for="email" class="block text-sm font-medium text-gray-700">
                Barua Pepe:
            </label>
            <input
                type="email"
                id="email"
                value={email.value}
                onInput$={handleInput}
                autoComplete={email.value ? 'email' : 'off'}
                class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="juma_abc@gmail.com"
            />
            {error.value && (
                <p class="text-red-500 text-xs mt-1">{error.value}</p>
            )}
            </div>
            <button
            onClick$={handleSubmit}
            disabled={loading.value || !!error.value}
            class="w-full bg-gray-700 text-white font-medium py-2 rounded-xl hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
            >
            {loading.value ? 'Inatuma...' : 'Tuma link ya kubadili nenosiri'}
            </button>
          </>
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
