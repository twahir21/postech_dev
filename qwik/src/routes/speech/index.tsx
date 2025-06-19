import { $, component$, useSignal } from '@builder.io/qwik';
import { SendIcon, RepeatIcon } from "lucide-qwik";

export default component$(() => {
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
      console.log('Transcribed:', result);
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

  const handleSend = $(() => {
    console.log('Send:', transcript.value);
    alert(`Sending: ${transcript.value}`);
    showPopup.value = false;
  });

  const handleRepeat = $(() => {
    startRecognition();
  });

  return (
    <div class="p-4 rounded bg-gray-300 relative">

      <button
        class="text-4xl"
        onClick$={startRecognition}
        disabled={isListening.value}
        title="Start Listening"
      >
        {isListening.value ? '🎙️...' : '🎙️'}
      </button>

      {error.value && <p class="text-red-500">{error.value}</p>}

      {showPopup.value && (
        <div class="absolute top-16 left-0 w-full max-w-sm bg-white p-4 rounded shadow-md z-10">
          <div class="text-xl mb-2">🗣️ <span class="font-mono">{transcript.value}</span></div>
          <div class="flex justify-between mt-4">
            <button class="text-2xl" onClick$={handleRepeat} title="Rudia"> <RepeatIcon /> </button>
            <button class="text-2xl" onClick$={handleSend} title="Tuma"> <SendIcon /> </button>
            <button class="text-2xl text-red-500" onClick$={() => showPopup.value = false} title="Funga">❌</button>
          </div>
        </div>
      )}
    </div>
  );
});
