import { component$ } from '@builder.io/qwik';

export const Pains =  component$(() => {
  return (
    <section class="bg-white py-10 px-4 text-gray-800 dark:bg-gray-500">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl md:text-3xl font-bold mb-6">
          Changamoto za Wamiliki wa Biashara na Jinsi myPosTech Inavyosaidia
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-6xl mx-auto">
        {/* Problems */}
        <div class="bg-red-50 dark:bg-gray-400 rounded-xl p-6 shadow-md border-2 border-red-300">
          <h3 class="text-xl font-semibold text-red-600 mb-4 dark:text-red-900">🔴 Changamoto za Wafanyabiashara</h3>
          <ul class="space-y-3 text-sm md:text-base">
            <li>• Kukosa njia rahisi ya kurekodi mauzo kila siku</li>
            <li>• Kushindwa kujua faida halisi au hasara</li>
            <li>• Kukosa takwimu hivyo wafanyabiashara kushindwa kujua biashara kushuka au kukua kiasi gani.</li>
            <li>• Kusahau madeni ya wateja au bidhaa zilizouzwa kwa mkopo</li>
            <li>• Biashara kuharibika kutokana na kutokuwepo na kumbukumbu</li>
            <li>• Kutokuwa na mfumo unaofanya kazi bila intaneti</li>
            <li>• Kupoteza muda kwa kuandika kumbukumbu kwa mkono</li>
            <li>• Ugumu wa kukumbuka bei hasa kama muuzaji ni mpya</li>
            <li>• Ugumu wa kujua bidhaa ipi ina faida zaidi ili kuiongeza zaidi</li>
            <li>• Kukosa orodha ya bidhaa zilizokwisha.</li>

          </ul>
        </div>

        {/* Solutions */}
        <div class="bg-green-50 dark:bg-gray-400 rounded-xl p-6 shadow-md border-2 border-green-300">
          <h3 class="text-xl font-semibold text-green-700 dark:text-green-900 mb-4">✅ myPosTech Inatatua Kwa Urahisi</h3>
          <ul class="space-y-3 text-sm md:text-base">
            <li>✔ Kurekodi mauzo kwa kuscan QR ya bidhaa</li>
            <li>✔ Kuonyesha faida, hasara na matumizi kwa muda halisi</li>
            <li>✔ Kufuatilia madeni na kumbukumbu za kila mteja</li>
            <li>✔ Kuhifadhi taarifa zote salama hata bila bando</li>
            <li>✔ Mtumiaji anaweza kutumia simu tu kuendesha kila kitu!</li>
            <li>✔ Kupata orodha ya bidhaa mara tu zitakapoisha</li>
            <li>✔ Uchunguzi wa kina kwenye madeni bila madaftari na kwa urahisi zaidi</li>
            <li>✔ Hakuna haja ya kukumbuka bei kila kitu kinenda kiotomatiki</li>
            <li>✔ Hapata ripoti ya kila kitu unataka tena kwa wakati</li>
          </ul>
        </div>
      </div>
    </section>
  );
});
