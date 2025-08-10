import { eq, sql } from "drizzle-orm";
import { mainDb } from "../../database/schema/connections/mainDb";
import { dailySales } from "../../database/schema/analytics.schema";

export interface NetProfitData {
  totalExpenses: number;
  totalSales: number;
  totalPurchases: number;
  netProfit: number;
}

export const getNetProfit = async ({
  netProfit
}: {
  netProfit: NetProfitData
}, shopId: string) => {
  try {
    // insert to database
    await mainDb.insert(dailySales).values({
      date: sql`now()`,
      totalSales: netProfit.totalSales.toString(),
      totalPurchases: netProfit.totalPurchases.toString(),
      totalExpenses: netProfit.totalExpenses.toString(),
      netProfit: netProfit.netProfit.toString(),
      shopId
    });    
    
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Hitilafu kwenye seva"
    };
  }
};
