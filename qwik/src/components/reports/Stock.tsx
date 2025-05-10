// src/components/StockLevelChart.tsx
import { component$, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";

export const StockComponent = component$(() => {
  useVisibleTask$(() => {
    const canvas = document.getElementById("stockChart") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const stockLevels = [60, 55, 50, 40, 30, 20, 10]; // dummy decreasing stock

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "Stock Quantity",
            data: stockLevels,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Stock Units" },
          },
          x: {
            title: { display: true, text: "Day" },
          },
        },
      },
    });
  });

  return (
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mb-10">
      <h2 class="text-xl font-bold mb-4">📦 Stock Level Status</h2>
      <canvas id="stockChart" height="250"></canvas>
    </div>
  );
});
