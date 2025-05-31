import { component$, useSignal, useComputed$, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';

type PlanType = 'msingi' | 'lite';
type PaymentMethod = 'tigopesa' | 'airtelmoney';
type Duration = 1 | 6 | 12;

interface PlanDetails {
  name: string;
  monthly: number;
}

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();

  // Type-safe plan selection
  const plan = location.url.searchParams.get('plan') as PlanType;
  const duration = useSignal<Duration>(1);
  const paymentMethod = useSignal<PaymentMethod>('tigopesa');

  // Type-safe plan details
  const planDetails: Record<PlanType, PlanDetails> = {
    msingi: { name: 'myPostech Msingi', monthly: 5000 },
    lite: { name: 'myPostech Lite', monthly: 15000 },
  };

  // Type-safe discount rates
  const discountRates: Record<Duration, number> = { 
    1: 0, 
    6: 0.05, 
    12: 0.15 
  };

  // Validate plan on client-side
  useVisibleTask$(() => {
    if (typeof plan !== 'string' || !['msingi', 'lite'].includes(plan)) {
      nav('/subscribe?plan=msingi', { replaceState: true });
    }
  });

  // Computed total with type safety
  const totalPrice = useComputed$(() => {
    const monthly = planDetails[plan].monthly;
    const discount = discountRates[duration.value];
    return monthly * duration.value * (1 - discount);
  });

  return (
    <div class="max-w-xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-center">Chagua Mpango wa Malipo</h1>

      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 class="text-xl font-semibold text-green-700 mb-2">
          {planDetails[plan].name}
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          Bei ya kila mwezi: Tsh {planDetails[plan].monthly.toLocaleString()}
        </p>

        <div class="mb-4">
          <label class="block mb-2 font-medium text-gray-700">Chagua muda:</label>
          <select
            class="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onChange$={(e) => duration.value = Number((e.target as HTMLSelectElement).value) as Duration}
          >
            <option value={1} selected={duration.value === 1}>Mwezi 1 - Hakuna punguzo</option>
            <option value={6} selected={duration.value === 6}>Miezi 6 - Punguzo 5%</option>
            <option value={12} selected={duration.value === 12}>Miezi 12 - Punguzo 15%</option>
          </select>
        </div>

        <div class="mb-6">
          <label class="block mb-2 font-medium text-gray-700">Chagua njia ya malipo:</label>
          <div class="flex flex-wrap gap-4">
            {(['tigopesa', 'airtelmoney'] as PaymentMethod[]).map((method) => (
              <label key={method} class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value={method}
                  checked={paymentMethod.value === method}
                  onChange$={() => paymentMethod.value = method}
                  class="h-5 w-5 text-green-600 focus:ring-green-500"
                />
                <img 
                  src={`/${method === 'tigopesa' ? 'yas.png' : 'airtel.jpg'}`} 
                  alt={method === 'tigopesa' ? 'Tigo Pesa' : 'Airtel Money'} 
                  class={`w-23 h-auto ${method === 'tigopesa' ? '' : 'w-20'} rounded-full`}
                />
              </label>
            ))}
          </div>
        </div>

        <div class="bg-gray-50 border border-gray-700 p-4 rounded-lg mb-6">
          <p class="text-lg font-semibold text-center text-purple-700">
            Jumla ya kulipa: Tsh {totalPrice.value.toLocaleString()}
          </p>
        </div>

        <button
          class="bg-gradient-to-r from-green-500 via-green-700 to-green-900 text-white w-full py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-800 transition-all duration-300"
          onClick$={() => console.log('Proceeding to payment...')}
        >
          Endelea na Malipo
        </button>
      </div>
    </div>
  );
});