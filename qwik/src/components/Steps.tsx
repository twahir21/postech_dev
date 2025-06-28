import { component$, useSignal } from '@builder.io/qwik';

interface Step {
  emoji: string;
  title: string;
  description: string;
}

const steps: Step [] = [
  {
    emoji: '📥',
    title: '1. Sajili bidhaa zako.',
    description: `Jisajili bure siku 14 za mwanzo kisha ingia kwenye dashboard. Bonyeza kitufe cha "Anza hapa" kisha Sajili bidhaa moja tu kwa kila aina na msambazaji wake. mfano: sajili cocacola kutoka bonite mara 1 kisha hamia soda nyingine.
    👉 Kama bidhaa mpya imekuja baadaye, isajili kwanza au kama bei imebadilika badili kwenye rekodi ya bidhaa.`,
  },
  {
    emoji: '🎤',
    title: '2. Tumia mic kufanya mauzo, manunuzi au matumizi au kukopesha.',
    description: `Bonyeza kitufe cha ℹ️ kisha soma utaratibu wote, kisha bonyeza kitufe cha 🎙️ kuanza kurekodi kilichofanyika, au kama sauti changamoto tumia text kwa kubonyeza kitufe cha ✍️.`
  },
  {
    emoji: '🧾',
    title: '3. Hakiki taarifa kisha zitunze',
    description: `Hakiki kama taarifa au sentensi uliojaza ndio inayotakiwa kisha tuma ili kurekodi. Rudia hatua namba mbili na tatu kila unapofanya mauzo, manunuzi (ya bidhaa uliosajili), matumizi au kukopesha. Kama ni kukopesha sajili mteja kwanza`,
  },
  {
    emoji: '📊',
    title: '4. Pata Faida na Ripoti',
    description: `Rudi mwanzoni mwa dashboard (Nyumbani), na utaona hesabu kamili — kila siku na ripoti zako utaziona. Hongera umefanikiwa kujua mfumo wetu. myPosTech - Biashara yako, Teknolojia yetu.`,
  },
  {
    emoji: '📱',
    title: '5. [Sio Lazima] Hakiki hesabu zako kwa calculator',
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
