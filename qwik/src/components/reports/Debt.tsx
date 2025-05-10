// src/components/CustomerDebtsChart.tsx
import { component$, useVisibleTask$ } from "@builder.io/qwik";
import Chart from "chart.js/auto";

export const DebtComponentGraph =  component$(() => {
  useVisibleTask$(() => {
    const canvas = document.getElementById("debtsChart") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const customers = ["Ali", "Neema", "John", "Mary", "Omary", "Grace"];
    const debts = [50000, 42000, 35000, 27000, 25000, 19000];

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: customers,
        datasets: [
          {
            label: "Unpaid Debts (Tsh)",
            data: debts,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: "Debt (Tsh)" },
          },
          y: {
            title: { display: true, text: "Customers" },
          },
        },
      },
    });
  });

  return (
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-xl font-bold mb-4">📉 Customer Debts Overview</h2>
      <canvas id="debtsChart" height="250"></canvas>
    </div>
  );
});
