import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface TypewriterProps {
  text: string;
  speed?: number; // Typing speed in ms
}

export const Typewriter = component$(({ text, speed = 60 }: TypewriterProps) => {
  const displayText = useSignal('');
  const cursorVisible = useSignal(true);

  useVisibleTask$(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      displayText.value = text.slice(0, i + 1);
      i++;
      if (i >= text.length) clearInterval(typeInterval);
    }, speed);

    const cursorBlink = setInterval(() => {
      cursorVisible.value = !cursorVisible.value;
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorBlink);
    };
  });

  return (
    <span class="font-mono text-lg">
      {displayText.value}
      <span class={`inline-block w-[1ch] ${cursorVisible.value ? 'opacity-100' : 'opacity-0'}`}>
        _
      </span>
    </span>
  );
});
