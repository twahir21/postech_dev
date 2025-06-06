import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { saveGraphData } from "../functions/GraphFunc";
import { extractId } from "../functions/security/jwtToken";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


const graphPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .get("/graphs-data", async ({ jwt, cookie }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;
        return await saveGraphData({ userId, shopId });
    })