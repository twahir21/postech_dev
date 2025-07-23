import { desc, eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { paymentSaaS, users } from "../database/schema/shop";
import type { CheckUSSDResult, headTypes, PaymentRequest } from "../types/types";
import { createPayloadChecksum, decrypt, encrypt, generateOrderRef } from "./utils/clickpesa";
import { replaceWith255 } from "./utils/replaces";

// credentials
const clientID = process.env.CLICKPESA_CLIENT_ID!;
const apiKey = process.env.CLICKPESA_API_KEY!;                                               

export const genToken = async ({ userId, shopId, headers }: { userId: string, shopId: string, headers: headTypes }) => {


    try{
        // send req for getting token
        const options = { method: 'POST', headers: {'client-id': clientID, 'api-key': apiKey }};
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

        // save token to the database
        // encrypt first to secure if db leaks
        const clickpesaBearer = result.token;
        const encryptedToken = encrypt(clickpesaBearer);

        await mainDb.insert(paymentSaaS).values({
            token: encryptedToken,
            shopId,
            amountToPay: "0"
        })

        return {
            success: true,
            message: "API-Key ipo sahihi, umepata tokeni ya malipo"
        }

    }catch(err){
        return {
            success: false,
            message: err instanceof Error   
                        ? err.message
                        : "Hitilafu imetokea kwenye seva"
        }
    }
}
export const checkUSSD = async ({ userId, shopId, headers, body }: { userId: string, shopId: string, headers: headTypes; body: PaymentRequest }) => {


    try{
        const { price, duration, paymentMethod, plan } = body;
        // get token
        const encryptedToken = await mainDb.select({ token: paymentSaaS.token}).from(paymentSaaS)
                    .where(eq(paymentSaaS.shopId, shopId)).orderBy(desc(paymentSaaS.createdAt));
        
        const value = encryptedToken[0].token;

        const resultToken = decrypt(value);

        // check if USSD-PUSH service is available
        const orderReference = generateOrderRef();

        // save orderReference to database to avoid generating new order
        await mainDb.update(paymentSaaS).set({
            orderId: orderReference,
            amountToPay: price.toString(),
        }).where(eq(paymentSaaS.shopId, shopId));


        const checksumKey = process.env.CLICKPESA_CHECKSUMKEY;
        if(!checksumKey) return;


        const payload = {
            amount: price.toString(),
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
            headers: {Authorization: `${resultToken}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(USSDpayload)
          };
          
        const checkUSSD = await fetch('https://api.clickpesa.com/third-parties/payments/preview-ussd-push-request', options2);
        const checkUSSDResult: CheckUSSDResult = await checkUSSD.json().catch((err) => {
            return {
                success: false,
                message: err instanceof Error ? err.message : "Seva ya malipo imefeli"
            }
        });

        const method = checkUSSDResult.activeMethods.find(
            m => m.name.toUpperCase() === paymentMethod.toUpperCase()
        );
        
        if (method && method?.status === 'AVAILABLE') {
            return {
                success: true,
                message: "Huduma ya USSD inapatikana kwenye mtandao wako."
            }
        }else{
            return {
                success: false,
                message: `Mtandao wa ${paymentMethod} upo kwenye maboresho, jaribu tena baadae au tumia mtandao mwingine.`
            }
        }

    }catch(err){
        return {
            success: false,
            message: err instanceof Error   
                        ? err.message
                        : "Hitilafu imetokea kwenye seva"
        }
    }
}

export const USSDPush = async ({ userId, shopId, headers }: { userId: string, shopId: string, headers: headTypes }) => {


    try{
        // get token
        const encryptedToken = await mainDb.select({ token: paymentSaaS.token}).from(paymentSaaS)
                    .where(eq(paymentSaaS.shopId, shopId)).orderBy(desc(paymentSaaS.createdAt));
        
        const value = encryptedToken[0].token;

        const resultToken = decrypt(value);

        const userAgent = headers['user-agent'] ?? "";
    
        if (!isPhoneRequest(userAgent)) {
        return { 
            success: false,
            message: 'Huduma hii inapatikana kwa watumiaji wa simu tu yenye SIM card (laini)'
        };
         
        }

        // processing USSD-PUSH service
        const orderData = await mainDb.select({
            orderId: paymentSaaS.orderId,
            amountToPay: paymentSaaS.amountToPay
        }).from(paymentSaaS).where(eq(paymentSaaS.shopId, shopId));

        const orderId = orderData[0].orderId;
        const amountToPay = orderData[0].amountToPay;

        if (!orderId) {
            return {
                success: false,
                message: "orderId haipo kwenye database"
            }
        };

        const checksumKey = process.env.CLICKPESA_CHECKSUMKEY;
        if(!checksumKey) return;

        const payload = {
            amount: amountToPay,
            currency: "TZS",
            orderReference: orderId,
        }
        const checksum = await createPayloadChecksum(checksumKey, payload);

        // select phoneNumber
        const phoneData = await mainDb.select({phoneNumber: users.phoneNumber})
                            .from(users).where(eq(users.id, userId));

        // replace with 255 if first number is 0
        const phoneNumber = replaceWith255(phoneData[0].phoneNumber);

        const USSDpayload = {
            ...payload,
            checksum,
            phoneNumber
        }
        

        const options = {
            method: 'POST',
            headers: {Authorization: `${resultToken}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(USSDpayload)
            // body: '{"amount":"<string>","currency":"TZS","orderReference":"<string>","phoneNumber":"<string>","checksum":"<string>"}'
          };
          
          const processUSSD = await fetch('https://api.clickpesa.com/third-parties/payments/initiate-ussd-push-request', options)

          const ussdPush = await processUSSD.json().catch((err) => {
            return {
                success: false,
                message: err instanceof Error ? err.message : "Seva ya malipo imefeli"
            }
        });
        console.log("ussdPush:", ussdPush);
        return {
            success: true,
            message: "Ingiza namba ya siri kulipia..."
        }

    }catch(err){
        return {
            success: false,
            message: err instanceof Error   
                        ? err.message
                        : "Hitilafu imetokea kwenye seva"
        }
    }
}

export const PayStatus = async ({ userId, shopId, headers }: { userId: string, shopId: string, headers: headTypes }) => {


    try{
        const encryptedToken = await mainDb.select({ token: paymentSaaS.token}).from(paymentSaaS)
                    .where(eq(paymentSaaS.shopId, shopId)).orderBy(desc(paymentSaaS.createdAt));
        
        const value = encryptedToken[0].token;

        const resultToken = decrypt(value);

        const orderData = await mainDb.select({
            orderId: paymentSaaS.orderId
        }).from(paymentSaaS).where(eq(paymentSaaS.shopId, shopId));

        const orderId = orderData[0].orderId;

        if (!orderId) return;

        const options = {method: 'GET', headers: {Authorization: `${resultToken}`}};

        const checkStatusData = await fetch(`https://api.clickpesa.com/third-parties/payments/{${orderId}}`, options)
        const checkStatus = await checkStatusData.json().catch((err) => {
            return {
                success: false,
                message: err instanceof Error ? err.message : "Seva ya malipo imefeli"
            }
        });
        console.log("Status: ", checkStatus)
        return {
            success: true,
            message: "Imeona hali ya malipo uliofanya"
        }

    }catch(err){
        return {
            success: false,
            message: err instanceof Error   
                        ? err.message
                        : "Hitilafu imetokea kwenye seva"
        }
    }
}


export const checkBalance = async ({ userId, shopId, headers }: { userId: string, shopId: string, headers: headTypes }) => {
    try {
        const encryptedToken = await mainDb.select({ token: paymentSaaS.token}).from(paymentSaaS)
                    .where(eq(paymentSaaS.shopId, shopId)).orderBy(desc(paymentSaaS.createdAt));
        
        const value = encryptedToken[0].token;

        const resultToken = decrypt(value);

        const options = {method: 'GET', headers: {Authorization: `${resultToken}`}};

        const resultBalance = await fetch('https://api.clickpesa.com/third-parties/account/balance', options);
        const result = await resultBalance.json();

        // Define the Balance type interface
        interface Balance {
            currency: string;
            balance: number;
        }

        // Type the response object
        interface BalanceResponse {
        balances: Balance[];
        }

        // Option 1: With type assertion (quick fix)
        console.log("TZS Balance:", (result as BalanceResponse).balances.find(b => b.currency === "TZS")?.balance);

        return {
            success: true,
            message: "Umefanikiwa kuangalia salio lako la ClickPesa",
            data: [{ Balance: (result as BalanceResponse).balances.find(b => b.currency === "TZS")?.balance }]
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Hitilafu imetokea kwenye seva"
        }
    }
}

/**
 * Checks if the request is from a mobile phone (for USSD/push services)
 * @param userAgent - The User-Agent header string
 * @returns boolean - True if phone, false otherwise
 */
export function isPhoneRequest(userAgent: string | null): boolean {
  if (!userAgent) return false;

  // Common mobile keywords in User-Agent strings
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipod', 'blackberry', 
    'windows phone', 'nokia', 'opera mini', 'opera mobi'
  ];

  // Tablet keywords to exclude (optional)
  const tabletKeywords = ['ipad', 'tablet', 'kindle'];

  const lowerUserAgent = userAgent.toLowerCase();

  // Check if contains mobile keyword but not tablet
  return (
    mobileKeywords.some(keyword => lowerUserAgent.includes(keyword)) &&
    !tabletKeywords.some(keyword => lowerUserAgent.includes(keyword))
  );
}