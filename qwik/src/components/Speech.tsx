import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { SendIcon, RepeatIcon } from "lucide-qwik";
import { CrudService } from '~/routes/api/base/oop';
import { Toast } from './ui/Toast';
import { RefetchContext } from './context/refreshContext';

export const Speech = component$(() => {
  const isListening = useSignal(false);
  const transcript = useSignal('');
  const error = useSignal('');
  const showPopup = useSignal(false);
  const isLoading = useSignal(false);

  const modal = useStore({
    isOpen: false,
    isSuccess: false,
    message: ''
  });

  const { refetchAnalytics } = useContext(RefetchContext);

  const startRecognition = $(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      error.value = 'Browser yako haisapoti, ibadilishe';
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
    isLoading.value = true;

    const text = transcript.value.trim();

    const api = new CrudService<{ id?: string; text: string }>("speech");

    const result = await api.create({ text });

    modal.isOpen = true;
    modal.isSuccess = result.success;
    modal.message = result.message || (result.success ? 'Umefanikiwa' : 'Hitilafu imetokea, jaribu baadae');


    showPopup.value = false;
    isLoading.value = false;
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
          <div class="mb-2">
            <label class="text-gray-500">🗣️ Hariri kabla ya kutuma:</label>
            <textarea
              class="w-full mt-1 border rounded p-2 text-xl bg-white"
              bind:value={transcript}
              rows={2}
            />
          </div>

          <div class="flex justify-between mt-4">
            <button class="text-2xl" onClick$={handleRepeat} title="Rudia"> <RepeatIcon /> </button>
            <button class="text-2xl" onClick$={handleSend} title="Tuma" disabled={isLoading.value}> <SendIcon /> </button>
            <button class="text-red-500" onClick$={() => showPopup.value = false} title="Funga">❌</button>
          </div>
        </div>
      )}

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
    </div>
  );
});
