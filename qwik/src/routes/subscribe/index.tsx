import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      {/* Header */}
      <header class="text-center mb-6">
        <h1 class="text-3xl font-semibold text-gray-600">Jisajili kwa Huduma Yetu</h1>
        <p class="mt-2 text-gray-600">Chagua mpango unaokufaa na furahia huduma za kipekee.</p>
      </header>

      {/* Plan Selection */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Plan Card 1 (Basic Plan) */}
        <div class="bg-white p-6 rounded-lg shadow-lg text-center hover:scale-105 ransition-all duration-300">
          <h2 class="text-xl font-semibold text-gray-600">Mpango wa Msingi</h2>
          <p class="mt-2 text-gray-500">Kwa wajasiriamali wadogo au biashara ndogo.</p>
          <p class="mt-4 text-2xl font-bold text-gray-700">Tsh 10,000 / mwezi</p>
          <p class="mt-2 text-gray-400">Ipo tayari kutumika</p>
          <button class="mt-6 w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Jisajili Sasa
          </button>
        </div>

        {/* Plan Card 2 (Standard Plan - Coming Soon) */}
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 class="text-xl font-semibold text-gray-600">Mpango wa Kawaida</h2>
          <p class="mt-2 text-gray-500">Kwa biashara zinazoendelea na mahitaji zaidi.</p>
          <p class="mt-4 text-2xl font-bold text-gray-700">Tsh 30,000 / mwezi</p>
          <p class="mt-2 text-gray-400">Inakuja hivi karibuni...</p>
          <button class="mt-6 w-full py-2 px-4 bg-gray-400 text-white rounded-lg cursor-not-allowed">
            Inakuja Hivi Karibuni
          </button>
        </div>

        {/* Plan Card 3 (Premium Plan - Coming Soon) */}
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 class="text-xl font-semibold text-gray-600">Mpango wa Premium</h2>
          <p class="mt-2 text-gray-500">Kwa biashara zinazohitaji huduma za premium na msaada maalum.</p>
          <p class="mt-4 text-2xl font-bold text-gray-700">Tsh 50,000 / mwezi</p>
          <p class="mt-2 text-gray-400">Inakuja hivi karibuni...</p>
          <button class="mt-6 w-full py-2 px-4 bg-gray-400 text-white rounded-lg cursor-not-allowed">
            Inakuja Hivi Karibuni
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div class="mt-8 text-center text-gray-700">
        <p class="text-lg font-medium pb-4.5">Unahitaji msaada au maelezo zaidi? Wasiliana na timu yetu ya msaada!</p>
        <a
          href="https://wa.me/255674291587"
          target="_blank"
          class="block w-full text-center bg-gray-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
        >
          📲 Nicheki WhatsApp
        </a>
      </div>

      {/* Payment Info */}
      <div class="mt-8 text-center text-gray-700">
        <p class="text-lg">Lipa kwa namba binafsi ya Halotel: <strong>+255 621 031 195</strong></p>
        <p class="mt-2 text-gray-500">Jina la mpokeaji: TWAHIR SOUD ABDI</p>
      </div>

      <div>
        <h1>model</h1>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>
        <model-viewer src="/money.glb" id="bee-model" camera-orbit="45deg 45deg" class="getLeft"></model-viewer>

      </div>
    </div>
  );
});
