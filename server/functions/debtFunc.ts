import { and, asc, desc, eq, sql } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { customers, debtPayments, debts, products } from "../database/schema/shop";
import { sanitizeNumber } from "./security/xss";
import Decimal from "decimal.js";
import type { MergedCustomerData } from "../types/types";

// Define types for better TypeScript safety
interface DebtStatistics {
  totalDebts: number;
  totalDebters: number;
  totalRemaining: number;
  lastPayment: Date | null;
}


// Combined query with pagination
export async function debtFunc ({ shopId, userId, query }: { shopId: string, userId: string, query: { page: number, pageSize: number } }): Promise<{ success: boolean, data?: unknown, message: string }> {
    try {
    const { page, pageSize } = query;

  // First get the statistical data
  const [stats] = await mainDb.select({
    totalDebts: sql<number>`SUM(${debts.totalAmount})`,
    totalDebters: sql<number>`COUNT(DISTINCT ${debts.customerId})`,
    totalRemaining: sql<number>`SUM(${debts.remainingAmount})`,
    lastPayment: sql<Date | null>`MAX(${debts.lastPaymentDate})`,
  }).from(debts).where(eq(debts.shopId, shopId));

  // Madeni yaliyolipwa (fully paid debts)
  const fullyPaidDebtsCount = await mainDb.select({
    count: sql<number>`COUNT(*)`
  }).from(debts).where(and(
    eq(debts.shopId, shopId),
    eq(debts.remainingAmount, "0.00")
  ));

  // Malipo yaliyokusanywa (total amount paid)
  const [totalCollected] = await mainDb.select({
    total: sql<number>`SUM(${debtPayments.amountPaid})`
  }).from(debtPayments).where(eq(debtPayments.shopId, shopId));


  //-------------------------------------------------------------------
  // Get paginated customer debts (sorted by highest remaining debt)
  //-------------------------------------------------------------------
  const customerDebts = await mainDb.select({
    debtId: debts.id,
    customerId: debts.customerId,
    name: customers.name,
    totalDebt: debts.totalAmount,
    remainingAmount: debts.remainingAmount,
    lastPaymentDate: debts.lastPaymentDate,
    createdAt: debts.createdAt
  })
    .from(debts)
    .innerJoin(customers, eq(debts.customerId, customers.id))
    .where(and(
      eq(debts.shopId, shopId),
      eq(customers.shopId, shopId)
    ))
    .orderBy(desc(debts.remainingAmount))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  // Get recent payment history for the dashboard
    const paymentHistory = await mainDb.select({
      customerId: customers.id,
      name: customers.name,
      totalPaid: sql<number>`SUM(${debtPayments.amountPaid})`,
      paymentDate: sql<Date>`MAX(${debtPayments.paymentDate})`,
    })
      .from(debtPayments)
      .innerJoin(customers, eq(debtPayments.customerId, customers.id)) 
      .where(and(
        eq(debtPayments.shopId, shopId),
        eq(customers.shopId, shopId)
      ))
      .groupBy(customers.id, customers.name)
      .orderBy(desc(sql`MAX(${debtPayments.paymentDate})`))
      .limit(5);

  // fuse recentPayment, total debts, and debtReceipt.
  // receipt data (grouping by date ...)
  const debtReceipts = await mainDb
    .select({
      date: sql`DATE(${debts.createdAt})`.as('date'),
      customerId: debts.customerId,
      product: products.name,
      quantity: debts.quantity,
      priceSold: debts.priceSold,
      total: debts.totalSales,
    })
    .from(debts)
    .innerJoin(products, eq(debts.productId, products.id))
    .where(eq(debts.shopId, shopId))
    .orderBy(desc(debts.createdAt))


    
    const resultMap = new Map<string, any>();

// Initialize with customerDebts
for (const debt of customerDebts) {
  resultMap.set(debt.customerId, {
    ...debt,
    payment: null,
    receipts: []
  });
}

// Merge paymentHistory
for (const payment of paymentHistory) {
  if (resultMap.has(payment.customerId)) {
    resultMap.get(payment.customerId).payment = {
      totalPaid: payment.totalPaid,
      lastPayment: payment.paymentDate
    };
  }
}

// Merge debtReceipts
for (const receipt of debtReceipts) {
  const customer = resultMap.get(receipt.customerId);
  if (customer) {
    customer.receipts.push({
      date: receipt.date,
      product: receipt.product,
      quantity: receipt.quantity,
      priceSold: receipt.priceSold,
      total: receipt.total
    });
  }
}


const resultMap2 = new Map<string, MergedCustomerData>();

const mergedData: MergedCustomerData[] = Array.from(resultMap2.values());
const paginatedData: MergedCustomerData[] = mergedData.slice((page - 1) * pageSize, page * pageSize);

console.log(paginatedData);


const totalCustomDebt = await mainDb
  .select({ count: sql<number>`count(distinct ${debts.customerId})` })
  .from(debts)
  .where(eq(debts.shopId, shopId));

  console.log("Total debtors: ", totalCustomDebt[0].count)

  return {
    success: true,
    data: [{
        statistics: stats as DebtStatistics,
        madeniYaliyolipwa: fullyPaidDebtsCount[0].count,
        malipoYaliyokusanywa: totalCollected.total || 0,
        totalCollected: Number(totalCollected.total) || 0,
        pagination: {
        currentPage: page,
        pageSize,
        total: mergedData.length
        },
        paginatedData
    }],
    message: "Madeni ya wateja yamepatikana kwa mafanikio."
  };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Seva imeshindwa."
        }
    }
}

export const payDebt = async ({ shopId, userId, body }: { shopId: string; userId: string; body: { amountPaid: number, customerId: string, debtId: string } }): Promise<{ success: boolean, data?: unknown, message: string }> => {
  try {
    let { amountPaid, customerId, debtId } = body;

    amountPaid = sanitizeNumber(amountPaid);

    // validate
    const debtValue = await mainDb.select({
      amount: debts.remainingAmount
    }).from(debts).where(and(
      eq(debts.id, debtId),
      eq(debts.shopId, shopId),
      eq(debts.customerId, customerId)
    )).then(res => res[0]);

    if (amountPaid > Number(debtValue.amount)) {
      return {
        success: false,
        message: "Kiasi cha kulipia hakiwezi kuzidi deni. Ingiza taarifa vizuri"
      };
    }

    await mainDb.insert(debtPayments).values({
      customerId,
      amountPaid: amountPaid.toString().trim(),
      debtId,
      shopId
    });

    // get remaining amount
    const [remainingAmount] = await mainDb.select({
      remainingAmount: debts.remainingAmount
    }).from(debts).where(and(
      eq(debts.id, debtId),
      eq(debts.shopId, shopId)
    ));

    const newAmount = new Decimal(remainingAmount.remainingAmount)
        .minus(amountPaid)
        .toFixed(2); // keeps it as string with 2 decimal places

    // update 
    await mainDb.update(debts).set({
      remainingAmount: newAmount.toString(), 
      lastPaymentDate: new Date(Date.now()),
    }).where(and(
      eq(debts.id, debtId),
      eq(debts.shopId, shopId)
    ));

    return {
      success: true,
      message: "Taarifa zimebadilishwa kwa mafanikio"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Seva imeshindwa."
    };
  }
};