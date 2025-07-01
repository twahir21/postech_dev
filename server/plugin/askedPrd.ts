import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { extractId } from "../functions/security/jwtToken";
import { askedFuncFetch, askedFuncPost, deleteAsked, updateAsked } from "../functions/askedFunc";
import { askedData, updatedAskedData } from "../functions/security/validators/data";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


export const askedPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .get("/asked", async({ cookie, jwt, query }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        return await askedFuncFetch({ shopId, userId, query })     
    })
    .post("/asked", async({ cookie, jwt, body }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        return await askedFuncPost({ shopId, userId, body })
    }, {
        body: askedData
    })
    .delete("/asked/:id", async({ cookie, jwt, params }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId ) return;

        const { id } = params;


        return await deleteAsked({ shopId, userId, id })
    })
    .put("/asked/:id", async({ cookie, jwt, params, body }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId ) return;

        const { id } = params;

        return await updateAsked({ shopId, userId, id, body })
    }, {
        body: updatedAskedData
    })