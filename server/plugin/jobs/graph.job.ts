import { desc, eq, sql } from "drizzle-orm";
import { mainDb } from "../../database/schema/connections/mainDb";
import { products, sales } from "../../database/schema/shop";

export const graphJob = async ({ shopId }: { shopId: string }) => {
    try {
        // 1. calculate top 5 most profitable products
        const topProducts = await mainDb
            .select({
                productId: sales.productId,
                totalSales: sql`SUM(${sales.totalSales})`.as('totalSales'),
                productName: products.name
            })
            .from(sales)
            .innerJoin(products, eq(sales.productId, products.id))
            .where(eq(sales.shopId, shopId))
            .groupBy(sales.productId, products.name)
            .orderBy(desc(sql`SUM(${sales.totalSales})`))
            .limit(5);

            // 2. count stock
            const stockCount = await mainDb
                .select({
                    productId: products.id,
                    stock: products.stock
                })
                .from(products)
                .where(eq(products.shopId, shopId));

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Seva imeshindwa."
        }
    }
}