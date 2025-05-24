import { component$ } from '@builder.io/qwik';

export const Faqs = component$(() => {
  const faqs = [
    {
      question: 'PosTech ni nini hasa?',
      answer: 'PosTech ni mfumo wa kisasa wa kuuza na kusimamia biashara kupitia simu au kompyuta, unaosaidia kutunza kumbukumbu, kupata ripoti, na kuongeza faida.',
    },
    {
      question: 'Je, nahitaji intaneti kutumia PosTech?',
      answer: 'Hapana! PosTech inaweza kufanya kazi bila intaneti kwa kutumia PWA, hasa kwa vifurushi vya msingi na lite.',
    },
    {
      question: 'Naweza kulipa vipi kifurushi?',
      answer: 'Unaweza kulipa kupitia M-Pesa, Tigo Pesa, Airtel Money, au kwa maelezo zaidi wasiliana nasi WhatsApp.',
    },
    {
      question: 'Je, taarifa zangu ziko salama?',
      answer: 'Ndiyo, tunatunza taarifa zako kwa usalama wa hali ya juu na backup ya kila siku.',
    },
    {
      question: 'Naweza kubadilisha kifurushi baadaye?',
      answer: 'Ndiyo, unaweza kubadilisha au kupandisha kifurushi wakati wowote bila kupoteza data zako.',
    },
  ];

  return (
    <section class="bg-gray-50 text-gray-800 py-10 px-4 dark:bg-gray-800">
      <h2 class="text-center text-2xl font-bold mb-6">Maswali Yanayoulizwa Sana (FAQ)</h2>
      <div class="max-w-2xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} class="bg-white dark:bg-gray-500 rounded-lg shadow-sm p-4 group">
            <summary class="font-semibold cursor-pointer text-base group-open:text-green-600 dark:group-open:text-gray-300">
              {faq.question}
            </summary>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-900 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
});
