import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { QRL } from '@builder.io/qwik';
import { CheckCircleIcon, XCircleIcon } from 'lucide-qwik';

export const Toast = component$(
  ({
    isOpen,
    type,
    message,
    duration = 2000,
    onClose$,
  }: {
    isOpen: boolean;
    type: boolean;
    message: string;
    duration?: number;
    onClose$?: QRL<() => void>;
  }) => {
    useVisibleTask$(() => {
      if (!isOpen) return;
      const timer = setTimeout(() => {
        onClose$?.();
      }, duration);
      return () => clearTimeout(timer);
    });

    if (!isOpen) return null;

    return (
      <div class="fixed top-4 right-4 z-50 bg-white border shadow-lg rounded-xl px-4 py-3 flex flex-col space-y-2 w-[300px] animate-fade-in">
        <div class="flex items-center space-x-3">
          {type ? (
            <CheckCircleIcon class="text-green-500 w-6 h-6" />
          ) : (
            <XCircleIcon class="text-red-500 w-6 h-6" />
          )}
          <span class="text-sm text-gray-800">
            <h1 class={`font-bold ${type ? "text-green-500": "text-red-500" }`}>{type ? "Nzuri" : "Mbaya"}</h1>
            {message}
          </span>
        </div>
        <div class="h-1 w-full bg-gray-200 rounded overflow-hidden">
          <div
            class={`h-full ${
              type ? 'bg-green-500' : 'bg-red-500'
            } animate-progress-bar`}
          ></div>
        </div>
      </div>
    );
  }
);
