import { component$, useVisibleTask$ } from '@builder.io/qwik';
import ApexCharts from 'apexcharts';

export default component$(() => {
  useVisibleTask$(() => {
    const lineChart = new ApexCharts(document.querySelector("#line-chart"), {
      chart: { type: 'line', height: 250 },
      series: [{ name: 'Sales', data: [10, 30, 20, 40, 25, 50, 35] }],
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      stroke: { curve: 'smooth' },
      colors: ['#3b82f6']
    });

    const barChart = new ApexCharts(document.querySelector("#bar-chart"), {
      chart: { type: 'bar', height: 250 },
      series: [{ name: 'Income', data: [1000, 1200, 900, 1500, 1800, 1300, 1600] }],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
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
    <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 min-h-screen">
      <ChartCard title="Line Chart" chartId="line-chart" />
      <ChartCard title="Bar Chart" chartId="bar-chart" />
      <ChartCard title="Pie Chart" chartId="pie-chart" />
      <ChartCard title="Horizontal Bar" chartId="hbar-chart" />
    </div>
  );
});

const ChartCard = ({ title, chartId }: { title: string; chartId: string }) => (
  <div class="bg-white rounded-2xl shadow p-4">
    <h3 class="text-base font-semibold mb-2 text-gray-700">{title}</h3>
    <div id={chartId} class="w-full" />
  </div>
);
