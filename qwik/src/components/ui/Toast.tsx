import { component$, useVisibleTask$, useSignal, $, type QRL } from '@builder.io/qwik';
import { CheckCircleIcon, XCircleIcon } from 'lucide-qwik';

export const Toast = component$(
  ({
    isOpen,
    type, // true for success (Nzuri), false for error (Mbaya)
    message,
    duration = 2000, // Default duration in milliseconds
    onClose$, // QRL to call when toast should close
  }: {
    isOpen: boolean;
    type: boolean;
    message: string;
    duration?: number;
    onClose$?: QRL<() => void>;
  }) => {
    // Signal to store the ID returned by setTimeout
    const timerId = useSignal<number | undefined>(undefined);

    // Signal to track if the toast is currently paused by user interaction
    const isPaused = useSignal(false);

    // Signal to hold the effective total duration for the current dismiss cycle (can be adjusted after pauses)
    const currentDismissDuration = useSignal(duration);

    // Signal to record the timestamp when the current timer cycle began
    const startTime = useSignal(0);

    // Signal to store how much time had elapsed when the toast was paused
    const elapsedTimeOnPause = useSignal(0);

    /**
     * QRL function to start the toast dismiss timer.
     * Clears any existing timer and sets a new one based on remaining duration or initial duration.
     */
    const startDismissTimer = $(() => {
      // Clear any existing timer to prevent multiple timers running
      if (timerId.value) {
        clearTimeout(timerId.value);
      }

      // Only proceed if the toast is not currently paused
      if (!isPaused.value) {
        let effectiveTimeoutDuration = duration;

        // If resuming from a pause (elapsedTimeOnPause > 0), calculate remaining time
        if (elapsedTimeOnPause.value > 0) {
          effectiveTimeoutDuration = currentDismissDuration.value - elapsedTimeOnPause.value;
          // Ensure we don't try to set a negative or zero timeout
          if (effectiveTimeoutDuration <= 0) {
            onClose$?.(); // Dismiss immediately if no time left
            return;
          }
        } else {
          // If starting fresh, set the current dismiss duration to the initial duration
          currentDismissDuration.value = duration;
        }

        // Record the start time of this timer segment
        startTime.value = Date.now();

        // Set the actual JavaScript timer
        timerId.value = Number(setTimeout(() => {
          onClose$?.();
        }, effectiveTimeoutDuration));
      }
    });

    /**
     * QRL function to clear the toast dismiss timer.
     * Also resets the elapsed time and current duration for proper re-initialization.
     */
    const clearDismissTimer = $(() => {
      if (timerId.value) {
        clearTimeout(timerId.value);
        timerId.value = undefined;
      }
      // When the timer is explicitly cleared (e.g., toast closes, or pauses),
      // reset elapsed time for the next time it might open.
      elapsedTimeOnPause.value = 0;
      // Also reset currentDismissDuration to original `duration` when cleared fully
      currentDismissDuration.value = duration;
    });

    /**
     * useVisibleTask$ hook to manage the toast's lifecycle and timer.
     * Runs when the component becomes visible and reacts to changes in `isOpen` and `isPaused`.
     */
    useVisibleTask$(({ track, cleanup }) => {
      // Track these signals so the task re-runs when they change
      track(() => isOpen);
      track(() => isPaused.value);
      track(() => duration); // Track duration if it can be changed externally

      if (isOpen) {
        if (!isPaused.value) {
          // If toast is open and not paused, start the timer
          startDismissTimer();
        } else {
          // If toast is open but paused, calculate elapsed time
          // and ensure the JavaScript timer is stopped
          if (startTime.value > 0) {
            elapsedTimeOnPause.value = Date.now() - startTime.value;
          }
          clearDismissTimer(); // Stop the timer while paused
        }
      } else {
        // If toast is not open, clear any active timer and reset state
        clearDismissTimer();
      }

      // Cleanup function: runs when the component is unmounted or task re-runs
      // Ensures no timers are left running
      cleanup(() => {
        clearDismissTimer();
      });
    });

    /**
     * QRL handlers for mouse and touch events to control pausing.
     */
    const handleMouseEnter = $(() => {
      isPaused.value = true;
    });

    const handleMouseLeave = $(() => {
      isPaused.value = false;
      // When leaving hover, immediately resume the timer if the toast is still open
      if (isOpen) {
        startDismissTimer();
      }
    });

    const handleTouchStart = $(() => {
      isPaused.value = true;
    });

    const handleTouchEnd = $(() => {
      isPaused.value = false;
      // When touch ends, immediately resume the timer if the toast is still open
      if (isOpen) {
        startDismissTimer();
      }
    });

    // If the toast is not open, render nothing
    if (!isOpen) {
      return null;
    }

    // Calculate the animation duration for the CSS variable '--toast-duration'
    // This value is in seconds, so divide milliseconds by 1000
    const animationDurationInSeconds = (currentDismissDuration.value - elapsedTimeOnPause.value) / 1000;

    // Calculate the negative animation-delay for resuming the progress bar visually
    // This makes the animation appear to start from where it was paused
    const animationDelayForResume = isPaused.value && elapsedTimeOnPause.value > 0
      ? `-${(elapsedTimeOnPause.value / currentDismissDuration.value) * animationDurationInSeconds}s`
      : '0s';


    return (
      <div
        class="fixed top-4 right-4 z-50 bg-white border shadow-lg rounded-xl px-4 py-3 flex flex-col space-y-2 w-[300px] animate-fade-in"
        // Event handlers for pausing/resuming
        onMouseEnter$={handleMouseEnter}
        onMouseLeave$={handleMouseLeave}
        onTouchStart$={handleTouchStart}
        onTouchEnd$={handleTouchEnd}
        // Set CSS variable for the animation duration on the main div
        style={{
          '--toast-duration': `${animationDurationInSeconds}s`,
        }}
      >
        <div class="flex items-center space-x-3">
          {type ? (
            <CheckCircleIcon class="text-green-500 w-6 h-6" />
          ) : (
            <XCircleIcon class="text-red-500 w-6 h-6" />
          )}
          <span class="text-sm text-gray-800">
            <h1 class={`font-bold ${type ? "text-green-500" : "text-red-500"}`}>{type ? "Nzuri" : "Mbaya"}</h1>
            {message}
          </span>
        </div>
        <div class="h-1 w-full bg-gray-200 rounded overflow-hidden">
          <div
            class={`h-full ${
              type ? 'bg-green-500' : 'bg-red-500'
            } animate-progress-bar`}
            style={{
              // Control the animation play state: paused or running
              'animation-play-state': isPaused.value ? 'paused' : 'running',
              // Apply a negative delay to resume the animation from the correct point
              'animation-delay': animationDelayForResume,
            }}
          ></div>
        </div>
      </div>
    );
  }
);