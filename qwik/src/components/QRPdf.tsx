import { Translate } from "./Language";
import { component$, useStore, $, useResource$, useContext } from '@builder.io/qwik';
import { fetchWithLang } from '~/routes/function/fetchLang';
import { RefetchContext } from "./context/refreshContext";

export const QrPdf = component$((props: { lang: string }) => {
  const store = useStore({
    isLoading: false, // Tracks if the API request is in progress
    modal: {
      isOpen: false,
      message: '',
      isSuccess: false,
    },
    isButtonDisabled: true,
  });

  const {qrCodeRefetch} = useContext(RefetchContext);

  // check if QrCode is needed
  useResource$(async ({ track }) => {
    track(() => qrCodeRefetch.value);
    try {
      const response = await fetchWithLang('http://localhost:3000/check-isQrCode', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to fetch QR code status.');
      }

      const data = await response.json();
      if (data.success) {
        store.isButtonDisabled = false; // Enable the button if QR codes are needed
      }
      else {
        store.isButtonDisabled = true; // Disable the button if no QR codes are needed
      }
      qrCodeRefetch.value = false;
    } catch (error) {
      console.log("Err", error);
    }
  })

  // Handle Generate QR Codes Button Click
  const generateQRCodes = $(async () => {
    try {
      store.isLoading = true; // Set loading state to true

      // Call the backend API to generate QR codes
      const response = await fetchWithLang('http://localhost:3000/generate-qrcode', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to generate QR codes.');
      }

      // Trigger download of the zip file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcodes_${Date.now()}.zip`; // Set the filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Show success message
      store.modal = {
        isOpen: true,
        message: 'QR codes imetengenezwa kwa mafanikio na zipu imeshushwa.',
        isSuccess: true,
      };
    } catch (error) {
      console.error('Error generating QR codes:', error);

      // Show error message
      store.modal = {
        isOpen: true,
        message: 'An error occurred while generating QR codes.',
        isSuccess: false,
      };
    } finally {
      store.isLoading = false; // Reset loading state
    }
  });


  return (
    <>
      {/* Generate QR Codes Button */}
      <h1 class="text-xl font-bold text-gray-700 mt-6 mb-2 border-b-2 pb-2">
        <Translate lang={props.lang} keys={['step_3']} />
      </h1>
      <button
        class={`bg-gray-700 text-white px-4 py-2 rounded mt-4 w-full hover:bg-gray-500 ${
          store.isLoading || store.isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick$={async () => {
          store.isButtonDisabled = true; // Optimistically disable the button
          await generateQRCodes();       // Run QR code generation
          qrCodeRefetch.value = true;    // Trigger resource refetch to double-check
        }}
        
        
        disabled={store.isLoading || store.isButtonDisabled}                
      >
        {store.isLoading ? (
          // Custom Loader
          <div class="inline-flex">
            <div class="loaderCustom"></div>
          </div>
        ) : (
          'Generate QR Codes'
        )}
      </button>

      {/* Modal Popup */}
      {store.modal.isOpen && (
        <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-neutral-500 z-50">
          <div class="bg-white p-6 rounded shadow-lg text-center">
            <p class={store.modal.isSuccess ? 'text-green-600' : 'text-red-600'}>
              {store.modal.message}
            </p>
            <button
              class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick$={() => (store.modal.isOpen = false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
});