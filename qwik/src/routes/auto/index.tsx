import { $, component$, useSignal } from '@builder.io/qwik';
import { CrudService } from '../api/base/oop';

export default component$(() => {
  const inputText = useSignal('');
  const suggestions = useSignal<string[]>([]);
  const showSuggestions = useSignal(false);
  const result = useSignal('');

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
  const endsWithSpace = inputText.value.endsWith(' ');

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

  // ✅ Auto-add "punguzo 0" after quantity
  if (
    endsWithSpace &&
    !inputText.value.includes('punguzo') &&
    totalWords >= 3 // minimum expected: verb + product + quantity
  ) {
    inputText.value = `${inputText.value.trim()} punguzo 0`;
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
    const res = await fetch('/api/voice-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText.value })
    });
    const data = await res.json();
    result.value = data.message;
  });

  return (
    <div class="space-y-4 p-4 bg-gray-100 rounded shadow">
      {/* Action Buttons (same as before) */}
      <div class="flex flex-wrap gap-2">
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
          placeholder="andika kama: nimemkopesha ali maziwa mbili"
          bind:value={inputText}
          rows={2}
          class="w-full p-2 rounded border border-gray-300"
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

      <button
        onClick$={handleSubmit}
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Tuma
      </button>

      {result.value && (
        <div class="mt-2 text-green-700 font-bold">{result.value}</div>
      )}
    </div>
  );
});
