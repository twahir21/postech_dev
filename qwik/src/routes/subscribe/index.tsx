import { component$, useSignal, useComputed$, $, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { CrudService } from '../api/base/oop';
import type { PaymentRequest } from '../api/types/payTypes';
import { Toast } from '~/components/ui/Toast';

type PlanType = 'msingi' | 'lite';
type PaymentMethod = 'TIGO-PESA' | 'AIRTEL-MONEY';
type Duration = 1 | 6 | 12;

interface PlanDetails {
  name: string;
  monthly: number;
}

export default component$(() => {
  const location = useLocation();

  const modal = useStore({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  // Type-safe plan selection
  const params = new URLSearchParams(location.url.search);
  const plan = params.get('plan') as PlanType;
  const duration = useSignal<Duration>(1);
  const paymentMethod = useSignal<PaymentMethod>('TIGO-PESA');
  const isLoading = useSignal(false);

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


const isValidPlan = (plan: string): plan is PlanType =>
  ['msingi', 'lite'].includes(plan);

if (!isValidPlan(plan)) return (
  <div class="w-screen min-h-screen bg-blue-100 flex items-center justify-center">
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h1 class="text-2xl font-bold mb-4">Mpango haupo</h1>
      <p class="text-gray-600 mb-4">Tafadhali chagua mpango sahihi kutoka kwenye tovuti yetu.</p>
      <a href="/" class="text-blue-500 hover:underline">Rudi nyumbani</a>
    </div>
  </div>
);


  // Computed total with type safety
  const totalPrice = useComputed$(() => {
    const basePrice = planDetails[plan].monthly;
    const discount = discountRates[duration.value];
    return basePrice * duration.value * (1 - discount);
  });


  // Function to handle payment
  const handlePayment = $(async () => {
    isLoading.value = true;

    // 1. Generate Token
    const genTokenApi = new CrudService("mobile/generate-token");
    const tokenRes = await genTokenApi.get();

    if (!tokenRes.success) {
      modal.isOpen = true;
      modal.isSuccess = false;
      modal.message = tokenRes.message || 'Kuna hitilafu katika kupata tokeni ya malipo, tafadhali jaribu tena baadaye.';
      isLoading.value = false;
      return;
    }

    // 2. Check if USSD is available
    const payApi = new CrudService<PaymentRequest>("mobile/check-USSD");
    const checkResult = await payApi.create({ price: totalPrice.value, duration: duration.value, paymentMethod: paymentMethod.value, plan: plan });

    if (!checkResult.success) {
      modal.isOpen = true;
      modal.isSuccess = false;
      modal.message = checkResult.message || 'Huduma ya malipo ina hitilafu kwa sasa, tafadhali jaribu tena baadaye.';
      isLoading.value = false;
      return;
    }

    // 3. Initiate push USSD payment
    const payNowApi = new CrudService<PaymentRequest>("mobile/USSD-push");
    const payNowResult = await payNowApi.get();


    modal.isOpen = true;
    modal.isSuccess = payNowResult.success;
    modal.message = payNowResult.message || (payNowResult.success
      ? 'Malipo yameanzishwa kikamilifu. Tafadhali thibitisha kwenye simu yako.'
      : 'Tatizo kwenye mtandao wako, badili mtandao au jaribu baadae');

    isLoading.value = false;
  });

return (
  <>
      <div class="w-screen min-h-screen bg-blue-100">
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
                {(['TIGO-PESA', 'AIRTEL-MONEY'] as PaymentMethod[]).map((method) => (
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
                      src={`/${method === 'TIGO-PESA' ? 'yas.webp' : 'airtel.webp'}`} 
                      alt={method === 'TIGO-PESA' ? 'Tigo Pesa' : 'Airtel Money'} 
                      class={`w-23 h-auto ${method === 'TIGO-PESA' ? '' : 'w-20'} rounded-full`}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-700 p-4 rounded-lg mb-6">
              <p class="text-lg font-semibold text-center text-blue-950">
                Jumla ya kulipa: Tsh {totalPrice.value.toLocaleString()}/=
              </p>
            </div>

            <button
              class="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 text-white w-full py-3 rounded-lg font-semibold shadow-md hover:from-blue-900 hover:via-blue-700 hover:to-blue-500 transition-all duration-600"
              onClick$={() => handlePayment() } disabled={ isLoading.value }
            >
              { isLoading.value ?
              // Custom Loader
              <div class="inline-flex">
              <div class="loaderCustom"></div>
              </div> 
              : 'Fanya Malipo' }
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {modal.isOpen && (
        <Toast
          isOpen={modal.isOpen}
          type={modal.isSuccess}
          message={modal.message}
          onClose$={$(() => {
            modal.isOpen = false;
          })}
        />
      )}
  </>
);

});