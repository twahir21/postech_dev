import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { animate } from 'motion';

export const FancyIntro = component$(() => {
  const headingRef = useSignal<HTMLElement>();
  const textRef = useSignal<HTMLElement>();

  useVisibleTask$(() => {
    if (headingRef.value) {
      animate(
        headingRef.value,
        {
          opacity: [0, 1], // ← cast to string
          transform: ['translateY(100px) scale(0.95)', 'translateY(0) scale(1)'],
        },
        {
          duration: 0.6,
          easing: 'ease-out',
          delay: 0.5,
        }
      );
    }

    if (textRef.value) {
      animate(
        textRef.value,
        {
          opacity: [0, 1], // ← cast to string
          transform: ['translateY(100px) scale(0.95)', 'translateY(0) scale(1)'],
        },
        {
          duration: 0.6,
          easing: 'ease-out',
          delay: 0.8,
        }
      );
    }
  });

  return (
    <div class="w-full md:w-1/2 ml-auto text-right">
        <h2 class="text-2xl sm:text-3xl md:text-3xl font-bold mb-4" ref={headingRef}>Kuhusu PosTech</h2>
        <p ref={textRef} class="text-sm sm:text-base md:text-base text-gray-600 dark:text-gray-300">
            PosTech ni mfumo wa kisasa wa Point-of-Sale uliotengenezwa ili kurahisisha shughuli za biashara hasa mauzo na utunzaji wa taarifa za kibiashara kwa kufanya
            uchanganuzi wa faida, usimamizi wa mauzo na manunuzi, na shughuli zisizo na mashaka, tunawasaidia wajasiriamali kufanikiwa.
        </p>
    </div>
  );
});
