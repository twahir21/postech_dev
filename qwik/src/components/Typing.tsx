import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { SendIcon } from 'lucide-qwik';
import { CrudService } from '~/routes/api/base/oop';
import { Toast } from './ui/Toast';
import { RefetchContext } from './context/refreshContext';

export const Typing = component$(() => {
  const inputText = useSignal('');
  const suggestions = useSignal<string[]>([]);
  const showSuggestions = useSignal(false);
  const showPopup = useSignal(false);
  const isLoading = useSignal(false);


  const modal = useStore({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  const { refetchAnalytics } = useContext(RefetchContext);
  

const fetchSuggestions = $(async (query: string, type: 'product' | 'customer') => {
  const api = new CrudService(
    type === 'product'
      ? `productSearch?search=${encodeURIComponent(query)}`
      : `customerSearch?search=${encodeURIComponent(query)}`
  );
  const result = await api.get();

  if (!result.success) {
    suggestions.value = [];
    return;
  }

  const data = result.data;
  suggestions.value = data.map((item: any) => item.name);
  showSuggestions.value = true;
});


const handleKeyUp = $(async () => {
  const words = inputText.value.trim().split(/\s+/);

  // Autocomplete logic (same as before)
  const prefix = words[0];
  const totalWords = words.length;

  if (prefix === 'nimemkopesha') {
    if (totalWords === 2 && words[1].length >= 2) {
      await fetchSuggestions(words[1], 'customer');
    } else if (totalWords === 3 && words[2].length >= 2) {
      await fetchSuggestions(words[2], 'product');
    }
  } else {
    if (totalWords === 2 && words[1].length >= 2) {
      await fetchSuggestions(words[1], 'product');
    }
  }

});





const selectSuggestion = $((name: string) => {
  const words = inputText.value.trim().split(/\s+/);
  const prefix = words[0];
  const totalWords = words.length;

  let targetIndex = 1; // Default to product position

  if (prefix === 'nimemkopesha') {
    // If only 2 words typed → assume customer name
    // If 3 words typed → assume product name
    targetIndex = totalWords === 2 ? 1 : 2;
  }

  if (words.length > targetIndex) {
    words[targetIndex] = name;
  } else {
    while (words.length <= targetIndex) words.push('');
    words[targetIndex] = name;
  }

  inputText.value = words.join(' ');
  showSuggestions.value = false;
});


  const handleSubmit = $(async () => {
    isLoading.value = true;

    const text = inputText.value.trim();

    const api = new CrudService<{ id?: string; text: string }>("speech");

    const result = await api.create({ text });

    modal.isOpen = true;
    modal.isSuccess = result.success;
    modal.message = result.message || (result.success ? 'Umefanikiwa' : 'Hitilafu imetokea, jaribu baadae');


    showPopup.value = false;
    isLoading.value = false;
  });

  // popup
  const togglePopup = $(() => {
    showPopup.value = !showPopup.value;
  });

  return (
    <>
      <button
        onClick$={togglePopup}
        class="text-xl pt-0.5 mt-1.5"
        title="Oda moja..."
      >
        🚀
      </button>

      {showPopup.value && <div class="fixed top-16 right-0 w-full max-w-sm bg-[#EEEFE0] border p-4 rounded-xl shadow-md z-50">
      {/* Action Buttons (same as before) */}
      <div class="flex flex-wrap gap-2 pb-3">
        {['nimeuza', 'nimenunua', 'nimetumia', 'nimemkopesha'].map((prefix, index) => {
          const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
          return (
            <button
              key={prefix}
              onClick$={() => {
                const existing = inputText.value.toLowerCase().split(' ');
                const rest = existing.slice(1).join(' ');
                inputText.value = `${prefix} ${rest}`;
              }}
              class={`${colors[index]} text-white px-3 py-1 rounded`}
            >
              {prefix}
            </button>
          );
        })}
      </div>


      {/* Textarea + Autocomplete Dropdown */}
      <div class="relative">
        <textarea
          placeholder="Mfano: nimemkopesha ali maziwa lita kumi na sita au nimeuza ngano kilo 2"
          bind:value={inputText}
          rows={3}
          class="w-full p-2 rounded border text-lg bg-white"
          onKeyUp$={handleKeyUp}
        />

        {showSuggestions.value && suggestions.value.length > 0 && (
          <ul class="absolute left-0 w-full bg-white shadow rounded border max-h-40 overflow-auto z-50">
            {suggestions.value.map((name) => (
              <li
                key={name}
                class="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick$={() => selectSuggestion(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div class="flex justify-between items-center mt-3">
        <button onClick$={togglePopup} title='Funga'>❌</button>
        <button onClick$={handleSubmit} title="Tuma" disabled={isLoading.value}><SendIcon /></button>
      </div>

    </div>}

      {modal.isOpen && (
        <Toast
          isOpen={modal.isOpen}
          type={modal.isSuccess}
          message={modal.message}
          onClose$={$(() => {
            refetchAnalytics.value = true;
            modal.isOpen = false;
        })}
        />
      )}
    </>
  );
});
