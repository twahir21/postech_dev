import { eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { products, customers } from "../database/schema/shop"; // Added customers table
import { redisClient } from "../database/schema/connections/Redis";

// Improved version with caching strategy and proper error handling
export const fallbackExtractor = async (shopId: string, sentence: string) => {
    try {
        // 1. Check Redis cache first
        // const cachedResult = await redisClient.get(`match:${shopId}:${sentence}`);
        // console.log("Redis keys: ", await redisClient.flushAll());
        // if (cachedResult) {
        //     return JSON.parse(cachedResult);
        // }

        // 2. Fetch products and customers from DB if not cached
        const [prdRows, custRows] = await Promise.all([
            mainDb.select({ name: products.name })
                .from(products)
                .where(eq(products.shopId, shopId)),
                
            mainDb.select({ name: customers.name })
                .from(customers)
                .where(eq(customers.shopId, shopId))
        ]);

        if (prdRows.length === 0 || custRows.length === 0) {
            return {
                success: false,
                message: "Hakuna bidhaa au wateja waliyosajiliwa"
            };
        }

        


        // 3. Preprocess names (lowercase and trim)
        const productNames = prdRows.map(r => r.name.trim().toLowerCase());
        const customerNames = custRows.map(r => r.name.trim().toLowerCase());

        console.log("Product names:", productNames);
        console.log("Customer names:", customerNames);

        // 4. Find matches using optimized sliding window
        const foundMatches = await findMatches(sentence.toLowerCase(), productNames, customerNames);

        // 5. Cache results for future requests (TTL 1 hour)
        // await redisClient.setEx(
        //     `match:${shopId}:${sentence}`,
        //     3600,
        //     JSON.stringify(foundMatches)
        // );

        return foundMatches;

    } catch (error) {
        console.error("Extraction error:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hitilafu ya ghafla"
        };
    }
};

// Optimized matching function
async function findMatches(sentence: string, productNames: string[], customerNames: string[]) {
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
    return {
        success: true,
        products: foundProducts,
        customers: foundCustomers,
        sentence
    };
}