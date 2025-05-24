import { component$ } from '@builder.io/qwik';

export const Dash = component$(() => {
  return (
    <section class="bg-white py-10 px-4 text-gray-800">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Textual content */}
        <div class="space-y-5">
          <h2 class="text-2xl md:text-3xl font-bold leading-snug">
            Pakia biashara yako kwa <span class="text-green-600">Tsh 5,000 tu</span>
          </h2>
          <p class="text-gray-600 text-sm md:text-base">
            Anza kutumia mfumo wa kisasa wa kuuza, kutunza kumbukumbu na kupata ripoti kwa bei nafuu kabisa.
          </p>

          <a
            href="/pricing"
            class="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow"
          >
            🚀 Anza Sasa
          </a>

          <div class="mt-6 flex items-start gap-3">
            <span class="text-green-700 text-xl">🔒</span>
            <p class="text-sm text-gray-600">
              <strong>Data yako iko salama</strong> – tunatumia teknolojia ya kisasa kuhifadhi taarifa zako kwa usiri kamili.
            </p>
          </div>
        </div>

        {/* Right: Responsive image previews */}
        <div class="flex justify-center">
          {/* Mobile screenshot (visible only on small screens) */}
          <img
            src="/mobile.png"
            alt="Screenshot ya simu"
            class="block md:hidden rounded-xl shadow-md w-52"
            loading="lazy"
          />
          {/* Desktop screenshot (visible only on medium and up) */}
          <img
            src="/desktop.png"
            alt="Screenshot ya dashboard"
            class="hidden md:block rounded-xl shadow-md w-full max-w-md"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
});


