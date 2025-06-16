import type { headTypes, registerRequest } from "../types/types"; 
import { mainDb } from "../database/schema/connections/mainDb";
import { emailVerifications, shops, users } from "../database/schema/shop";
import { hashPassword } from "./security/hash";
import { eq } from "drizzle-orm"; // Ensure this is imported for querying
import { sanitizeString } from "./security/xss";
import { shopCheckCache, userCheckCache } from "./utils/caches";
import { cacheStatsTracker } from "./utils/Stats";
import { v4 as uuidv4 } from 'uuid';
import { sendMagicLink } from "../plugin/email/register.email";




export const regPost = async ({ body, headers }: { body: registerRequest; headers: headTypes }) => {
    const frontendURL = process.env.NODE_ENV  === 'development' 
                        ? process.env.FRONTEND_URL_DEV!
                        : process.env.FRONTEND_URL!;
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
              message: "Email tayari imeshatumika"
            };
        }

        if (existingShopCached) {
            cacheStatsTracker.recordHit('shopCheckCache');
            return {
              success: false,
              message: "Duka tayari limesajiliwa"
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
            message: "Email tayari imeshatumika"
            };
        }
    
        if (existingShop.length > 0) {
            shopCheckCache.set(`shop:${name}`, { exists: true });
            return {
            success: false,
            message: "Duka tayari limesajiliwa"
            };
        }
        // verify email
        // Step 1: generate token
        const token = uuidv4();

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Step 2: store in DB
        await mainDb.insert(emailVerifications).values({
            token,
            email: body.email,
            password: hashedPassword,
            phone: body.phoneNumber,
            shopName: body.name,
            username: body.username,
            expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
            used: false
        });


        // Step 3: send email with magic link
        const link = `${frontendURL}/email?token=${token}`;

        await sendMagicLink({ link, frontendURL, email: body.email });

        return {
            success: true,
            message: "Ingia kwenye email yako kuhakiki",
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : sanitizeString("Hitilafu imetokea kwenye seva")
        }
    }
};
