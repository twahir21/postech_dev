// src/components/SalesPieChart.tsx
import { component$, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";

type SalesTypeData = {
  type: 'Cash' | 'Debt';
  amount: number;
};

export const CashDebt = component$(() => {
  const dummyData: SalesTypeData[] = [
    { type: 'Cash', amount: 850 },
    { type: 'Debt', amount: 250 },
  ];

  useVisibleTask$(() => {
    const canvas = document.getElementById('salesPieChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy old chart if exists
    if ((canvas as any)._chartInstance) {
      (canvas as any)._chartInstance.destroy();
    }

    const labels = dummyData.map((item) => item.type);
    const data = dummyData.map((item) => item.amount);

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales Breakdown',
            data,
            backgroundColor: ['#4ade80', '#f87171'], // green, red
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
      plugins: [
        {
          id: 'customDataLabels',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            const { datasets } = chart.data;
            const total = datasets[0].data.reduce((sum, value) => sum + value, 0);

            chart.data.datasets.forEach((dataset, datasetIndex) => {
              chart.getDatasetMeta(datasetIndex).data.forEach((datapoint, index) => {
                const { x, y } = datapoint.tooltipPosition(true);
                const value = dataset.data[index];
                const percentage = ((value / total) * 100).toFixed(1);

                // Draw text
                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${percentage}%`, x, y);
                ctx.restore();
              });
            });
          },
        },
      ],
    });

    (canvas as any)._chartInstance = chart;
  });

  return (
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md my-10">
      <h2 class="text-xl font-bold mb-4 text-center">📊 Cash vs Debt Sales</h2>
      <canvas id="salesPieChart" height="250"></canvas>
    </div>
  );
});