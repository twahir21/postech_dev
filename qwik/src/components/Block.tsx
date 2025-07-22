// src/components/PaymentBlockOverlay.tsx
import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export const PaymentBlockOverlay = component$(() => {
  const nav = useNavigate();

  return (
    <div class="fixed inset-0 z-50 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center animate-fade-in border-3 border-gray-500">
        <h1 class="text-3xl font-bold text-red-600 mb-4">Kifurushi kimeisha Muda</h1>
        <p class="text-gray-600 mb-6">
          Huduma uliyonayo imeisha muda. Tafadhali lipia ili kuendelea kufurahia huduma zetu.
        </p>
        <button
          class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-full"
          onClick$={() => nav("/pricing")}
        >
          Lipia Sasa
        </button>
      </div>
    </div>
  );
});