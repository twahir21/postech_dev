import type { headTypes } from "../types/types";
import { getTranslation } from "./translation";

// credentials
const clientID = process.env.CLICKPESA_CLIENT_ID!;
const apiKey = process.env.CLICKPESA_API_KEY!;                                               

export const genTokenPay = async ({ userId, shopId, headers }: { userId: string, shopId: string, headers: headTypes }) => {

    const lang = headers["accept-language"]?.split(",")[0] || "sw";

    try{
        // send req to third party payment gateway
        const options = {method: 'POST', headers: {'client-id': clientID, 'api-key': apiKey}};

        interface clickpesaToken {
            success: string,
            token: string
        }

        const response = await fetch('https://api.clickpesa.com/third-parties/generate-token', options);

        const result: clickpesaToken = await response.json();

        return {
            success: result.success,
            token: result.token
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