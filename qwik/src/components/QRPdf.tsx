import { component$, useStore, $, useResource$, useContext } from '@builder.io/qwik';
import { RefetchContext } from "./context/refreshContext";
import { CrudService } from '~/routes/api/base/oop';
import { env } from '~/routes/api/base/config';
import { Toast } from './ui/Toast';

export const QrPdf = component$(() => {
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

      const checkQrCodeApi = new CrudService("check-isQrCode");
      const isQrcodeOk = await checkQrCodeApi.get();
      if (!isQrcodeOk.success){
        store.isButtonDisabled = true; // Disable the button if no QR codes are needed
      }else{
        store.isButtonDisabled = false; // Enable the button if QR codes are needed
      }

      qrCodeRefetch.value = false;
    
  });

  // Handle Generate QR Codes Button Click
  const generateQRCodes = $(async () => {
    try {
      store.isLoading = true; // Set loading state to true

      // Call the backend API to generate QR codes
      const backend = env.mode === 'development' ? env.backendURL_DEV : env.backendURL;

      const response = await fetch(`${backend}/generate-qrcode`, {
        method: 'GET',
        credentials: 'include',
      });
      const resultClone = response.clone() // ili tuweze kuisoma mara mbili json and blob
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || "Seva imeshindwa kutengeneza QR Code"
        }
      }

      // Trigger download of the zip file
      const blob = await resultClone.blob();
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
        message: result.message || 'QR codes imetengenezwa kwa mafanikio na zipu imeshushwa.',
        isSuccess: true,
      };
    } catch (error) {

      // Show error message
      store.modal = {
        isOpen: true,
        message: error instanceof Error ? error.message: 'Tatizo kwenye seva wakati wa kutengeneza QR codes.',
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
        Hatua ya 3:
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
          'Tengeneza QR Codes'
        )}
      </button>

      {/* Modal Popup */}
      {store.modal.isOpen && (
          <Toast
          isOpen={store.modal.isOpen}
          type={store.modal.isSuccess}
          message={store.modal.message}
          onClose$={$(() => {
            store.modal.isOpen = false;
          })}
          />
      )}
    </>
  );
});