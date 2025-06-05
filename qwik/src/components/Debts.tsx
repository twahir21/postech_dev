import { $, component$, useResource$, useStore } from '@builder.io/qwik';
import { CrudService } from '~/routes/api/base/oop';
import { Toast } from './ui/Toast';
import type { CustomerDebt, DataItemDebts, RecentPayment } from '~/routes/api/types/debTypes';
import { formatDateOnly, formatDateTime, formatMoney } from '~/routes/function/helpers';
import { Popup } from './ui/Popup';
import { Receipt } from './ui/Receipt';

export const DebtComponent = component$(() => {
  // const dummyDebts = [
  //   {
  //     id: 1,
  //     customer: 'Juma Kipanga',
  //     total: 50000,
  //     paid: 20000,
  //     dueDate: '2025-04-30',
  //     lastPayment: '2025-04-14',
  //     history: [
  //       { date: '2025-04-10', amount: 30000 },
  //       { date: '2025-04-14', amount: 20000 },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     customer: 'Mwanaidi J.',
  //     total: 75000,
  //     paid: 0,
  //     dueDate: '2025-05-02',
  //     lastPayment: null,
  //     history: [],
  //   },
  // ];

  const modal = useStore({
    isOpen: false,
    message: '',
    isSuccess: false,
    allDebts: "0" as string,
    allDebters: 0 as number,
    arrData: {
      DebtData: [] as CustomerDebt[],
      recentPayments: [] as RecentPayment[]
    }
  });


  useResource$(async () => {
    const newApi = new CrudService<DataItemDebts>("get-debts?page=1&pageSize=10");

    const debtResults = await newApi.get();

    if (!debtResults.success) {
      modal.isOpen = true;
      modal.message = debtResults.message || "Kuna tatizo katika kupata madeni.";
      modal.isSuccess = false;
      return;
    }

    // store total debts
    modal.allDebts = formatMoney(Number(debtResults.data[0].statistics.totalDebts))
    modal.allDebters = Number(debtResults.data[0].statistics.totalDebters);

    modal.arrData.DebtData = debtResults.data[0].customerDebts;
    modal.arrData.recentPayments = debtResults.data[0].recentPayments;
  });

  // Combine debts for same customer
const groupedDebts = Object.values(
  modal.arrData.DebtData.reduce((acc, debt) => {
    const id = debt.customerId;
    if (!acc[id]) {
      acc[id] = { ...debt }; // first instance
    } else {
      // Merge debts
      acc[id].totalDebt = (
        Number(acc[id].totalDebt) + Number(debt.totalDebt)
      ).toString();
      acc[id].remainingAmount = (
        Number(acc[id].remainingAmount) + Number(debt.remainingAmount)
      ).toString();
      // keep latest lastPaymentDate
      const current = new Date(acc[id].lastPaymentDate || '');
      const incoming = new Date(debt.lastPaymentDate || '');
      if (incoming > current) {
        acc[id].lastPaymentDate = debt.lastPaymentDate;
      }
    }
    return acc;
  }, {} as Record<string, CustomerDebt>)
);


  return (
    <>
      <div class="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Summary */}
        <div class="bg-gray-50 rounded-xl shadow p-4 md:p-10 text-gray-800 border border-yellow-700 mb-4">
        <h2 class="text-lg md:text-2xl font-bold mb-3 text-gray-600">📊 Muhtasari wa Madeni</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
            <div class="bg-teal-100 p-3 rounded-xl">💰 Jumla ya Madeni: <strong>{modal.allDebts}/= TZS</strong></div>
            <div class="bg-yellow-100 p-3 rounded-xl">👥 Wateja Wenye Madeni: <strong>{modal.allDebters}</strong></div>
            <div class="bg-green-100 p-3 rounded-xl">✅ Madeni Yaliyolipwa: <strong>1</strong></div>
            <div class="bg-blue-100 p-3 rounded-xl">📈 Malipo Yaliyokusanywa: <strong>6,000 TZS</strong></div>
        </div>
        </div>

        {/* Debt Cards */}
        <div class="mt-20">
          <h2 class="text-2xl md:text-2xl font-bold mb-4  text-teal-700">📒 Madeni ya Wateja</h2>
          <div class="grid gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {groupedDebts.length > 0 ? groupedDebts.map((debt, index) => {
              return (
                <div
                  key={index}
                  class="bg-white relative rounded-2xl shadow-md p-5 md:p-8 flex flex-col gap-4 border border-gray-200 hover:shadow-lg transition"
                >
                  <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-lg md:text-xl text-gray-800">{debt.name}</h3>
                    <span class="text-sm text-gray-500">💳 {formatDateOnly(debt.createdAt ?? "hakuna")}</span>
                  </div>

                  <div class="text-sm md:text-base text-gray-600 space-y-1">
                    <p>💰 Jumla ya Deni: <span class="font-semibold text-red-600">{formatMoney(Number(debt.totalDebt))}/= </span></p>
                    <p>✅ Alicholipa: {formatMoney(Number(debt.totalDebt) - Number(debt.remainingAmount))}/=</p>
                    <p>🕒 Bado: <span class="font-semibold text-orange-600">{formatMoney(Number(debt.remainingAmount))}/=</span></p>
                    <p>📅 Malipo ya Mwisho: {formatDateTime(debt.lastPaymentDate ?? "hakuna") || '—'}</p>
                  </div>

                  {modal.arrData.recentPayments.length > 0 && (
                    <details class="mt-2 text-sm md:text-base">
                      <summary class="cursor-pointer text-blue-600 hover:underline">📜 Angalia Malipo</summary>
                      {/* <ul class="ml-4 mt-1 list-disc text-gray-700">
                        {debt.lastPaymentDate!.map((h, i) => (
                          <li key={i}>
                            {h.date}: {h.amount.toLocaleString()} TZS
                          </li>
                        ))}
                      </ul> */}
                    </details>
                  )}

                  {/* FIRE THE POPUP FORM  */}
                  <Popup />

                  <Receipt />
                </div>
              );
              }) : (
                <div class="text-center text-gray-500 text-lg font-medium mt-5">
                  Hakuna mteja aliyekopa.
                </div>
              )}
          </div>
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
