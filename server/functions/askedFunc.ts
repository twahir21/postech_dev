import { eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { askedProducts } from "../database/schema/shop";
import { sanitizeString } from "./security/xss";

export const askedFunc = async ({ shopId, userId }: { shopId: string; userId: string }): Promise<{ success: boolean; message: string; data?: unknown}> => {
    try {

        return {
            success: true,
            message: "Data fetched successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Tatizo limetokea wakati wa kupata data"
        };
    }
}

export const askedFuncPost = async ({ shopId, userId, body }: { shopId: string; userId: string; body: { name: string } }): Promise<{ success: boolean; message: string; data?: unknown}> => {
    try {

        let { name } = body;

        name = sanitizeString(name);

        // check if exist
        const data = await mainDb.select({ name: askedProducts.productName }).from(askedProducts).where(eq(askedProducts.shopId, shopId));

        if (data.length > 0) {
            return {
                success: false,
                message: "Jina tayari lipo, tumia jingine"
            }
        }

        await mainDb.insert(askedProducts).values({
            productName: name,
            shopId
        });

        // Simulate a successful post operation
        return {
            success: true,
            message: "Taarifa zimehifadhiwa kwa mafanikio"
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Tatizo limetokea wakati wa kutuma data"
        };
    }
}