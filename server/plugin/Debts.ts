import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { extractId } from "../functions/security/jwtToken";
import { debtFunc, payDebt } from "../functions/debtFunc";
import { debtQuery, payDebtData } from "../functions/security/validators/data";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


export const debtPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .get("/get-debts", async ({ jwt, cookie, query }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        return await debtFunc({ userId, shopId, query });
    }, {
    query: debtQuery
    })
    .post("/pay-debt", async ({ jwt, cookie, body }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        return await payDebt ({ userId, shopId, body });
    }, 
    {
        body: payDebtData
    }
)