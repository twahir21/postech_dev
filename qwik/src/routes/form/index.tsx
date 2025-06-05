import { component$, useStore } from '@builder.io/qwik';

export default component$(() => {
  const state = useStore({
    showPopup: false,
    amountPaid: '',
  });

  return (
    <div class="relative h-screen w-screen flex items-center justify-center">
      {/* Trigger Button */}
      <button
        onClick$={() => (state.showPopup = true)}
        class="bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        Pay
      </button>

      {/* Popup Overlay */}
      <div
        class={[
          'fixed inset-0 flex items-center justify-center z-50 transition-all duration-300',
          state.showPopup ? 'pointer-events-auto' : 'pointer-events-none',
        ]}
          onClick$={() => (state.showPopup = false)}

      >
        {/* Animated Box */}
        <div
          class={[
            'relative bg-white shadow-lg rounded-xl p-4 border transition-all duration-300 ease-out',
            state.showPopup
              ? 'scale-100 w-80 h-45 opacity-100'
              : 'scale-0 w-0 h-0 opacity-0',
          ]}
          style="transform-origin: center;"
              onClick$={(e) => e.stopPropagation()} // <-- don't close if inner box clicked

        >
            {/* Close button */}
            <button
            onClick$={() => (state.showPopup = false)}
            class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            aria-label="Close"
            >
            &times;
            </button>

          <form
            preventdefault:submit
            onSubmit$={() => {
              console.log('Amount paid:', state.amountPaid);
              state.showPopup = false;
            }}
            class="flex flex-col gap-4"
          >
            <label class="font-medium">Amount Paid</label>
            <input
            type="number"
            placeholder="Enter amount"
            class="border p-2 rounded"
            value={state.amountPaid}
            onInput$={(e) => {
                const target = e.target as HTMLInputElement;
                state.amountPaid = target.value;
            }}
            />

            <button
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});
