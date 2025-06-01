// src/components/SalesGraph.tsx
import { component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import Chart from 'chart.js/auto';
import { netExpensesGraph, netPurchasesGraph, netSalesGraph, salesGraph } from '../context/store/netSales';

export const Salexp = component$(() => {
  // Get context values with proper typing
  const { netSales } = useContext(netSalesGraph);
  const { netExpenses } = useContext(netExpensesGraph);
  const { netPurchases } = useContext(netPurchasesGraph);
  const { sales } = useContext(salesGraph);

  // Prepare chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    sales: sales.value.map((s) => s.Sales),
    purchases: netPurchases.value.map((p) => p.netPurchases),
    expenses: netExpenses.value.map((e) => e.netExpenses),
    netSales: netSales.value.map((s) => s.netSales),
  };

  useVisibleTask$(() => {
    const canvas = document.getElementById('salesGraph') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance if exists
    if ((canvas as any)._chartInstance) {
      (canvas as any)._chartInstance.destroy();
    }

    // Create new chart
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Mauzo',
            data: chartData.sales,
            backgroundColor: '#4ade80', // Green
            stack: 'combined',
          },
          {
            label: 'Manunuzi',
            data: chartData.purchases.map((value) => -value), // Display as negative bars
            backgroundColor: '#facc15', // Yellow
            stack: 'combined',
          },
          {
            label: 'Gharama',
            data: chartData.expenses.map((value) => -value), // Display as negative bars
            backgroundColor: '#f87171', // Red
            stack: 'combined',
          },
          {
            label: 'Faida',
            data: chartData.netSales,
            backgroundColor: '#3b82f6', // Blue
            stack: 'separate', // Separate stacking group
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = typeof context.raw === 'number' ? context.raw : 0;
                return `${label}: ${Math.abs(value)}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
      },
    });

    (canvas as any)._chartInstance = chart;
  });

  return (
    <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md my-10">
      <h2 class="text-xl font-bold mb-4 text-center">📊 Mauzo, Manunuzi, Gharama, na Faida</h2>
      <canvas id="salesGraph" height={300}></canvas>
    </div>
  );
});