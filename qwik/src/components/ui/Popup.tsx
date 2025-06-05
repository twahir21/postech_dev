import { component$, useStore } from '@builder.io/qwik';

export const Popup = component$(() => {
  const state = useStore({
    showPopup: false,
    amountPaid: '',
  });

  return (
    <div class="h-auto w-auto flex items-center justify-center">
      {/* Trigger Button */}
      <button
        onClick$={() => (state.showPopup = true)}
        class="mt-3 text-sm md:text-base bg-teal-600 hover:bg-teal-700 text-white py-1.5 px-4 rounded-md self-start"
      >
        Ongeza Malipo
      </button>

      {/* Popup Overlay */}
      <div
        class={[
          'absolute inset-0 z-50 transition-all flex align-center justify-center duration-300',
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
            <label class="font-medium">Kiwango cha kulipa: </label>
            <input
            type="number"
            placeholder="e.g. 20,000"
            class="border p-2 rounded"
            value={state.amountPaid}
            onInput$={(e) => {
                const target = e.target as HTMLInputElement;
                state.amountPaid = target.value;
            }}
            />

            <button
              type="submit"
              class="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Hifadhi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});
