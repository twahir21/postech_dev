// src/components/ForgotPassword.tsx
import { $, component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  const email = useSignal('');
  const error = useSignal('');
  const submitted = useSignal(false);
  const loading = useSignal(false);

  const validateEmail = $((value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    error.value = isValid ? '' : 'Barua pepe si sahihi';
  });

  const handleInput = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    email.value = target.value;
    validateEmail(email.value);
  });

  const handleSubmit = $((e: Event) => {
    e.preventDefault();
    if (error.value || !email.value) return;

    loading.value = true;
    console.log('Form is submitted and email is:', email.value);

    

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

            <form onSubmit$={handleSubmit} class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Barua Pepe:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email.value}
                  onInput$={handleInput}
                  class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="juma_abc@gmail.com"
                  required
                />
                {error.value && (
                  <p class="text-red-500 text-xs mt-1">{error.value}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading.value || !!error.value}
                class="w-full bg-gray-700 text-white font-medium py-2 rounded-xl hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
              >
                {loading.value ? 'Inatuma...' : 'Tuma link ya kubadili nenosiri'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
});
