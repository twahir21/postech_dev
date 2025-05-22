import { component$ } from '@builder.io/qwik';

export const WhatsApp = component$(() => {
  return (
    <a
      href="https://wa.me/255674291587"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl border-2 border-green-900 transition-all duration-300 ease-in-out hover:scale-110"
      aria-label="WhatsApp Chat"
    >
      <img
        src="/whatsApp.svg"
        alt="WhatsApp"
        class="w-13 h-13"
      />
    </a>
  );
});
