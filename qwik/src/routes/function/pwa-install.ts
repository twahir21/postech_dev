// src/utils/pwa-install.ts
let deferredPrompt: any = null;

export function captureBeforeInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevent the mini-infobar
    deferredPrompt = e;
  });
}

export function getDeferredPrompt() {
  return deferredPrompt;
}

export function canShowPrompt(): boolean {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }

  // Check localStorage for last prompt time
  const lastPromptTime = localStorage.getItem('pwaPromptLastShown');
  if (lastPromptTime) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Date.now() - Number(lastPromptTime) > oneDay;
  }

  return true;
}

export function setPromptShown() {
  localStorage.setItem('pwaPromptLastShown', Date.now().toString());
}