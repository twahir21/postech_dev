import { eq } from "drizzle-orm";
import { mainDb } from "../../database/schema/connections/mainDb";
import { shopUsers } from "../../database/schema/shop";
import { isPaidCache } from "./caches";
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, formatDistanceToNow } from 'date-fns';


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


export function timeRemainingUntil(dateStr: string): string {
  const targetDate = new Date(dateStr);
  const now = new Date();

  if (targetDate < now) return "Imepita";

  const minutes = differenceInMinutes(targetDate, now);
  const hours = differenceInHours(targetDate, now);
  const days = differenceInDays(targetDate, now);
  const months = differenceInMonths(targetDate, now);

  if (minutes < 60) return `Zimebaki dakika ${minutes}`;
  if (hours < 24) return `Zimebaki saa ${hours}`;
  if (days < 31) return `Zimebaki siku ${days}`;
  if (months < 12) return `Zimebaki miezi ${months}`;

  return `Zimebaki: ${formatDistanceToNow(targetDate, { addSuffix: true })}`;
}
