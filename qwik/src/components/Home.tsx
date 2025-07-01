import { component$, useContext, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { RecentProductsTable } from "./Recent";
import { Graph } from "./Graph";
import { CrudService } from "~/routes/api/base/oop";
import type { AnalyticsTypes } from "~/routes/api/types/analyTypes";
import { formatDateOnly, formatMoney, toSwahiliFraction } from "~/routes/function/helpers";
import { lowStockProductsData, netExpensesGraph, netPurchasesGraph, netSalesGraph, salesGraph, subscriptionData, trialEndData } from "./context/store/netSales";
import { RefetchContext } from "./context/refreshContext";
import { Loader } from "./ui/Loader";

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
    longDebt: "Hakuna" as string,
    amount: '0' as string,
    mostDebt: 'Hakuna' as string,
    amountDebt: '0' as string,
    prdUnit: 'Hakuna' as string,
    daysDebt: 'Hakuna' as string,
    lowestPrdName: '' as string,
    lowestPrdStock: 0 as number,
    productMessage: "Hakuna bidhaa zilizoorodheshwa" as string,
    subscription: "Msingi" as "Msingi" | "Lite" | "Business" | "Pro" | "AI" | "Trial",
    remainingDays: "Zimebaki siku 0" as string,
  });
  const isGraphReady = useSignal(false);
  const { netSales } = useContext(netSalesGraph);
  const { netExpenses } = useContext(netExpensesGraph);
  const { netPurchases } = useContext(netPurchasesGraph);
  const { sales } = useContext(salesGraph);
  const { trialEnd } = useContext(trialEndData);
  const { lowStockProducts } = useContext(lowStockProductsData);
  const { subscription } = useContext(subscriptionData);

  // refetch when changes occur in data
  const { productRefetch, refetchAnalytics } = useContext(RefetchContext);
  
