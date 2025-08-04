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

//         const promptSentence  = `
//         Nimempunguzia mama juma shilingi 10,000 kwenye unga kilo 5
// `;
        const promptSentence = "nimenunua unga wa muhogo kilo 6";
        // normalize
        const normalizedSentence = promptSentence.toLowerCase()
                                .replace(/[_'",.?]/g, ' ')  // replace undesired characters with space
                                .replace(/\s+/g, ' ')      // normalize multiple spaces
                                .trim();

        return await fallbackExtractor(shopId, normalizedSentence);
    })