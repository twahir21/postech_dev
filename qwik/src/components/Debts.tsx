import { $, component$, useContext, useResource$, useSignal, useStore } from '@builder.io/qwik';
import { CrudService } from '~/routes/api/base/oop';
import { Toast } from './ui/Toast';
import { formatDateOnly, formatDateTime, formatMoney } from '~/routes/function/helpers';
import { Popup } from './ui/Popup';
import { Receipt } from './ui/Receipt';
import { RefetchContext } from './context/refreshContext';
import { subscriptionData } from './context/store/netSales';
import type { DataItemDebts, paginatedData } from '~/routes/api/types/debTypes';

export const DebtComponent = component$(() => {

  const modal = useStore({
    isOpen: false,
    message: '',
    isSuccess: false,
    allDebts: "0" as string,
    allDebters: 0 as number,
    arrData: {
      DebtData: [] as paginatedData[],
    },
    madeniYaliyokusanywa: 0 as number,
    madeniYaliyolipwa: 0 as number,
    totalCollected: 0 as number
  });
  // pages
  const currentPage = useSignal(1);
  const pageSize = 5;
  const totalPages = useSignal(1);

  // search
  const search = useSignal('');

  // global datas
  const { debtRefetch } = useContext(RefetchContext);
  const { subscription } = useContext(subscriptionData)

  const fetchDebts = $(async () => {
    const newApi = new CrudService<DataItemDebts>(`get-debts?page=${currentPage.value}&pageSize=${pageSize}`);

    const debtResults = await newApi.get();

    console.log(debtResults);


    if (!debtResults.success) {
      modal.isOpen = true;
      modal.message = debtResults.message || "Kuna tatizo katika kupata madeni.";
      modal.isSuccess = false;
      return;
    }

    // store total debts
    modal.allDebts = formatMoney(Number(debtResults.data[0].statistics.totalDebts))
    modal.allDebters = Number(debtResults.data[0].statistics.totalDebters);

    modal.madeniYaliyokusanywa = debtResults.data[0].madeniYaliyokusanywa;
    modal.madeniYaliyolipwa = debtResults.data[0].madeniYaliyolipwa;

    modal.totalCollected = debtResults.data[0].totalCollected;

    modal.arrData.DebtData = debtResults.data[0].paginatedData;


    // calculate total pages
    totalPages.value = Math.ceil(
      Number(debtResults.data[0].pagination.totalCount) / pageSize
    );
  });

  useResource$(async ({ track }) => {
    track(() => debtRefetch.value);

    fetchDebts();

    // reset trigger refetch
    debtRefetch.value = false;
  });



if (subscription.value === 'Msingi'){
  return (
    <>
      <div class="bg-gray-200 text-gray-500 p-4 rounded-2xl shadow text-center relative opacity-50">
        <div class="absolute top-2 right-2 text-sm text-gray-400">🔒</div>
        <h3 class="text-sm font-medium">Mchanganuo wa madeni</h3>
        <p class="text-lg font-semibold mt-2">Lipia Lite au zaidi</p>
      </div>
    </>
  )
}
const groupedDebts = modal.arrData.DebtData;
const paymentMap: Record<string, any[]> = {};

  return (
    <>
      <div class="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Summary */}
        <div class="bg-gray-50 rounded-xl shadow p-4 md:p-10 text-gray-800 border border-yellow-700 mb-4">
        <h2 class="text-lg md:text-2xl font-bold mb-3 text-gray-600">📊 Muhtasari wa Madeni</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
            <div class="bg-teal-100 p-3 rounded-xl">💰 Jumla ya Madeni: <strong>{modal.allDebts}/= TZS</strong></div>
            <div class="bg-yellow-100 p-3 rounded-xl">👥 Wateja Wenye Madeni: <strong>{modal.allDebters}</strong></div>
            <div class="bg-green-100 p-3 rounded-xl">✅ Madeni Yaliyolipwa: <strong>{modal.madeniYaliyolipwa}</strong></div>
            <div class="bg-blue-100 p-3 rounded-xl">📈 Malipo Yaliyokusanywa: <strong>{formatMoney(modal.totalCollected)} TZS</strong></div>
        </div>
        </div>

        {/* Debt Cards */}
        <div class="mt-20">
          <h2 class="text-2xl md:text-2xl font-bold mb-4  text-teal-700">📒 Madeni ya Wateja</h2>
          <input
            class="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="🔍 Tafuta kwa jina la mteja ..."
            value={search.value}
            onInput$={(e) => (search.value = (e.target as HTMLInputElement).value.toLowerCase())}
          />

          {
            modal.arrData.DebtData.length === 0 ?
            (
            <div class="w-full text-center text-gray-500 text-lg font-medium mt-5">
              Hakuna mteja aliyekopa.
            </div>
            ) : Object.values(groupedDebts).filter(debt => debt.name.toLowerCase().includes(search.value)).length === 0 ?
            (
              <div class="text-center text-gray-500 text-lg font-medium mt-5">
                Hakuna matokeo ya jina uliloandika.
              </div>
            )
            : (
              <div class="grid gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {
            Object.values(groupedDebts)
            .filter(debt => debt.name.toLowerCase().includes(search.value))
            .map((debt, index) => {
            const customerPayments = paymentMap[debt.customerId] ?? [];

            return (
              <div
                key={index}
                class="bg-white relative rounded-2xl shadow-md p-5 md:p-8 flex flex-col gap-4 border border-gray-200 hover:shadow-lg transition self-start"
              >
                <div class="flex justify-between items-center">
                  <h3 class="font-semibold text-lg md:text-xl text-gray-800">{debt.name}</h3>
                  <span class="text-sm text-gray-500">💳 {formatDateOnly(debt.createdAt)}</span>
                </div>

                <div class="text-sm md:text-base text-gray-600 space-y-1">
                  <p>💰 Jumla ya Deni: <span class="font-semibold text-red-600">{formatMoney(Number(debt.totalDebt))}/= </span></p>
                  <p>✅ Alicholipa: {formatMoney(Number(debt.totalDebt) - Number(debt.remainingAmount))}/=</p>
                  <p>🕒 Bado: <span class="font-semibold text-orange-600">{formatMoney(Number(debt.remainingAmount))}/=</span></p>
                  <p>📅 Malipo ya Mwisho: {formatDateTime((debt.lastPaymentDate) ?? "hakuna") || '—'}</p>
                </div>

                {customerPayments.length > 0 && (
                  <details class="mt-2 text-sm md:text-base">
                    <summary class="cursor-pointer text-blue-600 hover:underline">📜 Angalia Malipo</summary>
                    <ul class="ml-4 mt-1 list-disc text-gray-700">
                      {customerPayments.map((h, i) => (
                        <li key={i}>
                          Tarehe: {formatDateTime(h.paymentDate)}<br />
                          Kiasi: {formatMoney(Number(h.totalPaid))} TZS
                        </li>
                      ))}
                    </ul>
                  </details>
                )}


                {/* FIRE THE POPUP FORM  */}
                <Popup customerId={debt.customerId} debtId={debt.debtId} />

                <Receipt />
              </div>
            );
            })} 

              </div>
            )
          }
        </div>

        {/* Pagination */}
        <div class="flex justify-center mt-6 space-x-4">
          <button
            onClick$={() => {
              if (currentPage.value > 1) {
                currentPage.value--;
                fetchDebts();
              }
            }}
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={currentPage.value === 1}
          >
            ⬅️ Nyuma
          </button>
          <span class="px-4 py-2">{`Ukurasa ${currentPage.value} ya ${totalPages.value}`}</span>
          <button
            onClick$={() => {
              if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchDebts();
              }
            }}
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={currentPage.value === totalPages.value}
          >
            Mbele ➡️
          </button>
        </div>

        {/* Modal Popup */}
        {modal.isOpen && (
          <Toast
            isOpen={modal.isOpen}
            type={modal.isSuccess}
            message={modal.message}
            onClose$={$(() => {
              modal.isOpen = false;
          })}
          />
        )}
      </div>
    </>
  );
});
