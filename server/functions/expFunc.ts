import { and, desc, eq, sql } from "drizzle-orm"
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

export const expFunc = async ({
  shopId,
  userId,
  query
}: {
  shopId: string;
  userId: string;
  query: { page?: number; limit?: number };
}): Promise<ExpensesItems> => {
  try {
    const page = query.page || 1;
    const limit = query.limit || 5;

    // 1. Calculate total amount spent
    const [amountRow] = await mainDb
      .select({ totalAmount: sql<number>`SUM(${expenses.amount})`.as("total") })
      .from(expenses)
      .where(eq(expenses.shopId, shopId));

    const totalAmount = Number(amountRow?.totalAmount ?? 0);

    // 2. Get total item count for pagination
    const [countRow] = await mainDb
      .select({ count: sql<number>`COUNT(*)` })
      .from(expenses)
      .where(eq(expenses.shopId, shopId));

    const totalItems = countRow?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    // 3. Fetch paginated expense entries
    const items = await mainDb
      .select({
        id: expenses.id,
        description: expenses.description,
        amount: expenses.amount,
        date: expenses.date,
      })
      .from(expenses)
      .where(eq(expenses.shopId, shopId))
      .orderBy(desc(expenses.date))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      success: true,
      message: "Umefanikiwa kupata taarifa",
      data: [{
        totalAmount,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
        items,
      }],
    };

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Hitilafu imetokea kwenye seva",
    };
  }
};

export const delExp = async ({ shopId, userId, expenseId }: {shopId: string; userId: string; expenseId: string }): Promise<{ success: boolean; message: string }> => {
  try {
      // delete from the database
      await mainDb.delete(expenses).where(
        and(eq(expenses.shopId, shopId), eq(expenses.id, expenseId)));

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