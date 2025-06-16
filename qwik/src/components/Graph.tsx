import { component$, useContext, useVisibleTask$ } from "@builder.io/qwik";
import { netSalesGraph } from "./context/store/netSales";

export const Graph = component$(() => {
  const { netSales } = useContext(netSalesGraph);

  useVisibleTask$(async () => {
    const ApexCharts = (await import("apexcharts")).default;

    const container = document.querySelector("#salesChart");
    if (!container) {
      console.warn("⚠️ Chart container not found");
      return;
    }

    if ((window as any)._apexChartInstance) {
      (window as any)._apexChartInstance.destroy();
    }

    const salesMap = new Map<string, number>();
    netSales.value.forEach((entry) => {
      salesMap.set(entry.day, entry.netSales);
    });

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = labels.map((day) => salesMap.get(day) || 0);

    const options = {
      chart: {
        type: "bar",
        height: 300,
        width: "100%",
      },
      series: [
        {
          name: "Faida",
          data,
        },
      ],
      xaxis: {
        categories: labels,
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true, // default: show
      },
      colors: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#64C864",
      ],
      title: {
        text: "Chati ya Faida",
        align: "center",
      },
      responsive: [
        {
          breakpoint: 640, // Tailwind 'sm'
          options: {
            chart: {
              height: 250,
            },
            dataLabels: {
              enabled: false, // ❌ hide bar text on mobile
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: { fontSize: "10px" },
              },
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(container, options);
    chart.render();

    (window as any)._apexChartInstance = chart;
  });

  return (
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 p-4 sm:p-8 rounded-lg shadow-lg border border-black mb-10 mt-6">
        {netSales.value.length === 0 ? (
          <p class="text-red-600 font-semibold">Hakuna taarifa kwa ajili ya kuchora.</p>
        ) : (
          <div id="salesChart" class="w-full"></div>
        )}
      </div>
    </div>
  );
});
