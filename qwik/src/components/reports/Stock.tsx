// src/components/StockLevelChart.tsx
import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";
import { stockGraph } from "../context/store/netSales";

export const StockComponent = component$(() => {
    const { stock } = useContext(stockGraph);
  
  useVisibleTask$(() => {
    const canvas = document.getElementById("stockChart") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const days = stock.value.map(item => item.day);
    const stockLevels = stock.value.map(item => item.totalStock);

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
      <canvas id="stockChart" height="250"></canvas>
    </div>
  );
});
