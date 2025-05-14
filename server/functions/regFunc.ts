import type { headTypes, registerRequest } from "../types/types"; 
import { mainDb } from "../database/schema/connections/mainDb";
import { emailVerifications, shops, users } from "../database/schema/shop";
import { hashPassword } from "./security/hash";
import { getTranslation } from "./translation";
import { eq } from "drizzle-orm"; // Ensure this is imported for querying
import { sanitizeString } from "./security/xss";
import { shopCheckCache, userCheckCache } from "./utils/caches";
import { cacheStatsTracker } from "./utils/Stats";
import { v4 as uuidv4 } from 'uuid';



export const regPost = async ({ body, headers }: { body: registerRequest; headers: headTypes }) => {
    const lang = headers["accept-language"]?.split(",")[0] || "en";

    try {

        let { name, username, email, password, phoneNumber } = body as registerRequest;

        // 🛡️ **Sanitize Inputs** (takes 3ms)
        name = sanitizeString(name.trim().toLowerCase());
        username = sanitizeString(username.trim().toLowerCase());
        email = sanitizeString(email.trim());
        password = sanitizeString(password.trim());
        phoneNumber = sanitizeString(phoneNumber.trim());
        
        // Check if the email or user is already registered
        // 🧠 Try memory cache first
        const [existingUserCached, existingShopCached] = await Promise.all([
            userCheckCache.get(`user:${email}`),
            shopCheckCache.get(`shop:${name}`),
        ]);

        if (existingUserCached) {
            cacheStatsTracker.recordHit('userCheckCache');
            return {
              success: false,
              message: await getTranslation(lang, "emailExistsErr")
            };
        }

        if (existingShopCached) {
            cacheStatsTracker.recordHit('shopCheckCache');
            return {
              success: false,
              message: await getTranslation(lang, "shopExistsErr")
            };
          }

        // 🚦 Run DB checks in parallel (avoid select() and run one per time)
        // 🔍 If not cached, fetch from DB
        // save is missed
        cacheStatsTracker.recordMiss('userCheckCache');
        cacheStatsTracker.recordMiss('shopCheckCache');

        const [existingUser, existingShop] = await Promise.all([
            mainDb.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1),
            mainDb.select({ id: shops.id }).from(shops).where(eq(shops.name, name)).limit(1)
        ]);
    
        if (existingUser.length > 0) {
            userCheckCache.set(`user:${email}`, { exists: true });
            return {
            success: false,
            message: await getTranslation(lang, "emailExistsErr")
            };
        }
    
        if (existingShop.length > 0) {
            shopCheckCache.set(`shop:${name}`, { exists: true });
            return {
            success: false,
            message: await getTranslation(lang, "shopExistsErr")
            };
        }
        // verify email
        // Step 1: generate token
        const token = uuidv4();

        // Step 2: store in DB
        await mainDb.insert(emailVerifications).values({
            token,
            email: body.email,
            expiresAt: Date.now() + 20 * 60 * 1000,
            used: false
        });


        // Step 3: send email with magic link
        const link = `https://your-app.com/verify-email?token=${token}`;

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // // Save user to database and get the user ID
        // const user = await mainDb.insert(users)
        //     .values({
        //         username,
        //         email,
        //         password: hashedPassword,
        //         phoneNumber
        //     })
        //     .returning({ id: users.id }) // Ensure ID is returned correctly
        //     .then(res => res[0]); // Extract first row

        // if (!user) {
        //     return {
        //         success: false,
        //         message: sanitizeString(await getTranslation(lang, "userErr")),
        //     };
        // }

        // // Save shop to database and get the shop ID
        // const shop = await mainDb.insert(shops)
        //     .values({
        //         name,
        //     })
        //     .returning({ id: shops.id }) // Ensure ID is returned correctly
        //     .then(res => res[0]); // Extract first row

        // if (!shop) {
        //     return {
        //         success: false,
        //         message: sanitizeString(await getTranslation(lang, "shopCreateErr")),
        //     };
        // }

        // // Save to shop_users table
        // await mainDb.insert(shopUsers).values({
        //     shopId: shop.id,
        //     userId: user.id,
        //     role: "owner", // Since this is the shop creator
        // });

        return {
            success: true,
            message: sanitizeString(await getTranslation(lang, "regMessage")),
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : sanitizeString(await getTranslation(lang, "serverErr"))
        }
    }
};
