import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik";

import "./global.css";
import { canShowPrompt, captureBeforeInstallPrompt, getDeferredPrompt, setPromptShown } from "./routes/function/pwa-install";
import { PWAPOP } from "./components/ui/pwaPOP";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  const showPwaPrompt = useSignal(false);

  useVisibleTask$(() => {
    captureBeforeInstallPrompt();
    if (canShowPrompt()) {
      showPwaPrompt.value = true;
      setPromptShown();
    }
  });


  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en" class="font-ubuntu">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}

        {showPwaPrompt.value && (
          <PWAPOP
            onAccept$={async () => {
              const prompt = getDeferredPrompt();
              if (prompt) {
                // Directly install without showing browser's prompt
                prompt.prompt();
                await prompt.userChoice;
              }
              showPwaPrompt.value = false;
            }}
            onReject$={() => {
              showPwaPrompt.value = false;
            }}
          />
        )}

      </body>
    </QwikCityProvider>
  );
});
