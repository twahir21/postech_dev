import jwt from "@elysiajs/jwt";
import { extractId } from "../functions/security/jwtToken";
import { handleSpeech } from "../functions/speechFunc";
import Elysia from "elysia";
import { fallbackExtractor } from "../robot/fallback";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";

export const speechPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .post("/speech", async ({ jwt, cookie, body }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });

        if (!shopId || !userId) return;

        let { text } = body as { text: string };

        text = text.trim();

        return await handleSpeech(
            shopId, userId, text
        );
    })
    .get("/fallback", async ({ jwt, cookie }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });

        if (!shopId || !userId) return;

        return await fallbackExtractor(shopId, `mama juma alikopeshwa pipi za 50 lita sitini na saba na nusu na robo nimemtolea shilingi elfu hamisini na saba`);
    })