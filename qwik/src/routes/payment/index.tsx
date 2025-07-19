import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const nav = useNavigate();

  return (
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">        
      <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <h1 class="text-3xl font-bold text-red-600 mb-4">Kifurushi kimeisha Muda</h1>
        <p class="text-gray-600 mb-6">
          Huduma uliyonayo imeisha muda. Tafadhali lipia ili kuendelea kufurahia huduma zetu. Bofya hapa chini kuchagua kifurushi kipya.
        </p>
        <button
          class="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200"
          onClick$={() => nav("/payment/card-selection")}
        >
          Lipia Sasa
        </button>
      </div>
    </div>
  );
});
