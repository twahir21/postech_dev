import { $, component$, useSignal } from '@builder.io/qwik';
import { SendIcon, RepeatIcon } from "lucide-qwik";
import { CrudService } from '~/routes/api/base/oop';

export const Speech = component$(() => {
  const isListening = useSignal(false);
  const transcript = useSignal('');
  const error = useSignal('');
  const showPopup = useSignal(false);

  const startRecognition = $(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      error.value = 'SpeechRecognition API is not supported in this browser.';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'sw-KE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening.value = true;
      error.value = '';
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      transcript.value = result;
      showPopup.value = true;
    };

    recognition.onerror = (e: any) => {
      error.value = 'Error: ' + e.error;
      console.error(e);
    };

    recognition.onend = () => {
      isListening.value = false;
    };

    recognition.start();
  });

  const handleSend = $( async () => {
    console.log('Send:', transcript.value);
    alert(`Sending: ${transcript.value}`);
    const api = new CrudService<{ id?: string; text: string }>("speech");

    const result = await api.create({ text: transcript.value });

    console.log(result)
    showPopup.value = false;
  });

  const handleRepeat = $(() => {
    startRecognition();
  });

  return (
    <div class="pt-2 relative">

      <button
        class="text-2xl"
        onClick$={startRecognition}
        disabled={isListening.value}
        title="Ongea..."
      >
        {isListening.value ? '🎙️...' : '🎙️'}
      </button>

      {error.value && <p class="text-red-500">{error.value}</p>}

      {showPopup.value && (
        <div class="fixed top-16 right-0 w-full max-w-sm bg-yellow-50 border p-4 rounded-2xl shadow-md z-10">
          <div class="text-xl mb-2">🗣️ <span class="font-mono">{transcript.value}</span></div>
          <div class="flex justify-between mt-4">
            <button class="text-2xl" onClick$={handleRepeat} title="Rudia"> <RepeatIcon /> </button>
            <button class="text-2xl" onClick$={handleSend} title="Tuma"> <SendIcon /> </button>
            <button class="text-red-500" onClick$={() => showPopup.value = false} title="Funga">❌</button>
          </div>
        </div>
      )}
    </div>
  );
});
