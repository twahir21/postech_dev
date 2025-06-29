import { $, component$ } from '@builder.io/qwik';
import { getDeferredPrompt } from '~/routes/function/pwa-install';

export const InstallPWA = component$(() => {
  const onInstallClick = $(() => {
    const prompt = getDeferredPrompt();
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA install accepted');
        } 
      });
    } 
  });

  return (
    <button
      onClick$={onInstallClick}
      class="bg-gray-200 dark:bg-gray-400 text-gray-800 px-6 py-3 rounded-full shadow-md hover:bg-gray-400 transition text-sm sm:text-base md:text-base text-center border-2 border-gray-950"
    >
      📥 Pakua App Yetu
    </button>
  );
});
