import { component$, useSignal } from '@builder.io/qwik';

export const ChartCard = component$(({ title, chartId }: { title: string; chartId: string }) => {
  const filter = useSignal<'week' | 'month' | 'year' | 'custom'>('week');
  const from = useSignal('');
  const to = useSignal('');

  return (
    <div class="bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 rounded-2xl shadow p-4 border">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-base font-semibold text-gray-700">{title}</h3>

        <div class="flex gap-2 items-center">
          <select
            class="border rounded px-2 py-1 text-sm"
            value={filter.value}
            onChange$={(e) => {
              filter.value = (e.target as HTMLSelectElement).value as typeof filter.value;
            }}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="custom">Custom</option>
          </select>

          {filter.value === 'custom' && (
            <>
              <input
                type="date"
                class="border rounded px-2 py-1 text-sm"
                bind:value={from}
              />
              <input
                type="date"
                class="border rounded px-2 py-1 text-sm"
                bind:value={to}
              />
            </>
          )}
        </div>
      </div>

      <div id={chartId} class="w-full" />
    </div>
  );
});
