import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { extractId } from "../functions/security/jwtToken";
import type { CustomerTypes } from "../types/types";
import { CustomerDel, customerFetch, customerGet, customerPost, customerSearch, customerUpdate } from "../functions/customerFunc";
import { customerData } from "../functions/security/validators/data";
import { blockUsage } from "../functions/utils/block";
import { checkServiceAccess } from "../functions/utils/packages";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


export const CustomersPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
    }))
    .get("/customers", async ({ jwt, cookie, headers, query }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        
        return await customerGet({ userId, shopId, headers, query});
    })
    .get("/customerSearch", async ({ jwt, cookie, headers, query }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        const search = query.search as string || '';

        
        return await customerSearch({ userId, shopId, query: search });
    })
    .get("/getCustomers", async ({ jwt, cookie, headers }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;

        // check if user allowed to fetch
        const customerCheck = await checkServiceAccess({ shopId, service: "customers" });

        if (!customerCheck.success) {
            return  {
                success: false,
                message: customerCheck.message
            }
        }

        return await customerFetch({ userId, shopId, headers});
    })
    .post("/customers", async ({ jwt, cookie, body, headers }) => {
        const { userId, shopId} = await extractId({ jwt, cookie});
        if (!shopId || !userId) return;

        // block creating customers
        const result = await blockUsage({ shopId });

        if (!result?.success) {
            return {
                success: false,
                message: result?.message || "Huduma haijalipiwa"
            };
        }

        return await customerPost({
            body: body as CustomerTypes,
            userId,
            shopId,
            headers,
        });
    }, {
        body: customerData
    })
    .delete("/customers/:id", async ({ jwt, cookie, set, params, headers }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;


        const customerId = params.id;
        if (!customerId) {
            set.status = 400;
            return { success: false, message: "Mteja anahitajika." };
        }

        // Logic to delete the product by ID
        return await CustomerDel({ userId, shopId, headers, customerId });
    })
    .put("/customers/:id", async ({ jwt, cookie, set, params, body, headers }) => {
        const { userId, shopId } = await extractId({ jwt, cookie });
        if (!shopId || !userId) return;


        const customerId = params.id;
        if (!customerId) {
            set.status = 400;
            return { success: false, message: "Mteja anahitajika." };
        }

        return await customerUpdate({
            body: body as CustomerTypes,
            userId,
            shopId,
            headers,
            customerId,
        });
    }, {
        body: customerData
    })
