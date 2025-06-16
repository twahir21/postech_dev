// plugins/resetPlugin.ts
import Elysia from "elysia";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { resetEmailData } from "../functions/security/validators/data";
import { passwordResets, users } from "../database/schema/shop";
import { mainDb } from "../database/schema/connections/mainDb";
import { sendResetEmail } from "./email/reset.email";

export const resetPlugin = new Elysia()
  .post("/reset-password", async ({ body }): Promise<{ success: boolean; message: string}> => {
    const { email } = body as { email: string };

    // 1. Check if user exists
    const user = await mainDb.select().from(users).where(eq(users.email, email)).then(res => res[0]);

    if (!user) {
      // Do not reveal user doesn't exist (security best practice)
      return { 
        success: false,
        message: "Kama barua pepe ni sahihi, utapokea link ya kubadili nenosiri." 
      };
    }

    // 2. Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min expiry

    // 3. Store token (you can also use Redis for this)
    await mainDb.insert(passwordResets).values({
      email,
      token,
      expiresAt
    });

    // 4. Build reset URL
    const baseUrl = process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL_DEV : process.env.FRONTEND_URL;

    const link = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // 5. Send email
    await sendResetEmail({ email, link });

    return { 
        success: false,
        message: "Kama barua pepe ni sahihi, utapokea link ya kubadili nenosiri." 
    };
  }, {
    body: resetEmailData
  });
