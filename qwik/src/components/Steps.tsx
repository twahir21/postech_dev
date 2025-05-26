import { component$, useSignal } from '@builder.io/qwik';
import type { JSXOutput } from '@builder.io/qwik';

interface Step {
  emoji: string;
  title: string;
  description: string | JSXOutput;
}

const steps: Step [] = [
  {
    emoji: '📥',
    title: '1. Tengeneza QR za Bidhaa zako',
    description: `Jisajili bure siku 14 za mwanzo kisha ingia kwenye dashboard. Bonyeza kitufe cha "Anza hapa" kisha Sajili bidhaa moja tu kwa kila aina na msambazaji wake. mfano: sajili cocacola kutoka bonite mara 1 kisha hamia soda nyingine. Ukimaliza, bonyeza kitufe cha “Tengeneza QR Code”. Utapakua faili lenye QR Codes za bidhaa zako.
👉 Kama bidhaa mpya imekuja baadaye, isajili kwanza au kama bei imebadilika badili kwenye rekodi ya bidhaa, kisha utaona kitufe cha “Tengeneza QR Code” kimefunguka tena – bonyeza upate QR mpya.`,
  },
  {
    emoji: '🗂️',
    title: '2. Tunza QR Code za bidhaa zako',
    description: `Faili ulilopakuwa, nenda katoe QR Codes stationery (Ni mara moja tu mpaka bidhaa itakapobadilishwa bei) kisha chukua karatasi zenye QR Code hifadhi au ili weka sehemu rahisi kwa ajili ya matumizi kwa muuzaji. Inashauriwa kubandika QR kwenye bidhaa zinazohusika moja tu. Mfano: bandika QR code ya coca kwenye kreti la coca ili ukitaka kuuza coca unatumia ile ile QR Code moja. Kila QR Code ina jina la bidhaa zako.`,
  },{
    emoji: '📸',
    title: "3. Scan QR Code ukifanya mauzo, manunuzi, matumizi au kukopesha",
    description: (
  <>
    Ni rahisi sana, tumia Google Lens au App yoyote play isiyo na matangazo au Pata app isiyo na matangazo
    kwa watu wa Android, bofya  👉{' '}
    <a
      href="https://play.google.com/store/apps/details?id=com.mayur.neoqrcodescanner"
      target="_blank"
      rel="noopener noreferrer"
      class="text-blue-600 dark:text-blue-900 underline"
    >
      Pakua hapa
    </a>
    . Kisha fungua app hiyo, scan QR Code ya bidhaa yako, kisha bonyeza link inayotokea ili kuhakiki taarifa.
  </>
)

  },
  {
    emoji: '🧾',
    title: '4. Hakiki taarifa kisha zitunze',
    description: `Kila utakapouza, au kuagiza mzigo mpya, au kutumia kitu kwenye biashara yako au kukopesha una scan QR Code ya bidhaa yako, halafu unabonyeza link itayokuja hapa utakuta sehemu ya kuhakiki kama ni mauzo, matumizi, madeni au kununua (ile ile bidhaa) kisha weka kiwango chako (stoku au hisa) kisha tuma taarifa.`,
  },
  {
    emoji: '📊',
    title: '5. Pata Faida na Ripoti',
    description: `Rudi mwanzoni mwa dashboard (Nyumbani), na utaona hesabu kamili — kila siku na ripoti zako utaziona. Hongera umefanikiwa kujua mfumo wetu. myPosTech - Biashara yako, Teknolojia yetu.`,
  },
  {
    emoji: '📱',
    title: '6. [Sio Lazima] Hakiki hesabu zako kwa calculator',
    description: `Tumekuwekea Calculator sehemu mbili, kwenye Dashboard na kwenye kuhakiki mauzo ili, kama unataka kuhakiki taarifa zako jisikie huru kufanya hivyo.`
  }
];

export const Steps = component$(() => {
  const openStepIndex = useSignal<number | null>(null);

  return (
    <>
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-6">Jinsi myPosTech Inavyofanya Kazi</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-8 text-sm md:text-base">
          Ni Hatua tano tu, kutumia mfumo wa myPosTech — kuanzia kuuza mpaka kupata ripoti ya faida!
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
            class="cursor-pointer flex flex-col items-center bg-white dark:bg-gray-500 rounded-xl shadow-md p-6 border border-gray-200 transition-all"
          >
            <div class="bg-blue-100 text-blue-700 rounded-full p-3 mb-4 text-xl">
              {step.emoji}
            </div>
            <h3 class="font-semibold text-lg mb-2 text-center flex items-center gap-2">
              {step.title}
            </h3>
            {openStepIndex.value === index ? '' : <p class="text-xs text-blue-500 mt-1">Bonyeza kuona zaidi ...</p> }

            {openStepIndex.value === index && (
              <p class="text-sm text-gray-600 dark:text-gray-300 text-center whitespace-pre-wrap">
                {step.description}
              </p>
            )}
          </div>
        ))}
      </div>
      </>
  );
});
