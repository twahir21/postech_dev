// cache products in a shop

import { eq } from "drizzle-orm";
import { mainDb } from "../schema/connections/mainDb";
import { redisClient } from "../schema/connections/Redis";
import { products } from "../schema/shop";

// 1. Define keys
const PRODUCTS_CACHE_KEY = (shopId: string) => `products:${shopId}`;

// 2. Get cached products
export async function getCachedProducts(shopId: string): Promise<{ name: string }[]> {
    const cacheKey = PRODUCTS_CACHE_KEY(shopId);
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const freshData = await mainDb.select({ name: products.name })
        .from(products)
        .where(eq(products.shopId, shopId));

    await redisClient.setEx(cacheKey, 86400, JSON.stringify(freshData)); // 24h cache
    return freshData;
}

// 3. clear product caches in Redis
export async function clearProductsCache(shopId: string) {
    await redisClient.del(PRODUCTS_CACHE_KEY(shopId));
}


