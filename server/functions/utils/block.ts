import { eq } from "drizzle-orm";
import { mainDb } from "../../database/schema/connections/mainDb";
import { shopUsers } from "../../database/schema/shop";
import { isPaidCache } from "./caches";

export const blockUsage = async ({ shopId }: { shopId: string }) => {
  // 1. Generate unique cache key per shop
  const cacheKey = `shop:${shopId}:paid`;
  
  // 2. Check cache first
  const cachedIsPaid = isPaidCache.get(cacheKey);
  if (cachedIsPaid !== undefined) {
    if (cachedIsPaid === false) {
      return {
        success: false,
        message: "Kifurushi kimeisha, tafadhali lipia ili kuendelea."
      };
    }
  }

  // 3. Database fallback
  const dbResult = await mainDb.select({
    isPaid: shopUsers.isPaid
  })
  .from(shopUsers)
  .where(eq(shopUsers.shopId, shopId));

  const isPaid = dbResult[0]?.isPaid ?? false;

  // 4. Update cache
  isPaidCache.set(cacheKey, isPaid); 

  if (!isPaid) {
    return {
      success: false,
      message: "Kifurushi kimeisha, tafadhali lipia ili kuendelea."
    };
  }
};