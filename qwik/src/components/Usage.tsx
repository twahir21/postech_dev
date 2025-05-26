import { component$ } from '@builder.io/qwik';

export const UsageComponent = component$(() => {
  return (
    <div class="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Kichwa cha Mfumo */}
      <h1 class="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-6 animate-bounce text-primary z-10">
      💼 POSTECH - Mfumo wa Kisasa wa Biashara
      </h1>


      {/* Maelezo ya Awali */}
      <p class="text-lg text-gray-700 leading-relaxed mb-4 animate-fade-in">
        Karibu kwenye mfumo wa <strong>myPosTech</strong> – suluhisho la kidigitali linalobadilisha jinsi biashara zinavyoendeshwa Afrika Mashariki. Mfumo huu umetengenezwa kwa teknolojia nyepesi lakini zenye nguvu, ukiwa na lengo la kurahisisha shughuli za kila siku za wafanyabiashara wa rejareja na jumla.
      </p>

        {/* Hatua za Kuanza Kutumia myPosTech */}
        <div class="bg-teal-100 p-4 rounded-xl shadow-md mb-6">
        <h2 class="text-2xl font-semibold mb-1 text-teal-800 flex items-center gap-2">
        📘 Hatua za Kuanza Kutumia myPosTech
        </h2>
        <p class="text-sm text-teal-700 italic mb-3">
        Bonyeza hatua ili kufungua maelezo zaidi
        </p>


            <div class="divide-y divide-teal-300">
                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">①</span>
                    Sajili bidhaa na wauzaji
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    Bonyeza <strong>Anza Hapa</strong>, jaza fomu ya wauzaji (suppliers), kategoria, kisha <button class="text-sm text-white bg-teal-600 px-2 py-0.5 rounded">Sajili bidhaa</button> na hisa zake zote.
                </div>
                </details>

                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">②</span>
                    Tengeneza QR Code
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    Bonyeza kitufe cha <button class="text-sm text-white bg-blue-600 px-2 py-0.5 rounded">Tengeneza QR Code</button>. Faili litapakuliwa likiwa na QR Code zote za bidhaa zako.
                </div>
                </details>

                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">③</span>
                    Tunza QR Codes
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    Bandika QR Code kwenye bidhaa au sehemu nzuri kwa ajili ya kufanya mauzo au manunuzi haraka.
                </div>
                </details>

                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">④</span>
                    Scan na Tuma taarifa
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    <button class="text-sm text-white bg-green-600 px-2 py-0.5 rounded">Scan QR Code</button> ya bidhaa husika kutumia Google lens, jaza taarifa za kuuza, kununua au kutumia, kisha tuma.
                </div>
                </details>

                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">⑤</span>
                    Tazama Takwimu
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    Fuatilia takwimu za biashara yako: faida, mwenendo wa mauzo, bidhaa bora kupitia dashboard.
                </div>
                </details>

                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">⑥</span>
                    Ongeza wateja
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    Tembelea sehemu ya <button class="text-sm text-white bg-purple-600 px-2 py-0.5 rounded">Orodha ya Wateja</button> kuongeza majina ya wateja kwa ajili ya ukopeshaji.
                </div>
                </details>

                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">⑦</span>
                    Futa bidhaa zisizohitajika
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    Unaweza <button class="text-sm text-white bg-red-600 px-2 py-0.5 rounded">Futa Bidhaa</button> kwa urahisi kupitia dashbodi.
                </div>
                </details>

                <details class="py-3 group">
                <summary class="cursor-pointer flex items-center gap-2 text-teal-800 font-medium group-open:text-teal-900">
                    <span class="text-lg">⑧</span>
                    Tumia Calculator
                </summary>
                <div class="mt-2 text-gray-800 pl-7">
                    Calculator inapatikana baada ya kuscan au moja kwa moja kwenye dashboard kwa mahesabu ya haraka.
                </div>
                </details>
            </div>
        </div>


      {/* Animations kwa Scroll */}
      <div class="bg-purple-100 p-4 rounded-xl shadow-md mb-6 animate-fade-in-scroll">
        <h2 class="text-2xl font-semibold mb-2 text-purple-800">
          🪄 Mbinu za Kipekee
        </h2>
        <ul class="list-disc list-inside text-gray-700">
          <li>Msaada wa lugha nyingi (Kiswahili, Kiingereza, Kifaransa, Kiarabu).</li>
          <li>QR Code ya kuchakata mauzo bila kuandika tena data.</li>
          <li>Urahisi wa kutumia hata kwa wafanyabiashara wasiobobea na tech.</li>
          <li>Trial ya siku 14 bure kwa watumiaji wapya.</li>
          <li>Kuweza kuongoza biashara zaidi ya moja kiurahisi (itakuja hivi karibuni ...)</li>
          <li>Kuweza kujua mfanyakazi gani ametengeneza faida zaidi kwenye biashara yako (itakuja hivi karibuni ...)</li>
          <li>Kuunganisha biashara yako na akili mnemba Artificial Intelligence (itakuja hivi karibuni ...) ili kuangalia utendaji kazi wa biashara na jinsi ya kuzalisha pesa nyingi kwa haraka</li>
        </ul>
      </div>

      {/* Teknolojia Zilizotumika */}
      <div class="bg-blue-100 p-4 rounded-xl shadow-md mb-6 animate-slide-in-left">
        <h2 class="text-2xl font-semibold mb-2 text-blue-800">
          ⚙️ Teknolojia Zilizotumika
        </h2>
        <ul class="list-disc list-inside text-gray-700">
          <li><strong>Qwik</strong>: Frontend framework ya kasi kubwa na SEO friendly.</li>
          <li><strong>Tailwind CSS</strong>: Kutengeneza UI ya kisasa na responsive.</li>
          <li><strong>Bun</strong>: Runtime ya JavaScript yenye kasi sana.</li>
          <li><strong>Elysia.js</strong>: REST API backend iliyorahisishwa na JWT auth, yenye kasi zaidi duniani (baada ya Rust na Golang).</li>
          <li><strong>PostgreSQL</strong> + <strong>Drizzle ORM</strong>: Database ya biashara na ORM rahisi kutumia.</li>
        </ul>
      </div>

      {/* Footer */}
      <p class="text-center text-sm text-gray-500 mt-12">
        &copy; 2025 POSTECH - Mfumo wa Biashara wa Kisasa 🌍 <span class="italic"> ~ By BlackCoder</span>
      </p>
    </div>
  );
});
