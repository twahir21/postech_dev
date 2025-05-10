import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const Translate = component$((props: { lang: string; keys: string[] }) => {
  const translations = useSignal<Record<string, string>>({});
  // Use useTask$ to reactively update translations when `lang` or `keys` change
  useVisibleTask$(async ({ track }) => {
    track(() => props.lang); // Track language changes
    track(() => props.keys); // Track key changes

    try {
      const newTranslations: Record<string, string> = {};
      for (const key of props.keys) {
        const res = await fetch(`http://localhost:5173/api/translate?lang=${props.lang}&key=${key}`);
        const data = await res.json();
        newTranslations[key] = data.message || key; // Fallback to key if translation not found
      }
      translations.value = newTranslations; // Update state with new translations
    } catch (error) {
      console.error("Fetch Error:", error);
      translations.value = {}; // Reset or handle error case
    }
  });

  return (
    <div>
      {props.keys.map((key) => (
        <p key={key}>{translations.value[key] || "Loading..."}</p>
      ))}
    </div>
  );
});
