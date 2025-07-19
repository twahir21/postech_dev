import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { checkBalance, checkUSSD, genToken, PayStatus, USSDPush } from "../functions/paymentFunc";
import { extractId } from "../functions/security/jwtToken";
import { paymentRequestData } from "../functions/security/validators/data";

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";


const paymentPlugin = new Elysia()
        .use(jwt({
            name: 'jwt',
            secret: JWT_SECRET,
        }))
        .get("/mobile/generate-token", async ({ jwt, cookie, headers }) => {

            const { userId, shopId } = await extractId({ jwt, cookie })

            if (!userId || !shopId) {
                return {
                    success: false,
                    message: "Tafadhali login kwanza ili kulipia"
                }
            };

            return await genToken({ userId, shopId, headers });
        })
        .post("/mobile/check-USSD", async ({ jwt, cookie, headers, body }) => {

            const { userId, shopId } = await extractId({ jwt, cookie })

            if (!userId || !shopId) {
                return {
                    success: false,
                    message: "Tafadhali login kwanza ili kulipia"
                }
            };

            return await checkUSSD({ userId, shopId, headers, body });
        }, {
            body: paymentRequestData
        })
        .get("/mobile/USSD-push", async ({ jwt, cookie, headers }) => {

            const { userId, shopId } = await extractId({ jwt, cookie })

            if (!userId || !shopId) {
                return {
                    success: false,
                    message: "Tafadhali login kwanza ili kulipia"
                }
            };

            return await USSDPush({ userId, shopId, headers });
        })
        .get("/mobile/payment-status", async ({ jwt, cookie, headers }) => {

            const { userId, shopId } = await extractId({ jwt, cookie })

            if (!userId || !shopId) {
                return {
                    success: false,
                    message: "Tafadhali login kwanza ili kulipia"
                }
            };

            return await PayStatus({ userId, shopId, headers });
        })
        .get("/mobile/checkBalanceBlackCoder123", async ({ jwt, cookie, headers }) => {
            const { userId, shopId } = await extractId({ jwt, cookie })

            if (!userId || !shopId) {
                return {
                    success: false,
                    message: "Tafadhali login kwanza ili kulipia"
                }
            };

            return await checkBalance({ userId, shopId, headers });
        });



export default paymentPlugin