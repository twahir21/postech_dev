import { component$ } from '@builder.io/qwik';

export const Loader = component$(() => {
  return (
    <div class="loader-container rounded-4xl">
      <div class="hypnotic-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="loading-text">Inapakia...</div>
    </div>
  );
});
