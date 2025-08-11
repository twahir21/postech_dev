import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { extractId } from "../functions/security/jwtToken";
import { prodDel, prodGet, prodPost, prodSearch, prodUpdate, QrPost } from "../functions/prodFunc";
import type { productTypes, QrData } from "../types/types";
import { prodData, prodUpdateValidation, QrPostData } from "../functions/security/validators/data";
import { clearProductsCache } from "../robot/fallback";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


export const prodPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .get("/products", async ({ jwt, cookie, headers, query }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;


        return await prodGet({ userId, shopId, headers, query, set: { status: 200 } });
    })
    .get("/productSearch", async ({ jwt, cookie, headers, query }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        const search = query.search as string || '';

        return await prodSearch({ userId, shopId, query: search });
    })
    .post("/products", async ({ jwt, cookie, body, headers }) => {
        const { userId, shopId} = await extractId({ jwt, cookie});
        if (!shopId || !userId) return;

        // delete cache in Redis per shop
        await clearProductsCache(shopId);

        return await prodPost({
            body: body as productTypes,
            userId,
            shopId,
            headers,
        }); 
    }, {
        body: prodData
    })
    .delete("/products/:id", async ({ jwt, cookie, set, params, headers }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;


        const productId = params.id;
        if (!productId) {
            set.status = 400;
            return { success: false, message: "Product ID is required." };
        }

        // delete cache in Redis per shop
        await clearProductsCache(shopId);

        // Logic to delete the product by ID
        return await prodDel({ userId, shopId, headers, productId });
    })
    .put("/products/:id", async ({ jwt, cookie, set, params, body, headers }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;


        const productId = params.id;
        if (!productId) {
            set.status = 400;
            return { success: false, message: "Product ID is required." };
        }

        // delete cache in Redis per shop
        await clearProductsCache(shopId);

        return await prodUpdate({
            body: body as productTypes,
            userId,
            shopId,
            headers,
            productId,
        });
    }, {
        body: prodUpdateValidation
    })
    .post("/get-data", async ({ jwt, cookie, body, headers }) => {
        const { userId, shopId} = await extractId({ jwt, cookie});
        if (!shopId || !userId) return;

        // delete cache in Redis per shop
        await clearProductsCache(shopId);


        return await QrPost({ 
            body: body as QrData, 
            userId, 
            shopId, 
            headers,
        }); 
    }, {
        body: QrPostData
    });
