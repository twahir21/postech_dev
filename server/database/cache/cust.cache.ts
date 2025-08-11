// cache customers

import { eq } from "drizzle-orm";
import { redisClient } from "../schema/connections/Redis";
import { customers } from "../schema/shop";
import { mainDb } from "../schema/connections/mainDb";

// 1. Define keys
const CUSTOMERS_CACHE_KEY = (shopId: string) => `customers:${shopId}`;

// 2. Get cached customers
export async function getCachedCustomers(shopId: string): Promise<{ name: string }[]> {
    const cacheKey = CUSTOMERS_CACHE_KEY(shopId);
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const freshData = await mainDb.select({ name: customers.name })
        .from(customers)
        .where(eq(customers.shopId, shopId));

    await redisClient.setEx(cacheKey, 86400, JSON.stringify(freshData)); // 24h cache
    return freshData;
}

// 3. clear customer caches in Redis
export async function clearCustomersCache(shopId: string) {
    await redisClient.del(CUSTOMERS_CACHE_KEY(shopId));
}