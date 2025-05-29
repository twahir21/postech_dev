import { component$, useSignal } from "@builder.io/qwik";

export default component$(() => {
  const original = useSignal(5000);
  const discounted = 4000;

  const sixMonthTotal = original.value * 6;
  const twelveMonthTotal = discounted * 12;

  return (
    <div class="p-4 max-w-md mx-auto text-sm sm:text-base">
      <h2 class="text-xl font-bold mb-2 text-center">Lipia Kifurushi</h2>

      <label class="block mb-2 text-gray-700">Kiasi kwa mwezi:</label>
      <input
        type="number"
        bind:value={original}
        class="w-full px-4 py-2 border rounded-lg focus:outline-none"
        min={1000}
      />

      <div class="mt-4 bg-gray-50 p-4 rounded-lg shadow">
        <p class="mb-2">Miezi 6 bila punguzo: <strong>{sixMonthTotal} TZS</strong></p>
        <p class="mb-2 text-green-700 font-semibold">
          Miezi 12 kwa punguzo: <strong>{twelveMonthTotal} TZS</strong>
        </p>
      </div>

      <div class="mt-6 flex flex-col gap-3">
        <button class="bg-yellow-500 text-white font-bold py-2 rounded-lg shadow hover:bg-yellow-600">
          Lipia kwa TigoPesa
        </button>
        <button class="bg-red-600 text-white font-bold py-2 rounded-lg shadow hover:bg-red-700">
          Lipia kwa Airtel Money
        </button>
      </div>
    </div>
  );
});
