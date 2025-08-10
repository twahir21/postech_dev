import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import ApexCharts from 'apexcharts';

export const ChartCard = component$(({ title, chartId }: { title: string; chartId: string }) => {
  const filter = useSignal<'day' | 'week' | 'month' | 'year' >('day');

  return (
    <div class="bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 rounded-2xl shadow p-4 border">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-base font-semibold text-gray-700">{title}</h3>
          <div class="flex flex-col gap-2 items-start">
            <select
              class="border rounded px-2 py-1 text-sm w-40"
              value={filter.value}
              onChange$={(e) => {
                filter.value = (e.target as HTMLSelectElement).value as typeof filter.value;
              }}
            >
              <option value="day">Siku iliyopita</option>
              <option value="week">Wiki iliyopita</option>
              <option value="month">Mwezi uliopita</option>
              <option value="year">Miezi 6 iliyopita</option>
            </select>

          </div>

      </div>
      <div id={chartId} class="w-full" />
    </div>
  );
});

export const MainGraph = component$(() => {
  useVisibleTask$(() => {

    // ----------------------------------------------
    // BAR CHART
    // ----------------------------------------------
    const barChart = new ApexCharts(document.querySelector("#bar-chart"), {
      chart: { type: 'bar', height: 250 },
      plotOptions: { bar: { borderRadius: 2 } },
      series: [
        { name: 'Matumizi', data: [200, 300, 250, 400, 350, 280, 300] },
        { name: 'Manunuzi', data: [500, 600, 550, 620, 580, 610, 590] },
        { name: 'Mauzo', data: [1000, 1200, 1100, 1300, 1250, 1400, 1350] },
        {
          name: 'Faida',
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

    // ----------------------------------------------
    // LINE CHART
    // ----------------------------------------------
    const lineChart = new ApexCharts(document.querySelector("#line-chart"), {
      chart: { type: 'line', height: 250 },
      series: [{ name: 'Income', data: [1000, 1200, 900, 1500, 1800, 1300, 1600] }],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      stroke: { curve: 'smooth' },
      colors: ['#10b981']
    });

    // ----------------------------------------------
    // PIE CHART
    // ----------------------------------------------
    const pieChart = new ApexCharts(document.querySelector("#pie-chart"), {
      chart: { type: 'pie', height: 250 },
      series: [40, 30, 20, 10],
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      colors: ['#f87171', '#60a5fa', '#34d399', '#fbbf24']
    });

    // ----------------------------------------------
    // PIE CHART 2, CASH VS MADENI
    // ----------------------------------------------
    const pieChart2 = new ApexCharts(document.querySelector("#pie-chart-2"), {
      chart: { type: 'pie', height: 250 },
      series: [670000, 320000], // cash, madeni
      labels: ['Cash', 'Madeni'],
      colors: ['#98CD00', '#FF9587'] // Green for Cash, Red for Madeni
    });


    // ----------------------------------------------
    // HORIZONTAL BAR CHART
    // ----------------------------------------------
    const hBarChart = new ApexCharts(document.querySelector("#hbar-chart"), {
      chart: { type: 'bar', height: 250 },
      plotOptions: { bar: { horizontal: true } },
      series: [{ name: 'Votes', data: [44, 55, 41, 64, 22] }],
      xaxis: { categories: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'] },
      colors: ['#6366f1']
    });

    // ----------------------------------------------
    // HORIZONTAL BAR CHART - 2, MOST LEAST PROFIT PRODUCTS
    // ----------------------------------------------
    const hBarChart2 = new ApexCharts(document.querySelector("#hbar-chart-2"), {
      chart: { type: 'bar', height: 250 },
      plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '60%'} },
      series: [{ name: 'Sales', data: [820, 740, 650, 480, 390] }],
      xaxis: { categories: ['Sukari', 'Mafuta', 'Mchele', 'Unga', 'Sabuni'], 
        labels: { style: { fontSize: '14px', colors: '#374151' } }},
      colors: ['#0B1D51'], // sky blue
    });


    lineChart.render();
    barChart.render();
    pieChart.render();
    hBarChart.render();
    pieChart2.render();
    hBarChart2.render();
  });

  return (
    <>
      <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-screen">
        <ChartCard title="🏆 Bidhaa 5 Zenye Faida Kubwa" chartId="pie-chart" />
        <ChartCard title="📦 Stoku (Hisa)" chartId="line-chart" />
        <ChartCard title="📊 Madeni" chartId="hbar-chart" />
        <ChartCard title="💸 Mapato & Matumizi" chartId="bar-chart" />
        <ChartCard title="💵 Cash vs Madeni" chartId="pie-chart-2" />
        <ChartCard title="📉  Bidhaa 5 zenye faida ndogo" chartId="hbar-chart-2" />
      </div>
    </>
  );
});
