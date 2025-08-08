import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const HeroVideo = component$(() => {
  const isOpen = useSignal(false);
  const videoRef = useSignal<HTMLVideoElement>();

  // Pause video when popup closes
  useVisibleTask$(({ track }) => {
    track(() => isOpen.value);
    if (!isOpen.value && videoRef.value) {
      videoRef.value.pause();
    }
  });

  return (
    <>
      {/* Button to trigger popup - now properly sized for the hero section */}
      <button
        onClick$={() => (isOpen.value = true)}
        class="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-700 to-green-900 text-white rounded-full shadow-md hover:shadow-lg transition text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.5 5.5v9l8-4.5-8-4.5z" />
        </svg>
        Tazama Video
      </button>

      {/* Popup/Modal - unchanged from your working version */}
      {isOpen.value && (
        <div
          onClick$={() => (isOpen.value = false)}
          class="fixed inset-0 bg-gray-700 bg-opacity-10 flex justify-center items-center z-50 cursor-pointer"
        >
          <div
            class="relative w-full max-w-4xl"
            onClick$={(e) => e.stopPropagation()}
          >
            <button
              onClick$={() => (isOpen.value = false)}
              class="absolute -top-10 right-0 text-white hover:text-gray-300 z-20"
            >
              ❌ Funga
            </button>
            <video
              ref={videoRef}
              controls
              autoplay
              class="w-full rounded-lg z-10"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
});