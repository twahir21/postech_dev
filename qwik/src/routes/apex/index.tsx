import { component$, useVisibleTask$ } from '@builder.io/qwik';
import ApexCharts from 'apexcharts';

export default component$(() => {
  useVisibleTask$(() => {
    const options = {
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      series: [
        {
          name: 'Sales',
          data: [120, 150, 90, 250, 300, 200, 170],
        },
      ],
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: { style: { fontSize: '14px' } }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#3b82f6'],
      grid: {
        borderColor: '#e5e7eb'
      }
    };

    const chart = new ApexCharts(document.querySelector("#apex-chart"), options);
    chart.render();
  });

  return (
    <div class="p-4 md:p-6">
      <h2 class="text-lg font-semibold mb-2 text-gray-800">Weekly Sales</h2>
      <div id="apex-chart" class="bg-white rounded-2xl shadow p-2" />
    </div>
  );
});
