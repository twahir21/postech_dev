import { $, component$ } from '@builder.io/qwik';
import { getDeferredPrompt } from '~/routes/function/pwa-install';

export const InstallPWAButton = component$(() => {
  const onInstallClick = $(() => {
    const prompt = getDeferredPrompt();
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA install accepted');
        } else {
          console.log('PWA install dismissed');
        }
      });
    } else {
      alert('Install not available');
    }
  });

  return <button onClick$={onInstallClick}> 📥 </button>;
});
