import { component$ } from '@builder.io/qwik';

export const Steps = component$(() => {
  return (
    <section class="bg-gray-50 py-10 px-4 text-gray-800">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-6">Jinsi PosTech Inavyofanya Kazi</h2>
        <p class="text-gray-600 mb-8 text-sm md:text-base">
          Ni Hatua rahisi nne tu, kutumia mfumo wa PosTech — kuanzia kuuza mpaka kupata ripoti ya faida!
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Step 1 */}
        <div class="flex flex-col items-center bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div class="bg-green-100 text-green-700 rounded-full p-3 mb-4">
            📥
          </div>
          <h3 class="font-semibold text-lg mb-2">1. Tengeneza QR za Bidhaa zako</h3>
          <p class="text-sm text-gray-600 text-center">
            Sajili bidhaa moja tu kwa kila aina na msambazaji wake. Ukimaliza, bonyeza kitufe cha “Tengeneza QR Code”. Utapakua faili lenye QR Codes za bidhaa zako.
            👉 Kama bidhaa mpya imekuja baadaye, isajili kwanza au kama bei imebadilika badili kwenye rekodi ya bidhaa, kisha utaona kitufe cha “Tengeneza QR Code” kimefunguka tena – bonyeza upate QR mpya.</p>
        </div>

        {/* Step 2 */}
        <div class="flex flex-col items-center bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div class="bg-purple-100 text-yellow-700 rounded-full p-3 mb-4">
            📷 
          </div>
          <h3 class="font-semibold text-lg mb-2">2. Fuata Faida na Ripoti</h3>
          <p class="text-sm text-gray-600 text-center">
            Pata ripoti za faida, matumizi na hesabu kamili — kila siku, wiki na mwezi.
          </p>
        </div>

        {/* Step 3 */}
        <div class="flex flex-col items-center bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div class="bg-blue-100 text-blue-700 rounded-full p-3 mb-4">
            🧾
          </div>
          <h3 class="font-semibold text-lg mb-2">3. Rekodi Mauzo Moja kwa Moja</h3>
          <p class="text-sm text-gray-600 text-center">
            Toa QR Code zako Stationery. Chukua zile karatasi zenye QR Code (stationery) ulizopewa. Hifadhi vizuri. Kisha chukua kila moja na uibandike kwenye bidhaa inayohusika. Mfano: kama unauza sabuni ya unga ya Omo, bandika QR Code ya Omo kwenye paketi moja tu ya Omo au sehemu ambayo utatumia kuscan kwa ajili ya mauzo au manunuzi ya omo — usichanganye na bidhaa nyingine.
          </p>
        </div>

        {/* Step 4 */}
        <div class="flex flex-col items-center bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div class="bg-purple-100 text-purple-700 rounded-full p-3 mb-4">
            📊
          </div>
          <h3 class="font-semibold text-lg mb-2">4. Fuata Faida na Ripoti</h3>
          <p class="text-sm text-gray-600 text-center">
            Pata ripoti za faida, matumizi na hesabu kamili — kila siku, wiki na mwezi.
          </p>
        </div>
      </div>
    </section>
  );
});
