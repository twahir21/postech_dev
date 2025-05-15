import type { headTypes } from "../types/types";
import { getTranslation } from "./translation";
import { createPayloadChecksum, generateOrderRef } from "./utils/clickpesa";

// credentials
const clientID = process.env.CLICKPESA_CLIENT_ID!;
const apiKey = process.env.CLICKPESA_API_KEY!;                                               

export const genTokenPay = async ({ userId, shopId, headers }: { userId: string, shopId: string, headers: headTypes }) => {

    const lang = headers["accept-language"]?.split(",")[0] || "sw";

    try{
        // send req for getting token
        const options = {method: 'POST', headers: {'client-id': clientID, 'api-key': apiKey}};
        const response = await fetch('https://api.clickpesa.com/third-parties/generate-token', options);
        interface clickpesaToken {
            success: string; token: string
        }
        const result: clickpesaToken = await response.json().catch((err) => {
            return {
                success: false,
                message: err instanceof Error ? err.message : "Seva ya malipo imefeli"
            }
        });

        if (!result.token || !result.success) {
            return {
                success: false,
                message: "API-key ya malipo imeisha muda au sio sahihi"
            }
        };

        // check if USSD-PUSH service is available
        const orderReference = generateOrderRef();
        const checksumKey = process.env.CLICKPESA_CHECKSUMKEY;
        if(!checksumKey) return;

        const payload = {
            amount: "10000",
            currency: "TZS",
            orderReference,
        }
        const checksum = await createPayloadChecksum(checksumKey, payload);

        const USSDpayload = {
            ...payload,
            checksum
        }
        const options2 = {
            method: 'POST',
            headers: {Authorization: `${result.token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(USSDpayload)
            // body: '{"amount":"10000","currency":"TZS","orderReference":,"checksum":"<string>"}'
          };
          
        const checkUSSD = await fetch('https://api.clickpesa.com/third-parties/payments/preview-ussd-push-request', options2);
        const checkUSSDResult = await checkUSSD.json().catch((err) => {
            return {
                success: false,
                message: err instanceof Error ? err.message : "Seva ya malipo imefeli"
            }
        });
        
        return {
            checkUSSDResult
        }

    }catch(err){
        return {
            success: false,
            message: err instanceof Error   
                        ? err.message
                        : await getTranslation(lang, "serverErr")
        }
    }
}