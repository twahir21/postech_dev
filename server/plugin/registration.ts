import Elysia from "elysia";
import { regPost } from "../functions/regFunc";
import { registerData } from "../functions/security/validators/data";
import type { headTypes } from "../types/types";
import { getTranslation } from "../functions/translation";
import { mainDb } from "../database/schema/connections/mainDb";
import { emailVerifications } from "../database/schema/shop";
import { eq } from "drizzle-orm";

const regPlugin = new Elysia()

    .post("/register", regPost, { body: registerData })

    .get("/verify-email", async ({ headers, query }) =>  {
        const lang = headers["accept-language"]?.split(",")[0] || "sw";
        const token = query.token;

        if (!token) {
            return {
                success: false,
                message: "Huwezi kusajiliwa bila email na tokeni sahihi"
            }
        }
    
        try {
            // checking token if valid and not expired
            const result = await mainDb.select().from(emailVerifications)
                .where(eq(emailVerifications.token, token));

            // check if exist
            if (result.length === 0) {
                return{
                    success: false,
                    message: "Token sio sahihi, fuata njia ya halali"
                }
            }

            // check if not expired
            if (new Date() > result[0].expiresAt) {
                return {
                    success: false,
                    message: "Token imeisha muda wake"
                }
            }

            // now save to production database
            // mark token as used
            await mainDb.update(emailVerifications).set({
                used: true
            }).where(eq(emailVerifications.token, token));

            // Save user to database and get the user ID
            const user = await mainDb.insert(users)
                .values({
                    username: result[0].username,
                    email,
                    password: hashedPassword,
                    phoneNumber
                })
                .returning({ id: users.id }) // Ensure ID is returned correctly
                .then(res => res[0]); // Extract first row

            if (!user) {
                return {
                    success: false,
                    message: sanitizeString(await getTranslation(lang, "userErr")),
                };
            }

            // Save shop to database and get the shop ID
            const shop = await mainDb.insert(shops)
                .values({
                    name,
                })
                .returning({ id: shops.id }) // Ensure ID is returned correctly
                .then(res => res[0]); // Extract first row

            if (!shop) {
                return {
                    success: false,
                    message: sanitizeString(await getTranslation(lang, "shopCreateErr")),
                };
            }

            // Save to shop_users table
            await mainDb.insert(shopUsers).values({
                shopId: shop.id,
                userId: user.id,
                role: "owner", // Since this is the shop creator
            });
            
            // automatic login
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error
                        ? error.message
                        : await getTranslation(lang, "serverErr")
            }
        }
    })

export default regPlugin