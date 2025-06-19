import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import ApexCharts from 'apexcharts';

export const ChartCard = component$(({ title, chartId }: { title: string; chartId: string }) => {
  const filter = useSignal<'week' | 'month' | 'year' | 'custom'>('week');
  const from = useSignal('');
  const to = useSignal('');

  return (
    <div class="bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 rounded-2xl shadow p-4 border">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-base font-semibold text-gray-700">{title}</h3>
          <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <select
              class="border rounded px-2 py-1 text-sm w-full sm:w-auto"
              value={filter.value}
              onChange$={(e) => {
                filter.value = (e.target as HTMLSelectElement).value as typeof filter.value;
              }}
            >
              <option value="week">Wiki</option>
              <option value="month">Mwezi</option>
              <option value="year">Mwaka</option>
              <option value="custom">Muda maalumu</option>
            </select>

            {filter.value === 'custom' && (
              <div class="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="date"
                  class="border rounded px-2 py-1 text-sm w-full sm:w-auto"
                  bind:value={from}
                />
                <input
                  type="date"
                  class="border rounded px-2 py-1 text-sm w-full sm:w-auto"
                  bind:value={to}
                />
              </div>
            )}
          </div>
      </div>
      <div id={chartId} class="w-full" />
    </div>
  );
});

export const Graphs = component$(() => {
  useVisibleTask$(() => {
    const barChart = new ApexCharts(document.querySelector("#bar-chart"), {
      chart: { type: 'bar', height: 250 },
      series: [
        { name: 'Expenses', data: [200, 300, 250, 400, 350, 280, 300] },
        { name: 'Purchases', data: [500, 600, 550, 620, 580, 610, 590] },
        { name: 'Sales', data: [1000, 1200, 1100, 1300, 1250, 1400, 1350] },
        {
          name: 'Net Profit',
          data: [
            1000 - 500 - 200,
            1200 - 600 - 300,
            1100 - 550 - 250,
            1300 - 620 - 400,
            1250 - 580 - 350,
            1400 - 610 - 280,
            1350 - 590 - 300
          ]
        }
      ],
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      colors: ['#ef4444', '#f97316', '#3b82f6', '#10b981'],
      legend: { position: 'top' },
      dataLabels: { enabled: false }
    });

    const lineChart = new ApexCharts(document.querySelector("#line-chart"), {
      chart: { type: 'line', height: 250 },
      series: [{ name: 'Income', data: [1000, 1200, 900, 1500, 1800, 1300, 1600] }],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      stroke: { curve: 'smooth' },
      colors: ['#10b981']
    });

    const pieChart = new ApexCharts(document.querySelector("#pie-chart"), {
      chart: { type: 'pie', height: 250 },
      series: [40, 30, 20, 10],
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      colors: ['#f87171', '#60a5fa', '#34d399', '#fbbf24']
    });

    const hBarChart = new ApexCharts(document.querySelector("#hbar-chart"), {
      chart: { type: 'bar', height: 250 },
      plotOptions: { bar: { horizontal: true } },
      series: [{ name: 'Votes', data: [44, 55, 41, 64, 22] }],
      xaxis: { categories: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'] },
      colors: ['#6366f1']
    });

    lineChart.render();
    barChart.render();
    pieChart.render();
    hBarChart.render();
  });

  return (
    <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-screen bg-gray-200">
      <ChartCard title="📦 Stoku (Hisa)" chartId="line-chart" />
      <ChartCard title="💸 Mapato & Matumizi" chartId="bar-chart" />
      <ChartCard title="💵 Cash vs Madeni" chartId="pie-chart" />
      <ChartCard title="📊 Madeni" chartId="hbar-chart" />
    </div>
  );
});
