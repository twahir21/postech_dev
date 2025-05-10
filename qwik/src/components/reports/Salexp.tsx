// src/components/SalesGraph.tsx
import { component$, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";

export const Salexp = component$(() => {
  // Dummy data for sales, purchases, and expenses
  const dummyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    sales: [500, 600, 700, 800, 900, 1000, 1100], // Positive values
    purchases: [200, 250, 300, 350, 400, 450, 500], // Negative values
    expenses: [50, 75, 100, 125, 150, 175, 200], // Negative values
  };

  // Calculate net sales (sales - purchases - expenses)
  const netSales = dummyData.sales.map(
    (sale, index) => sale - dummyData.purchases[index] - dummyData.expenses[index]
  );

  useVisibleTask$(() => {
    const canvas = document.getElementById("salesGraph") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Destroy old chart instance if it exists
    if ((canvas as any)._chartInstance) {
      (canvas as any)._chartInstance.destroy();
    }

    // Create the chart
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dummyData.labels,
        datasets: [
          {
            label: "Sales",
            data: dummyData.sales,
            backgroundColor: "#4ade80", // Green
            stack: "combined",
          },
          {
            label: "Purchases",
            data: dummyData.purchases.map((value) => -value), // Negative values
            backgroundColor: "#facc15", // Yellow
            stack: "combined",
          },
          {
            label: "Expenses",
            data: dummyData.expenses.map((value) => -value), // Negative values
            backgroundColor: "#f87171", // Red
            stack: "combined",
          },
          {
            label: "Net Sales",
            data: netSales,
            backgroundColor: "#3b82f6", // Blue
            stack: "separate", // Separate stack for net sales
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const value = typeof context.raw === "number" ? context.raw : 0;
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
      <h2 class="text-xl font-bold mb-4 text-center">📊 Sales, Purchases, Expenses, and Net Sales</h2>
      <canvas id="salesGraph" height="300"></canvas>
    </div>
  );
});