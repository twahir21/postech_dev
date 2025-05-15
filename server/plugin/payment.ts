import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { genTokenPay } from "../functions/paymentFunc";
import { extractId, isDecodedToken } from "../functions/security/jwtToken";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


const paymentPlugin = new Elysia()
        .use(jwt({
            name: 'jwt',
            secret: JWT_SECRET,
        }))
        .get("/payment", async ({ jwt, cookie, headers }) => {

            const { userId, shopId } = await extractId({ jwt, cookie })

            if (!userId || !shopId) {
                return {
                    success: false,
                    message: "Imeshindwa ku extract tokeni, jaribu tena baadae"
                }
            };

            return await genTokenPay({ userId, shopId, headers });
        })


export default paymentPlugin