import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import ApexCharts from 'apexcharts';

export default component$ (() => {
  const selectedRange = useSignal<'week' | 'month' | 'year'>('week');
  const chartRef = useSignal<Element>();

  const chartData = {
    week: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        { name: 'Purchases', data: [200, 150, 100, 220, 180, 140, 130] },
        { name: 'Sales', data: [400, 300, 350, 500, 450, 370, 390] },
        { name: 'Expenses', data: [120, 100, 90, 130, 110, 105, 95] },
        { name: 'Net Profit', data: [80, 50, 160, 150, 160, 125, 165] }
      ]
    },
    month: {
      categories: ['Wk1', 'Wk2', 'Wk3', 'Wk4'],
      series: [
        { name: 'Purchases', data: [700, 600, 800, 750] },
        { name: 'Sales', data: [1300, 1200, 1400, 1500] },
        { name: 'Expenses', data: [400, 350, 420, 390] },
        { name: 'Net Profit', data: [200, 250, 180, 360] }
      ]
    },
    year: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      series: [
        { name: 'Purchases', data: [2400, 2600, 2100, 2800, 2700, 2300, 2900] },
        { name: 'Sales', data: [4500, 4700, 4200, 5000, 4900, 4600, 5200] },
        { name: 'Expenses', data: [1400, 1500, 1350, 1600, 1550, 1480, 1700] },
        { name: 'Net Profit', data: [700, 800, 750, 900, 850, 820, 950] }
      ]
    }
  };

  useVisibleTask$(({ track }) => {
    track(() => selectedRange.value);
    const chartDataSet = chartData[selectedRange.value];
    const chartOptions = {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 6
        }
      },
      xaxis: {
        categories: chartDataSet.categories
      },
      colors: ['#60a5fa', '#34d399', '#f87171', '#facc15'],
      series: chartDataSet.series,
      legend: { position: 'top' },
      dataLabels: { enabled: false }
    };

    const chart = new ApexCharts(chartRef.value, chartOptions);
    chart.render();

    return () => chart.destroy();
  });

  return (
    <div class="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Business Overview</h2>
        <select
          class="bg-white text-sm border border-gray-300 rounded px-3 py-1 shadow-sm"
          onChange$={(e) => (selectedRange.value = (e.target as HTMLSelectElement).value as any)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div ref={(el) => (chartRef.value = el)} class="bg-white rounded-2xl shadow p-2" />
    </div>
  );
});
