import { component$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const navigateTo = useNavigate();
  return (
<div class="bg-gray-100 text-gray-800">
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-7">Chagua Kifurushi cha Biashara Yako kwa mwezi</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* <!-- myPostech Msingi --> */}
      <div class="bg-green-50 rounded-2xl shadow p-6 flex flex-col border-2 border-green-700 self-start">
        <h2 class="text-xl font-bold text-green-600 mb-2">myPostech Msingi</h2>
        <p class="text-sm text-gray-600">Kwa duka dogo la mtaa, mama ntilie, kibanda</p>
        <p class="text-2xl font-bold mt-4">Tsh 5,000/= <span class="text-sm text-gray-500">kwa mwezi</span></p>
        <ul class="mt-4 space-y-2 text-sm">
          <li>✔ Mauzo kupitia QR Code za bidhaa</li>
          <li>✔ Kurekodi mauzo kiotomatiki</li>
          <li>✔ Ripoti za matumizi, faida na mauzo kwa mwezi mmoja</li>
          <li>✔ Kutunza Kumbukumbu mwezi mmoja</li>
          <li>✔ Mpaka aina za bidhaa 50</li>
          <li>✔ Matumizi hata bila bando na myPosTech App (PWA)</li>

        </ul>

        <button class="bg-gradient-to-r from-green-500 via-green-700 to-green-900 text-white text-sm font-semibold py-2 rounded-lg transition mt-4 cursor-pointer"
          onClick$={() => navigateTo('/subscribe?plan=msingi')}
        >
            Chagua Kifurushi
        </button>
      </div>

      {/* <!-- myPostech Lite --> */}
      <div class="bg-blue-50 rounded-2xl shadow p-6 flex flex-col border-2 border-blue-700 self-start">
        <h2 class="text-xl font-bold text-blue-600 mb-2">myPostech Lite</h2>
        <p class="text-sm text-gray-600">Duka lenye bidhaa nyingi, linaendeshwa na mtu 1 au 2</p>
        <p class="text-2xl font-bold mt-4">Tsh 15,000/= <span class="text-sm text-gray-500">kwa mwezi</span></p>
        <ul class="mt-4 space-y-2 text-sm">
          <li>⭐ Kifurushi cha myPosTech Msingi</li>
          <li>✔ Uwezo wa kufanya mauzo kwa mkopo (deni)</li>
          <li>✔ Ripoti za mkopo (deni), yupi anadaiwa sana, yupi kwa muda mrefu, n.k.</li>
          <li>✔ Ripoti za kila siku na wiki</li>
          <li>✔ Kutunza Kumbukumbu miezi 3</li>
          <li>✔ Kujua bidhaa inayoulizwa sana</li>
          <li>✔ Mpaka aina za bidhaa 300</li>
          <li>✔ Kufanya matunzo ya taarifa za mauzo kwenye simu (CSV backup)</li>

        </ul>
        <button class="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 text-white text-sm font-semibold py-2 rounded-lg transition mt-4 cursor-pointer"
          onClick$={() => navigateTo('/subscribe?plan=lite')}
        >
            Chagua Kifurushi
        </button>

      </div>

      {/* <!-- myPostech Pro --> */}
      <div class="bg-purple-50 rounded-2xl shadow p-6 flex flex-col border-2 border-purple-700 self-start">
        <h2 class="text-xl font-bold text-purple-600 mb-2">myPostech Pro</h2>
        <p class="text-sm text-gray-600">Kwa supermarket ndogo au duka kubwa</p>
        <p class="text-2xl font-bold mt-4">Tsh 30,000/= <span class="text-sm text-gray-500">kwa mwezi</span></p>
        <ul class="mt-4 space-y-2 text-sm">
          <li>⭐ Kifurushi cha myPosTech Lite </li>
          <li>✔ Usimamizi na usajili wa wafanyakazi wote</li>
          <li>✔ Taarifa za hisa (stock) na bidhaa zinazouzwa zaidi</li>
          <li>✔ Ripoti za kila siku, wiki, mwezi</li>
          <li>✔ Kujua bidhaa zilizo-expire</li>
          <li>✔ Risiti za madeni</li>
          <li>✔ Kuratibu bidhaa zilizorudishwa</li>
          <li>✔ Kutunza Kumbukumbu miezi 6</li>
          <li>✔ Mpaka aina za bidhaa 1500</li>
          <li>✔ Kutuma taarifa kama kuna bidhaa imekwisha au ipo chini sana</li>
          <li>✔ Kumbukumbu za QR Code za nyuma</li>
        </ul>

        {/* <button class="bg-gradient-to-r from-purple-500 via-purple-700 to-purple-900 text-white text-sm font-semibold py-2 rounded-lg transition mt-4">
            Chagua Kifurushi
        </button> */}
        <button
          class="bg-gray-300 text-gray-500 text-sm font-semibold py-2 rounded-lg cursor-not-allowed mt-4"
          disabled
        >
          Inatengenezwa...
        </button>

      </div>

      {/* <!-- myPostech Business --> */}
      <div class="bg-red-50 rounded-2xl shadow p-6 flex flex-col border-2 border-red-700 self-start">
        <h2 class="text-xl font-bold text-red-600 mb-2">myPostech Business</h2>
        <p class="text-sm text-gray-600">Kwa biashara kubwa au zenye matawi</p>
        <p class="text-2xl font-bold mt-4">Tsh 50,000/= <span class="text-sm text-gray-500">kwa mwezi</span></p>
        <ul class="mt-4 space-y-2 text-sm">
          <li>⭐ Kifurushi cha myPosTech Pro</li>
          <li>✔ Mfumo wa matawi mengi</li>
          <li>✔ Duka lipi linatengeneza faida kubwa</li>
          <li>✔ Ripoti ya mfanyakazi aliyetengeneza faida kubwa</li>
          <li>✔ Ulinganisho wa mauzo kati ya matawi</li>
          <li>✔ Kutunza Kumbukumbu mwaka mzima</li>
          <li>✔ Lugha zaidi ya moja</li>
          <li>✔ Hakuna ukomo wa kusajili bidhaa</li>
          <li>✔ Usaidizi wa kiufundi na mafunzo kwa wafanyakazi</li>
          <li>✔ Kupata meseji automatiki ya orodha ya bidhaa zilizoisha </li>
        </ul>

        {/* <button class="bg-gradient-to-r from-red-500 via-red-700 to-red-900 text-white text-sm font-semibold py-2 rounded-lg transition mt-4">
            Chagua Kifurushi
        </button> */}
        <button
          class="bg-gray-300 text-gray-500 text-sm font-semibold py-2 rounded-lg cursor-not-allowed mt-4"
          disabled
        >
          Inatengenezwa...
        </button>

      </div>

      {/* <!-- myPostech AI --> */}
      <div class="bg-stone-50 rounded-2xl shadow p-6 flex flex-col border-2 border-stone-700 self-start">
        <h2 class="text-xl font-bold text-stone-600 mb-2">myPostech AI</h2>
        <p class="text-sm text-gray-600">Kwa biashara yoyote inayotaka matumizi ya AI</p>
        <p class="text-2xl font-bold mt-4">Tsh 100,000/= <span class="text-sm text-gray-500">kwa mwezi</span></p>
        <ul class="mt-4 space-y-2 text-sm">
          <li>⭐ Kifurushi cha myPosTech Business</li>
          <li>✔ AI kukupa kipi cha kuagiza na lini ?</li>
          <li>✔ AI kukupa bei inayofaa zaidi sokoni</li>
          <li>✔ Kutunza Kumbukumbu miaka 2</li>
          <li>✔ AI kwa ajili ya kutabiri mauzo na kuangalia kama biashara inakua</li>
          <li>⭐⭐⭐ myPostech vision seller (Advanced AI and computer vision)</li>
        </ul>
        {/* 
        <button class="bg-gradient-to-r from-stone-500 via-stone-700 to-stone-900 text-white text-sm font-semibold py-2 rounded-lg transition mt-4">
            Chagua Kifurushi
        </button> 
        */}
        <button
          class="bg-gray-300 text-gray-500 text-sm font-semibold py-2 rounded-lg cursor-not-allowed mt-4"
          disabled
        >
          Inatengenezwa...
        </button>

      </div>
    </div>
        <div class="mt-12 text-center text-gray-600">
        <p class="font-semibold mb-5">
            Unahitaji msaada au maelezo zaidi? Wasiliana na timu yetu ya msaada!
        </p>
        <a
            href="https://wa.me/255674291587"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-xl shadow transition"
        >
            📲 Ingia WhatsApp
        </a>
        </div>

  </div>
</div>
  );
});
