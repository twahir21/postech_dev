import { component$ } from '@builder.io/qwik';

export const Testimonials =  component$(() => {
  const testimonials = [
    {
      name: 'Asha M.',
      role: 'Mama Ntilie - Dodoma',
      quote: 'myPosTech imenisaidia kurekodi mauzo yangu bila stress. Sasa najua faida na matumizi kila siku!',
      image: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    {
      name: 'Juma K.',
      role: 'Mmiliki wa Duka - Arusha',
      quote: 'Kifurushi cha Lite kimenifanya niwe na ripoti sahihi za deni. Biashara imekua kwa kasi!',
      image: 'https://randomuser.me/api/portraits/men/40.jpg',
    },
    {
      name: 'Fatma L.',
      role: 'Supermarket Manager - Mwanza',
      quote: 'Postech Pro ni kama kuwa na msaidizi wa IT. Hisa, wafanyakazi, kila kitu kiko wazi!',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  ];

  return (
    <section class="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-400 py-10 px-4">
      <h2 class="text-center text-2xl font-bold mb-8">Walisema Nini Kuhusu myPosTech?</h2>
      <div class="space-y-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:space-y-0">
        {testimonials.map((t, i) => (
          <div key={i} class="bg-gray-100 dark:bg-gray-400 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <div class="flex items-center space-x-4 mb-4">
              <img src={t.image} alt={t.name} class="w-12 h-12 rounded-full object-cover" height="48" width="48" />
              <div>
                <p class="font-semibold dark:text-black">{t.name}</p>
                <p class="text-sm text-gray-500 dark:text-gray-900">{t.role}</p>
              </div>
            </div>
            <p class="text-sm text-gray-700 italic">“{t.quote}”</p>
          </div>
        ))}
      </div>
    </section>
  );
});
