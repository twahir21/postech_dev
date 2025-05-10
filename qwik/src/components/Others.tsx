import { component$ } from '@builder.io/qwik';

export const OthersComponent = component$(() => {


    // Dummy analytics data
    const analytics = {
        totalSales: 125000,
        totalProfit: 48000,
        totalExpenses: 32000,
        netProfit: 16000,
        mostSold: [
          { name: 'Soda 500ml', sold: 150 },
          { name: 'Bread', sold: 120 },
          { name: 'Sugar 1kg', sold: 90 },
        ],
        lowestStock: [
          { name: 'Milk 1L', stock: 2 },
          { name: 'Cooking Oil 500ml', stock: 4 },
        ],
      };

  return (
<div class="p-4 space-y-4">

{/* Most Sold Products */}
<div class="bg-white border rounded shadow p-4">
  <h2 class="text-lg font-semibold mb-2">🔥 Most Sold Products</h2>
  <ul class="space-y-1">
    {analytics.mostSold.map((item) => (
      <li key={item.name} class="flex justify-between border-b pb-1">
        <span>{item.name}</span>
        <span>{item.sold} pcs</span>
      </li>
    ))}
  </ul>
</div>

{/* Lowest Stock */}
<div class="bg-white border rounded shadow p-4">
  <h2 class="text-lg font-semibold mb-2">📉 Low Stock Warning</h2>
  <ul class="space-y-1">
    {analytics.lowestStock.map((item) => (
      <li key={item.name} class="flex justify-between border-b pb-1 text-red-600">
        <span>{item.name}</span>
        <span>{item.stock} left</span>
      </li>
    ))}
  </ul>
</div>
</div>
);
});
