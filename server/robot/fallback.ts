import { eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { products, customers } from "../database/schema/shop"; // Added customers table
import { redisClient } from "../database/schema/connections/Redis";
import { extractAction } from "../functions/utils/tense";
import crypto from 'crypto';

// Improved version with caching strategy and proper error handling
// Cache keys
const PRODUCTS_CACHE_KEY = (shopId: string) => `products:${shopId}`;
const CUSTOMERS_CACHE_KEY = (shopId: string) => `customers:${shopId}`;

// avoid long redis keys by hashing sentence
const hashSentence = (text: string) => 
  crypto.createHash('sha1').update(text).digest('hex');

const SENTENCE_CACHE_KEY = (shopId: string, sentence: string) => `sentence:${shopId}:${hashSentence(sentence)}`;


export const fallbackExtractor = async (shopId: string, sentence: string) => {
    console.time("fallbackExtractor");
    try {
        // 1. Check exact sentence cache first
        const exactSentenceKey = SENTENCE_CACHE_KEY(shopId, sentence);
        const cachedResult = await redisClient.get(exactSentenceKey);

        if (cachedResult) {
            console.log("Cached sentence found!")
            return JSON.parse(cachedResult);
        }


        // 2. Get products and customers with Redis caching
        const [prdRows, custRows] = await Promise.all([
            getCachedProducts(shopId),
            getCachedCustomers(shopId)
        ]);

        // 3. Preprocess names (lowercase and trim)
        const productNames = prdRows.map(r => r.name.trim().toLowerCase());
        const customerNames = custRows.map(r => r.name.trim().toLowerCase());


        // 4. Find matches using optimized sliding window
        const foundMatches = await findMatches(sentence.toLowerCase(), productNames, customerNames);


        // 5. Cache exact sentence match (TTL 1 hour)
        await redisClient.setEx(
            exactSentenceKey,
            3600,
            JSON.stringify(foundMatches)
        );

        return foundMatches;

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hitilafu ya ghafla"
        };
    }  finally {
        console.timeEnd("fallbackExtractor");
    }
};

// Optimized matching function
async function findMatches(
    sentence: string, 
    productNames: string[], 
    customerNames: string[]
): Promise<{
    success: boolean;
    message: string;
    data?:{
        actionDetected: {
        action: string;
        discount: number | null;
        quantity: number;
        usedFor: {
            usedForWhat: string;
            usedForAmount: number | null;
        } | null;
    },
    sentence: string;
    products: string;
    customers: string;
    }[]
}> {
    const words = sentence.split(/\s+/);
    const foundProducts: string[] = [];
    const foundCustomers: string[] = [];

    // Sort names by length (longest first) to ensure longest matches
    const sortedProducts = [...productNames].sort((a, b) => b.length - a.length);
    const sortedCustomers = [...customerNames].sort((a, b) => b.length - a.length);

    let i = 0;
    while (i < words.length) {
        let matched = false;

        // Check products (longest first)
        for (const product of sortedProducts) {
            const productWords = product.split(' ');
            const potentialMatch = words.slice(i, i + productWords.length).join(' ');
            
            if (potentialMatch === product) {
                foundProducts.push(product);
                i += productWords.length; // Skip ahead
                matched = true;
                break;
            }
        }
        if (matched) continue;

        // Check customers (longest first)
        for (const customer of sortedCustomers) {
            const customerWords = customer.split(' ');
            const potentialMatch = words.slice(i, i + customerWords.length).join(' ');
            
            if (potentialMatch === customer) {
                foundCustomers.push(customer);
                i += customerWords.length; // Skip ahead
                matched = true;
                break;
            }
        }
        if (matched) continue;

        i++; // No match, move to next word
    }
    // get action
    const actionDetected = extractAction(sentence, foundProducts[0], foundCustomers[0]);

    const condition = foundProducts.length === 0 && actionDetected.usedFor?.usedForAmount === 0
                    || foundProducts.length === 0 && actionDetected.usedFor === null;

    if (condition) {
        return {
            success: false,
            message: "Sentensi yako sio sahihi, hakukuwa na bidhaa iliyopatikana"
        }
    }

    if (actionDetected.action === 'kukopesha' && foundCustomers.length === 0) {
        return {
            success: false,
            message: "Mteja hajatambulika, kukopesha lazima mfumo umtambue mteja",
        }
    }

    return {
        success: true,
        data: [{
            products: foundProducts[0],
            customers: foundCustomers[0],
            actionDetected: actionDetected,
            sentence,
        }],
        message: "Sentensi imefanikiwa"
    };
}

// Cache helpers
async function getCachedProducts(shopId: string): Promise<{ name: string }[]> {
    const cacheKey = PRODUCTS_CACHE_KEY(shopId);
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const freshData = await mainDb.select({ name: products.name })
        .from(products)
        .where(eq(products.shopId, shopId));

    await redisClient.setEx(cacheKey, 86400, JSON.stringify(freshData)); // 24h cache
    return freshData;
}

async function getCachedCustomers(shopId: string): Promise<{ name: string }[]> {
    const cacheKey = CUSTOMERS_CACHE_KEY(shopId);
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const freshData = await mainDb.select({ name: customers.name })
        .from(customers)
        .where(eq(customers.shopId, shopId));

    await redisClient.setEx(cacheKey, 86400, JSON.stringify(freshData)); // 24h cache
    return freshData;
}

// Cache busters (call these when products/customers change)
export async function clearProductsCache(shopId: string) {
    await redisClient.del(PRODUCTS_CACHE_KEY(shopId));
}

export async function clearCustomersCache(shopId: string) {
    await redisClient.del(CUSTOMERS_CACHE_KEY(shopId));
}