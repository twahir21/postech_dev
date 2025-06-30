import { and, eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { askedProducts } from "../database/schema/shop";
import { sanitizeString } from "./security/xss";

export const askedFuncFetch = async ({ shopId, userId }: { shopId: string; userId: string }): Promise<{ success: boolean; message: string; data?: unknown}> => {
    try {
        const data = await mainDb.select({ name: askedProducts.productName, count: askedProducts.quantityRequested, id: askedProducts.id  }).from(askedProducts).where(eq(askedProducts.shopId, shopId));

        
        if (data.length === 0){
            return {
                success: true,
                message: "Hakuna taarifa zilizopatikana",
                data: [{ data: [] }]
            }
        }

        return {
            success: true,
            message: "taarifa zimepatikana",
            data: [{ data }]
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
        const data = await mainDb
            .select({ name: askedProducts.productName })
            .from(askedProducts)
            .where(
                and(
                    eq(askedProducts.productName, name), // Check if the product name already exists
                    eq(askedProducts.shopId, shopId)
                )
            );

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

export const deleteAsked = async({ userId, shopId, id }: { userId: string; shopId: string; id: string }): Promise<{ success: boolean; message: string }> => {
    try {

        await mainDb.delete(askedProducts).
        where(
            and (
                eq(askedProducts.id, id),
                eq(askedProducts.shopId, shopId)
            )
        );
        return {
            success: true,
            message: "Umefanikiwa kufuta taarifa"
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Tatizo limetokea wakati wa kutuma data"  
            }
    };
}

export const updateAsked = async({ userId, shopId, id, body }: { userId: string; shopId: string; id: string; body: { count: number } }): Promise<{ success: boolean; message: string }> => {
    try {
        await mainDb.update(askedProducts).set({
            quantityRequested: body.count
        }).where(eq(askedProducts.id, id))

        return {
            success: true,
            message: "Umefanikiwa ku-edit taarifa"
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Tatizo limetokea wakati wa kutuma data"  
            }
    };
}