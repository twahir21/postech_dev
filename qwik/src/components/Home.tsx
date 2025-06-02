import { component$, useContext, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { RecentProductsTable } from "./Recent";
import { Graph } from "./Graph";
import { CrudService } from "~/routes/api/base/oop";
import type { AnalyticsTypes } from "~/routes/api/types/analyTypes";
import { formatMoney, toSwahiliFraction } from "~/routes/function/helpers";
import { netExpensesGraph, netPurchasesGraph, netSalesGraph, salesGraph, trialEndData } from "./context/store/netSales";

export const HomeComponent = component$(() => {

  const analyticsStore = useStore({
    profit: "0" as string,
    sales: "0" as string,
    purchases: "0" as string,
    expenses: "0" as string,
    profitableProductname: 'hakuna' as string,
    profitableProductProfit: '0' as string,
    mostSoldPrdQuantity: "0" as string,
    mostSoldPrdname: 'hakuna' as string,
    productUnit: 'hakuna' as string,
    timessold: 0 as number,
    longDebt: "" as string,
    amount: '0' as string,
    mostDebt: '' as string,
    amountDebt: '0' as string,
    daysDebt: '' as string,
    lowestPrdName: '' as string,
    lowestPrdStock: 0 as number,
    productMessage: "Hakuna bidhaa zilizoorodheshwa" as string,
    subscription: "Trial" as string,
    remainingDays: "Zimebaki siku 0" as string,
  });
  const isGraphReady = useSignal(false);
  const { netSales } = useContext(netSalesGraph);
  const { netExpenses } = useContext(netExpensesGraph);
  const { netPurchases } = useContext(netPurchasesGraph);
  const { sales } = useContext(salesGraph);
  const { trialEnd } = useContext(trialEndData)

useVisibleTask$(async () => {
    const analyticsApi = new CrudService<AnalyticsTypes>("analytics");
    const analyticsData = await analyticsApi.get();
    if (!analyticsData.success) return;
    const analytics = analyticsData.data[0];

    // assign data to the store
    analyticsStore.profit = formatMoney(analytics.netProfit.netProfit);
    analyticsStore.sales = formatMoney(analytics.netProfit.totalSales);
    analyticsStore.expenses = formatMoney(analytics.netProfit.totalExpenses);
    analyticsStore.purchases = formatMoney(analytics.netProfit.totalPurchases);

    // profitable
    analyticsStore.profitableProductname = analytics.highestProfitProduct?.productname ?? 'Hakuna';
    analyticsStore.profitableProductProfit = formatMoney(analytics.highestProfitProduct?.profit ?? 0);
    // most sold maybe null
    analyticsStore.mostSoldPrdQuantity = toSwahiliFraction(analytics.mostSoldProductByQuantity?.totalquantitysold ?? 0);
    analyticsStore.mostSoldPrdname = analytics.mostSoldProductByQuantity?.productname ?? 'Hakuna';
    analyticsStore.timessold = analytics.mostSoldProductByQuantity?.timesSold ?? 0;
    analyticsStore.productUnit = analytics.mostSoldProductByQuantity?.unit ?? 'Hakuna';

    // message
    analyticsStore.productMessage = analytics.prodMessage;

    analyticsStore.subscription = analytics.subscription;
    analyticsStore.remainingDays = analytics.trialEnd;

    // store end date for SaaS
    trialEnd.value = analytics.trialEnd;
    // store netsales data
    netSales.value = analytics.netSalesByDay.map(data => ({
      day: data.day,
      netSales: data.netSales || 0 // ensure it's a number
    }));

    netExpenses.value = analytics.expensesByDay.map(data => ({
      day: data.day,
      netExpenses: data.expenses || 0 // ensure it's a number
    }));

    netPurchases.value = analytics.purchasesPerDay.map(data => ({
      day: data.day,
      netPurchases: data.purchases || 0 // ensure it's a number
    }));

    sales.value = analytics.salesByDay.map(data => ({
      day: data.day,
      Sales: data.sales || 0 // ensure it's a number
    }));

    console.log("Analytics: ", analytics);

    isGraphReady.value = true; // ✅ trigger Graph display only after data is ready

});

  return (
    <>
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Profit */}
      <div class="bg-blue-200 text-blue-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center">
          <span role="img" aria-label="profit" class="pr-1.5">💵</span> 
          Faida ya Jumla
        </h3>
        <p class="text-xl font-bold">{analyticsStore.profit}/=</p>
      </div>

      {/* Total Sales */}
      <div class="bg-green-200 text-green-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center">
          <span role="img" aria-label="sales" class="pr-1.5">📈</span> 
          Mauzo ya Jumla
        </h3>
        <p class="text-xl font-bold">{analyticsStore.sales}/=</p>
      </div>


      {/* Total Purchases */}
      <div class="bg-pink-200 text-pink-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="return" class="pr-1.5">🛒</span> 
            Jumla ya Manunuzi
          </h3>
          <p class="text-1xl font-semibold">{analyticsStore.purchases}/=</p>
      </div>

      {/* Total Expenses */}
      <div class="bg-red-200 text-red-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center">
          <span role="img" aria-label="expenses" class="pr-1.5">💸</span> 
          Matumizi ya jumla
        </h3>
        <p class="text-xl font-semibold">{analyticsStore.expenses}/=</p>
      </div>

      {/* Most Profitable Product */}
      <div class="bg-yellow-200 text-yellow-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center">
          <span role="img" aria-label="product" class="pr-1.5">🛒</span> 
          Bidhaa yenye faida kubwa
        </h3>

        <p class="text-lg font-semibold mt-2">
          {analyticsStore.profitableProductname}
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-2 text-md mt-1">
          <span class="bg-purple-50 px-3 py-1 rounded-full shadow-sm">
            Faida ni {analyticsStore.profitableProductProfit}/=          
          </span>
        </div>
      </div>

      {/* Most Sold Product */}
      <div class="bg-purple-200 text-purple-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center font-medium">
          <span role="img" aria-label="sold" class="pr-1.5">🔥</span>
          Bidhaa inayouzwa sana
        </h3>
        <p class="text-lg font-semibold mt-2">
          {analyticsStore.mostSoldPrdname}
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-2 text-sm mt-1">
          <span class="bg-purple-100 px-3 py-1 rounded-full shadow-sm">
            {analyticsStore.productUnit}: {analyticsStore.mostSoldPrdQuantity}
          </span>
          <span class="bg-purple-100 px-3 py-1 rounded-full shadow-sm">
            Mara: {analyticsStore.timessold}
          </span>
        </div>
      </div>


      {/* Most Debt User */}
      { analyticsStore.subscription === "Msingi" ? (
        <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
          <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
          <h3 class="text-sm font-medium">Mtumiaji mwenye deni kubwa</h3>
          <p class="text-lg font-semibold mt-2">Fungua kifurushi cha Pro kuona</p>
        </div>
      ) : (
        <div class="bg-red-200 text-red-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="most-debt" class="pr-1.5">💳</span> 
            Mtumiaji mwenye deni kubwa
          </h3>
          <p class="text-lg font-semibold">{analyticsStore.mostDebt} – ({analyticsStore.amountDebt}/=)</p>
          <p class="text-xs text-gray-600 italic">(Last payment: {analyticsStore.daysDebt})</p>
        </div>
      )}

      {/* Long Debt User */}
      { analyticsStore.subscription === "Msingi" ? (
        <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
          <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
          <h3 class="text-sm font-medium">Mtumiaji mwenye deni la muda mrefu</h3>
          <p class="text-lg font-semibold mt-2">Fungua kifurushi cha Pro kuona</p>
        </div>
      ) : (
        <div class="bg-yellow-200 text-yellow-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="long-debt" class="pr-1.5">⏳</span> 
            Mtumiaji mwenye deni la muda mrefu
          </h3>
          <p class="text-lg font-semibold">{analyticsStore.longDebt} – ({analyticsStore.amount}/=)</p>
        </div>
      )}

      {/* Low Stock */}
      <div class="bg-orange-200 text-orange-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center">
          <span role="img" aria-label="low-stock" class="pr-1.5">⚠️</span> 
          Hisa ya chini zaidi
        </h3>
        <p class="text-lg font-semibold">
          {analyticsStore.lowestPrdName} – ({analyticsStore.lowestPrdStock} units)
        </p>
      </div>

      {/* SaaS Countdown */}
      <div class="bg-indigo-200 text-indigo-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center">
          <span role="img" aria-label="countdown" class="pr-1.5">⏰</span> 
          Kulipia Huduma
        </h3>
        <p class="text-lg font-semibold">{analyticsStore.remainingDays}</p>
      </div>

      {/* Product registered */}
      <div class="bg-indigo-200 text-indigo-800 p-4 rounded-2xl shadow text-center">
        <h3 class="text-sm flex items-center justify-center">
          <span role="img" aria-label="countdown" class="pr-1.5">📦</span> 
          Bidhaa ulizosajili
        </h3>
        <p class="text-sm font-semibold">{analyticsStore.productMessage}</p>
      </div>

        {/* Top Asked Products */}
        { analyticsStore.subscription === "Msingi" ? (
          <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
            <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
            <h3 class="text-sm font-medium">Kilichouliziwa sana</h3>
            <p class="text-lg font-semibold mt-2">Fungua kifurushi cha Pro kuona</p>
        </div>
        ) : (
        <div class="bg-green-200 text-green-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="asked-product" class="pr-1.5">❓</span> 
            Kilichouliziwa sana
          </h3>
          <p class="text-1xl font-semibold">Moh Energy</p>
        </div>
        )}

        {/* Total Expired Products */}
        {/* <div class="bg-gray-200 text-gray-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="expired" class="pr-1.5">📅</span> 
            Jumla ya bidhaa zilizo-expire
          </h3>
          <p class="text-1xl font-semibold">0</p>
        </div> */}


      </div>
      {isGraphReady.value && <Graph />}
      <RecentProductsTable />
    </>
  );
});