useVisibleTask$(async ({ track }) => {
  // values to track;
  track(() => productRefetch.value); // track the refetch signal
  track(() => refetchAnalytics.value);

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

    // store low stock products
    lowStockProducts.value = analytics.lowStockProducts.map(product => ({
      name: product.name,
      priceSold: formatMoney(Number(product.priceSold)),
      stock: product.stock
    }));
    

    // store subscription
    subscription.value = analytics.subscription.trim() as "Msingi" | "Lite" | "Business" | "Pro" | "AI" | "Trial";

    console.log("Analytics: ", analytics);

    // most debt user
    analyticsStore.mostDebt = analytics.mostDebtUser.name;
    analyticsStore.amountDebt = formatMoney(Number(analytics.mostDebtUser.remainingAmount));

    // long debt user
    analyticsStore.longDebt = analytics.longTermDebtUser.name;
    analyticsStore.amount = formatMoney(Number(analytics.longTermDebtUser.remainingAmount));
    analyticsStore.daysDebt = formatDateOnly(analytics.longTermDebtUser.createdAt);

    // lowest stock product
    analyticsStore.lowestPrdName= analytics.lowestProduct.name;
    analyticsStore.lowestPrdStock = analytics.lowestProduct.stock;
    analyticsStore.prdUnit = analytics.lowestProduct.unit;

    // now allow rendering of the graph
    isGraphReady.value = true; // ✅ trigger Graph display only after data is ready

});

  return (
  <>
  {!isGraphReady.value ?(
    // Custom Loader
    <Loader />
  ):(
      <>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --------------------------------
                    FAIDA 
        -------------------------------- */}
        <div class="bg-blue-200 text-blue-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="profit" class="pr-1.5">💵</span> 
            Faida ya Jumla
          </h3>
          <p class="text-xl font-bold">{analyticsStore.profit}/=</p>
        </div>

        {/* --------------------------------
                    MAUZO YA  JUMLA
        -------------------------------- */}      
        <div class="bg-green-200 text-green-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="sales" class="pr-1.5">📈</span> 
            Mauzo ya Jumla
          </h3>
          <p class="text-xl font-bold">{analyticsStore.sales}/=</p>
        </div>


        {/* --------------------------------
                    JUMLA YA MANUNUZI
        -------------------------------- */}      
        <div class="bg-pink-200 text-pink-800 p-4 rounded-2xl shadow text-center">
            <h3 class="text-sm flex items-center justify-center">
              <span role="img" aria-label="return" class="pr-1.5">🛒</span> 
              Jumla ya Manunuzi
            </h3>
            <p class="text-1xl font-semibold">{analyticsStore.purchases}/=</p>
        </div>

        {/* --------------------------------
                    MATUMIZI YA JUMLA 
        -------------------------------- */}      
        <div class="bg-red-200 text-red-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="expenses" class="pr-1.5">💸</span> 
            Matumizi ya jumla
          </h3>
          <p class="text-xl font-semibold">{analyticsStore.expenses}/=</p>
        </div>

        {/* ------------------------------------------
                    BIDHAA YENYE FAIDA KUBWA
        ------------------------------------------ */}      
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

        {/* -------------------------------------
                    BIDHAA INAYOUZWA SANA
        ----------------------------------------- */}      
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


        {/* ------------------------------------
                    MTUMIAJI MWENYE DENI KUBWA
        ---------------------------------------- */}  
        { analyticsStore.subscription === "Msingi" ? (
          <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
            <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
            <h3 class="text-sm font-medium">Mtumiaji mwenye deni kubwa</h3>
            <p class="text-lg font-semibold mt-2">Lipia Lite au zaidi</p>
          </div>
        ) : (
          <div class="bg-[#EABDE6] text-red-800 p-4 rounded-2xl shadow text-center">
            <h3 class="text-sm flex items-center justify-center">
              <span role="img" aria-label="most-debt" class="pr-1.5">💳</span> 
              Mtumiaji mwenye deni kubwa
            </h3>
            <p class="text-lg font-semibold">{analyticsStore.mostDebt}  ( sh. {analyticsStore.amountDebt}/=)</p>
          </div>
        )}

        {/* ----------------------------------------------
                    ANAYEDAIWA DENI LA MUDA MREFU
        ------------------------------------------------- */}      
        { analyticsStore.subscription === "Msingi" ? (
          <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
            <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
            <h3 class="text-sm font-medium">Mtumiaji mwenye deni la muda mrefu</h3>
            <p class="text-lg font-semibold mt-2">Lipia Lite au zaidi</p>
          </div>
        ) : (
          <div class="bg-[#E5E3D4] text-yellow-800 p-4 rounded-2xl shadow text-center">
            <h3 class="text-sm flex items-center justify-center">
              <span role="img" aria-label="long-debt" class="pr-1.5">⏳</span> 
              Mtumiaji mwenye deni la muda mrefu
            </h3>
            <p class="text-lg font-semibold">{analyticsStore.longDebt} (sh. {analyticsStore.amount}/=)</p>

            <p class="text-md text-gray-600 italic">(Tangu: {analyticsStore.daysDebt})</p>

          </div>
        )}

        {/* -------------------------------------
                    HISA YA CHINI ZAIDI
        ---------------------------------------- */}      
        <div class="bg-orange-200 text-orange-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="low-stock" class="pr-1.5">⚠️</span> 
            Hisa ya chini zaidi
          </h3>
          <p class="text-lg font-semibold">
            {analyticsStore.lowestPrdName}  
          </p>
          <p class="text-md text-gray-600 italic">(Imebaki: {analyticsStore.prdUnit} {analyticsStore.lowestPrdStock})</p>
        </div>

        {/* --------------------------------
                    SAAS COUNTDOWN
        -------------------------------- */}      
        <div class="bg-indigo-200 text-indigo-800 p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="countdown" class="pr-1.5">⏰</span> 
            Kulipia Huduma
          </h3>
          <p class="text-lg font-semibold">{analyticsStore.remainingDays}</p>
        </div>

        {/* --------------------------------
                    BIDHAA ULIZOSAJILI
        -------------------------------- */}      
        <div class="bg-[#dd9ca9] text-[#6b2936] p-4 rounded-2xl shadow text-center">
          <h3 class="text-sm flex items-center justify-center">
            <span role="img" aria-label="countdown" class="pr-1.5">📦</span> 
            Bidhaa ulizosajili
          </h3>
          <p class="text-sm font-semibold">{analyticsStore.productMessage}</p>
        </div>

        {/* --------------------------------
                    KILICHOULIZIWA SANA
        -------------------------------- */}        
        { analyticsStore.subscription === "Msingi" ? (
            <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
              <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
              <h3 class="text-sm font-medium">Kilichouliziwa sana</h3>
              <p class="text-lg font-semibold mt-2">Lipia Lite au zaidi</p>
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
        <Graph />
        <RecentProductsTable />
      </>
)}
  </>
  );
});
