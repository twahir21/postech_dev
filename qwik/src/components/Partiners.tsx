import { component$ } from "@builder.io/qwik";

export const Partiners = component$(() => {
    return <>
<section class="bg-gray-200 py-16 px-6 text-center">
  <h2 class="text-3xl font-bold mb-4 text-gray-800">myPostech Inapatikana Wapi?</h2>
  <p class="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
    Kwa sasa myPostech inapatikana <strong>Tanzania</strong> nzima 🇹🇿, inafanya kazi bila intaneti kupitia App yetu (PWA) na inaunga mkono malipo papo kwa papo kupitia <strong>clickPesa</strong>.
  </p>

  <div class="flex justify-center flex-wrap gap-3 mb-8">
    <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">Tanzania</span>
    <span class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm">Mikoa yote</span>
    <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">Inafanya kazi bila bando</span>
    <span class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm">Lugha: Kiswahili</span>
    <span class="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm">Sarafu: TZS</span>
  </div>

  <h3 class="text-lg font-semibold mb-4 text-gray-700">Powered by:</h3>
  <div class="flex justify-center items-center gap-6 flex-wrap">
    <img src="/clickpesa.webp" alt="clickPesa" class="h-8" />
    <img src="/vercel.webp" alt="Vercel" class="h-6" />
    <img src="/elysia.webp" alt="Elysia.js" class="h-6" />
    <img src="/drizzle.webp" alt="Drizzle ORM" class="h-6" />
    <img src="/bun.webp" alt="Bun" class="h-6" />
    <img src="/vite.svg" alt="Vite" class="h-6" />
    <img src="/qwik.webp" alt="Qwik" class="h-6" />
  </div>

  <div class="mt-12 animate-pulse text-xl font-semibold text-gray-700">
    🚀 Coming soon to <span class="text-green-600">Kenya</span> 🇰🇪 & <span class="text-yellow-600">Uganda</span> 🇺🇬
  </div>
</section>

    </>
})