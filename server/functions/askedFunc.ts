import { and, desc, eq, sql } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { askedProducts } from "../database/schema/shop";
import { sanitizeString } from "./security/xss";

export const askedFuncFetch = async ({ shopId, userId, query }: { 
    shopId: string; userId: string;  query: { page?: number; limit?: number };
 }): Promise<{ success: boolean; message: string; data?: unknown}> => {


    try {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 3);
        const offset = (page - 1) * limit;

        // 1. Get total item count for pagination
        const [countRow] = await mainDb
            .select({ count: sql<number>`COUNT(*)` })
            .from(askedProducts)
            .where(eq(askedProducts.shopId, shopId));

        const totalItems = countRow?.count ?? 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / limit));

        // 2. Fetch Data ...
        const data = await mainDb
            .select({ name: askedProducts.productName, count: askedProducts.quantityRequested, id: askedProducts.id  })
            .from(askedProducts)
            .where(eq(askedProducts.shopId, shopId))
            .orderBy(
                desc(askedProducts.quantityRequested),
                desc(askedProducts.id) // Add a unique column here
            )            
            .offset(offset)
            .limit(limit);

        
        if (data.length === 0){
            return {
                success: true,
                message: "Hakuna taarifa zilizopatikana",
                data: [{ data: [], totalPages, itemsPerPage: limit, currentPage: page }]
            }
        }

        return {
            success: true,
            message: "taarifa zimepatikana",
            data: [{ data, totalPages, itemsPerPage: limit, currentPage: page }]
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

        name = sanitizeString(name).trim().toLowerCase();

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