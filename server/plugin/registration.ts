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
            if (result[0].expiresAt > new Date(Date.now())){
                return {
                    success: false,
                    message: "Token imeisha muda wake"
                }
            }

            // now save to production database
            // redirect to login
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