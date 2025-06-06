import { desc, eq, sql } from "drizzle-orm"
import { mainDb } from "../database/schema/connections/mainDb"
import { expenses } from "../database/schema/shop"

interface ExpensesItems {
  success: boolean;
  message: string;
  data?: {
    totalAmount: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    items: Array<{
      description: string;
      amount: string;
      date: Date | null;
    }>;
  }[];
}

export const expFunc = async ({ shopId, userId, page = 1, limit = 5 }: { shopId: string; userId: string; page?: number; limit?: number }): Promise<ExpensesItems> => {
  try {
    // 1. Get total amount
    const totalAmountResult = await mainDb
      .select({
        totalAmount: sql<number>`SUM(${expenses.amount})`.as('total'),
      })
      .from(expenses)
      .where(eq(expenses.shopId, shopId));

    const totalAmount = Number(totalAmountResult[0]?.totalAmount ?? 0);

    // 2. Get total count for pagination
    const [{ count }] = await mainDb
      .select({ count: sql<number>`COUNT(*)` })
      .from(expenses)
      .where(eq(expenses.shopId, shopId));

    const totalItems = count ?? 0;
    const totalPages = Math.ceil(totalItems / limit);

    // 3. Get paginated expense items
    const expenseItems = await mainDb
      .select({
        description: expenses.description,
        amount: expenses.amount,
        date: expenses.date,
        id: expenses.id
      })
      .from(expenses)
      .where(eq(expenses.shopId, shopId))
      .orderBy(desc(expenses.date))
      .offset((page - 1) * limit)
      .limit(limit);

    return {
      success: true,
      message: 'Umefanikiwa kupata taarifa',
      data: [{
        totalAmount,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
        items: expenseItems,
      }],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : 'Hitilafu imetokea kwenye seva',
    };
  }
};

export const delExp = async ({ shopId, userId, expenseId }: {shopId: string; userId: string; expenseId: string }): Promise<{ success: boolean; message: string }> => {
  try {
      // delete from the database
      await mainDb.delete(expenses).where(eq(expenses.id, expenseId));

      return {
        success: true,
        message: "Umefanikiwa kufuta taarifa"
      }

  } catch (error) {
        return {
      success: false,
      message: error instanceof Error
        ? error.message
        : 'Hitilafu imetokea kwenye seva',
    };
  }
}