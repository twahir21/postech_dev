import { $, component$, useSignal } from '@builder.io/qwik';
import { CrudService } from '../api/base/oop';

export default component$(() => {
  const inputText = useSignal('');
  const suggestions = useSignal<string[]>([]);
  const showSuggestions = useSignal(false);
  const result = useSignal('');

  const fetchSuggestions = $(async (query: string) => {
    const api = new CrudService(`products?search=${encodeURIComponent(query)}`);
    const result =  await api.get();
    if (!result.success) {
      suggestions.value = [];
      return;
    }
    const data = result.data;
    suggestions.value = data.map((p: any) => p.name);
    showSuggestions.value = true;
  });

  const handleKeyUp = $(async () => {
    const parts = inputText.value.trim().split(' ');
    const last = parts.at(-2) || ''; // assume product is second last word
    if (last.length >= 2) {
      await fetchSuggestions(last);
    } else {
      showSuggestions.value = false;
    }
  });

  const selectSuggestion = $((name: string) => {
    const words = inputText.value.trim().split(' ');
    // replace second-last word with the suggestion
    if (words.length >= 2) {
      words[words.length - 2] = name;
    } else {
      words.push(name);
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
