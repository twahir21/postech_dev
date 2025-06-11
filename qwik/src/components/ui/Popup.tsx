import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { CrudService } from '~/routes/api/base/oop';
import { Toast } from './Toast';
import { RefetchContext } from '../context/refreshContext';

export const Popup = component$(({ customerId, debtId }: { customerId: string; debtId: string }) => {
  const state = useStore({
    showPopup: false,
    amountPaid: '',
  });

  const modal = useStore({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  const { debtRefetch } = useContext(RefetchContext);

  const sendData = $(async () => {
    const newAPi = new CrudService<{ id?: string; amountPaid: number, customerId: string; debtId: string }>("pay-debt");

    const res = await newAPi.create({ amountPaid: Number(state.amountPaid), customerId, debtId });
    
    modal.isOpen = true;
    modal.isSuccess = res.success;
    modal.message = res.message || (res.success ? "Imefanikiwa" : "Imeshindwa kubadili taarifa");

    // trigger refetch
    debtRefetch.value = true;
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
            onSubmit$={async () => {
              await sendData();
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


    </div>
  );
});
