import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { extractId } from "../functions/security/jwtToken";
import { delExp, expFunc } from "../functions/expFunc";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


export const expensesPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .get("/expenses", async({ cookie, jwt, query }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;


        return await expFunc({ shopId, userId, query });     
    })
    .delete("/expenses/:id", async({ cookie, jwt, params }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        const expenseId = params.id;

        return await delExp({ shopId, userId, expenseId });
    })