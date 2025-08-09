import { eq, sql } from "drizzle-orm";
import { mainDb } from "../../database/schema/connections/mainDb";
import { products, purchases, sales } from "../../database/schema/shop";

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
}) => {
  try {
    console.log("NetProfit: ", netProfit);
    
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Hitilafu kwenye seva"
    };
  }
};
