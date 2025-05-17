import { mainDb } from '../../database/schema/connections/mainDb';
import { shops, users } from '../../database/schema/shop';
import { eq } from 'drizzle-orm';

const generateUsername = async (name: string): Promise<string> => {
    const base = name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, ''); // remove weird characters
    let suffix = Math.floor(Math.random() * 1000);
    let newUser = `${base}_${suffix}`;
    let attempts = 0;
    const maxAttempts = 5;
  
    while (attempts < maxAttempts) {
      const dbUser = await mainDb
        .select({ usr: users.username })
        .from(users)
        .where(eq(users.username, newUser));
  
      if (dbUser.length === 0) {
        return newUser;
      }
  
      suffix = Math.floor(Math.random() * 1000);
      newUser = `${base}_${suffix}`;
      attempts++;
    }
  
    // Fallback to a timestamp-based username to guarantee uniqueness
    return `${base}_${Date.now()}`;
  };

const generateShopName = async (name: string): Promise<string> => {
    const base = name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, ''); // remove weird characters
    let suffix = Math.floor(Math.random() * 10000);
    let newShop =  `${base}'s Shop_${suffix}`; // e.g., John's Shop_4567
    let attempts = 0;
    const maxAttempts = 5;
  
    while (attempts < maxAttempts) {
      const dbShop = await mainDb
        .select({ shop: shops.name })
        .from(shops)
        .where(eq(shops.name, newShop));
  
      if (dbShop.length === 0) {
        return newShop;
      }
  
      suffix = Math.floor(Math.random() * 10000);
      newShop = `${base}_${suffix}`;
      attempts++;
    }
  
    // Fallback to a timestamp-based username to guarantee uniqueness
    return `${base}'s Shop_${Date.now()}`;
  };

  type EntityType = 'user' | 'shop'; // use enum to type safer and cleaner

  export const createUser = async (anyName: string, type: EntityType) => {
    try {
        const name = type === 'user' ? await generateUsername(anyName) : await generateShopName(anyName);
  
      // ✅ Runtime type check (optional but safe)
      if (typeof name !== 'string') {
        return {
            success: false,
            message: "username sio string, haifai"
        }
      }
  
      return {
        success: true,
        data: name
      }

    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : " ❌ Tatizo wakati wa kutengeneza username"
      }
    }
  };
      