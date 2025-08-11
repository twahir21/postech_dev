// cache products in a shop

import { eq, ilike } from "drizzle-orm";
import { mainDb } from "../schema/connections/mainDb";
import { redisClient } from "../schema/connections/Redis";
import { products } from "../schema/shop";

// 1. Define keys
const PRODUCTS_CACHE_KEY = (shopId: string) => `products:${shopId}`;
const SEARCH_PRODUCTS_CACHE_KEY = (shopId: string) => `allproducts:${shopId}`;

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

export const getSearchProducts = async (shopId: string, query: string ) => {
    console.time("getSearchProducts");
    const cacheKey =  SEARCH_PRODUCTS_CACHE_KEY(shopId);
    const cached = await redisClient.get(cacheKey);
    if (cached){
        console.log("cached search products is found!")
        console.timeEnd("getSearchProducts");
        return JSON.parse(cached)
    };

    const freshData = await mainDb
      .select({ name: products.name })
      .from(products)
      .where(
        eq(products.shopId, shopId) &&
        ilike(products.name, `%${query}%`)
      );

    await redisClient.setEx(cacheKey, 86400, JSON.stringify(freshData)); // 24h cache
    console.timeEnd("getSearchProducts");
    return freshData;
}

// 3. clear product caches in Redis
export async function clearProductsCache(shopId: string) {
    await redisClient.del(PRODUCTS_CACHE_KEY(shopId));
}

export async function clearSearchProductsCache(shopId: string) {
    await redisClient.del(SEARCH_PRODUCTS_CACHE_KEY(shopId));
}


