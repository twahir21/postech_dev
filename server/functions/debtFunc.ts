import { and, asc, desc, eq, sql } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { customers, debtPayments, debts } from "../database/schema/shop";
import { sanitizeNumber } from "./security/xss";
import Decimal from "decimal.js";

// Define types for better TypeScript safety
interface DebtStatistics {
  totalDebts: number;
  totalDebters: number;
  totalRemaining: number;
  lastPayment: Date | null;
}

interface CustomerDebt {
  customerId: string;
  name: string;
  totalDebt: string;
  remainingAmount: string;
  lastPaymentDate: Date | null;
}

interface DebtPaymentHistory {
  customerId: string;
  name: string;
  totalPaid: number;
  paymentDate: Date;
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

  // Get paginated customer debts (sorted by highest remaining debt)
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


  return {
    success: true,
    data: [{
        statistics: stats as DebtStatistics,
        customerDebts: customerDebts as CustomerDebt[],
        recentPayments: paymentHistory as DebtPaymentHistory[],
        pagination: {
        currentPage: page,
        pageSize,
        totalCount: await getTotalDebtersCount(shopId)
        }
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

// Helper function to get total count (for proper pagination)
async function getTotalDebtersCount(shopId: string) {
  const [result] = await mainDb.select({
    count: sql<number>`COUNT(DISTINCT ${debts.customerId})`,
  }).from(debts).where(eq(debts.shopId, shopId));
  return result.count;
}

export const payDebt = async ({ shopId, userId, body }: { shopId: string; userId: string; body: { amountPaid: number, customerId: string, debtId: string } }): Promise<{ success: boolean, data?: unknown, message: string }> => {
  try {
    let { amountPaid, customerId, debtId } = body;

    amountPaid = sanitizeNumber(amountPaid);

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

    console.log(remainingAmount.remainingAmount, typeof remainingAmount.remainingAmount);
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