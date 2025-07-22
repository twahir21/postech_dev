import { and, eq } from "drizzle-orm";
import { mainDb } from "../../database/schema/connections/mainDb";
import { shopUsers } from "../../database/schema/shop";
import type { CookieTypes, DecodedToken,  jwtTypes } from "../../types/types";


export function isDecodedToken(token: unknown): token is DecodedToken {
    if (
      typeof token === 'object' &&
      token !== null
    ) {
      const t = token as Record<string, unknown>;
      return (
        typeof t.userId === 'string' &&
        typeof t.shopId === 'string'
      );
    }
  
    return false;
  }
  
  
  export const extractId = async ({ jwt, cookie, checkIsPaid }: { jwt: jwtTypes; cookie: CookieTypes; checkIsPaid?: boolean })=> {
    const token = cookie.auth_token?.value;
  
    const decoded = await jwt.verify(token);
  
    if (!token || !isDecodedToken(decoded)) {
      return {
        success: false,
        message: "Huna ruhusa! - Hakuna Tokeni au sio sahihi"
      }
    }
    const { userId, shopId } = decoded

    if (!shopId || !userId) {
      return {
        success: false,
        message: "Imeshindwa kupata credentials jaribu tena baadae"
      }
    }

    // check if user is paid 
  if (!checkIsPaid) {
      const isPaid = await mainDb.select({ isPaid: shopUsers.isPaid })
                .from(shopUsers).where(eq(shopUsers.shopId, shopId))
                .then(r => r[0].isPaid);

      if (!isPaid || isPaid === null ){
        return {
          success: false,
          message: "Tafadhali lipia account yako kufurahia huduma zetu."
        }
      }
  
    }
    // ✅ Now fully type-safe
    return { userId, shopId }
  };
  
