import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { extractId } from "../functions/security/jwtToken";
import { expFunc } from "../functions/expFunc";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


export const expensesPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .get("/expenses", async({ cookie, jwt }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        return await expFunc({ shopId, userId })     
    });