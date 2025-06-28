// src/components/install-prompt/install-prompt.tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

export const PWAPOP =  component$(({ onAccept$, onReject$ }: any) => {
  const showPrompt = useSignal(false);
  const pulseEffect = useSignal(false);

  // Show prompt after delay (demo purposes)
  useVisibleTask$(() => {
    const timer = setTimeout(() => {
      showPrompt.value = true;
      // Add pulse effect after another delay
      setTimeout(() => {
        pulseEffect.value = true;
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  });


  return (
    <div
      class={`fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] transition-all duration-300 ease-in-out ${
        showPrompt.value ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick$={() => (showPrompt.value = false)}
    >
      <div
        class={`bg-white rounded-2xl w-[90%] max-w-md p-8 text-center shadow-xl transition-all duration-300 ease-in-out ${
          showPrompt.value ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
        onClick$={(e) => e.stopPropagation()}
      >
        <div class="w-24 h-24 mx-auto mb-6 p-3 flex items-center justify-center rounded-full border border-gray-800 shadow-md relative overflow-hidden">
          <img
            src="/newLogo.webp"
            alt="App Logo"
            class="w-16 h-16 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Install App Yetu</h2>
        <p class="text-gray-600 mb-6 leading-relaxed">
          Furahia urahisi zaidi kwa kupakia app yetu kwenye kifaa chako chochote.
        </p>

        <div class="flex gap-4 justify-center flex-wrap">
          <button
            class={`px-7 py-3 rounded-xl font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 ease-in-out ${
              pulseEffect.value ? 'animate-pulse' : ''
            }`}
            onClick$={async () => {
              await onAccept$();
              showPrompt.value = false;
            }}
          >
            Pakia sasa
          </button>
          <button
            class="px-7 py-3 rounded-xl font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ease-in-out"
            onClick$={() => {showPrompt.value = false; onReject$()}}
          >
            Sio sasa
          </button>
        </div>
      </div>
    </div>
  );
});