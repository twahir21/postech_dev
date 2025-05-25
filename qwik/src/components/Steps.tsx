import { component$, useSignal } from '@builder.io/qwik';

const steps = [
  {
    emoji: '📥',
    title: '1. Tengeneza QR za Bidhaa zako',
    description: `Jisajili bure siku 14 za mwanzo kisha ingia kwenye dashboard. Bonyeza kitufe cha "Anza hapa" kisha Sajili bidhaa moja tu kwa kila aina na msambazaji wake. Ukimaliza, bonyeza kitufe cha “Tengeneza QR Code”. Utapakua faili lenye QR Codes za bidhaa zako.
👉 Kama bidhaa mpya imekuja baadaye, isajili kwanza au kama bei imebadilika badili kwenye rekodi ya bidhaa, kisha utaona kitufe cha “Tengeneza QR Code” kimefunguka tena – bonyeza upate QR mpya.`,
  },
  {
    emoji: '🗂️',
    title: '2. Tunza QR Code za bidhaa zako',
    description: `Faili ulilopakuwa, nenda katoe QR Codes kwenye karatasi ili kuweka sehemu rahisi kwa ajili ya matumizi kwa muuzaji. Inashauriwa kubandika QR kwenye bidhaa zinazohusika.`,
  },
  {
    emoji: '🧾',
    title: '3. Rekodi Mauzo Moja kwa Moja',
    description: `Toa QR Code zako Stationery. Chukua zile karatasi zenye QR Code (stationery) ulizopewa. Hifadhi vizuri. Kisha chukua kila moja na uibandike kwenye bidhaa inayohusika. Mfano: kama unauza sabuni ya unga ya Omo, bandika QR Code ya Omo kwenye paketi moja tu ya Omo au sehemu ambayo utatumia kuscan kwa ajili ya mauzo au manunuzi ya omo — usichanganye na bidhaa nyingine.`,
  },
  {
    emoji: '📊',
    title: '4. Fuata Faida na Ripoti',
    description: `Pata ripoti za faida, matumizi na hesabu kamili — kila siku, wiki na mwezi.`,
  },
];

export const Steps = component$(() => {
  const openStepIndex = useSignal<number | null>(null);

  return (
    <section class="bg-gray-50 py-10 px-4 text-gray-800">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-6">Jinsi PosTech Inavyofanya Kazi</h2>
        <p class="text-gray-600 mb-8 text-sm md:text-base">
          Ni Hatua rahisi nne tu, kutumia mfumo wa PosTech — kuanzia kuuza mpaka kupata ripoti ya faida!
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
        {steps.map((step, index) => (
          <div
            key={index}
            onClick$={() =>
              openStepIndex.value === index
                ? (openStepIndex.value = null)
                : (openStepIndex.value = index)
            }
            class="cursor-pointer flex flex-col items-center bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all"
          >
            <div class="bg-blue-100 text-blue-700 rounded-full p-3 mb-4 text-xl">
              {step.emoji}
            </div>
            <h3 class="font-semibold text-lg mb-2 text-center flex items-center gap-2">
              {openStepIndex.value === index ? '👇' : '👉'} {step.title}
            </h3>
            {openStepIndex.value === index && (
              <p class="text-sm text-gray-600 text-center whitespace-pre-wrap">
                {step.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
});
