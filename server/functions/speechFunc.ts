import { eq, like, sql } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { customers, debts, expenses, products, purchases, sales } from "../database/schema/shop";
import { sanitizeString } from "./security/xss";
import { isPotentialXSS } from "./utils/isXSS";
import { detectSwahiliTransaction, parseNimetumiaSentence } from "./utils/NLP";
import { formatFloatToFixed } from "./security/money";

export const handleSpeech = async (shopId: string, userId: string, text: string) : Promise<{ success: boolean; message: string }> => {
    try {
        console.time("CoreService");
        if (isPotentialXSS(text)) {
            return {
                success: false,
                message: "Maandishi yako yana vitu visivyo salama. Huwezi kudukua kirahisi hivyo."
            }
        }

        // ? format is [action] [optional: customer] [product] [optional: unit] [quantity] [optional: punguzo <number>]
        // ! swahili texts convertion to numbers are supported above 10,000 as stocks
        
        let { action, customer, product, quantity, punguzo } = await detectSwahiliTransaction(sanitizeString(text), shopId);
        if (quantity === 0) quantity = 1; // default quantity to 1
        console.log(
            "action: ", action,
            "customer: ", customer,
            "product: ", product,
            "quantity: ", quantity,
            "punguzo: ", punguzo 
        )

        // fetch product Id first using product name nearest match
        const productDetails = await mainDb
        .select({ 
            id: products.id,
            priceSold: products.priceSold,
            stock: products.stock,
        })
        .from(products)
        .where(like(products.name, `%${product.split(' ')[0]}%`)) // match "mchele" in "mchele kilo"
        .then(res => res[0]);

        // 1. Check if product exists
        if (!productDetails) {
            return { success: false, message: `Bidhaa '${product}' haijapatikana.` };
        }


        // 2. Handle actions
        switch (action as "nimeuza" | "nimemkopesha" | "nimenunua" | "nimetumia") {
            case 'nimeuza': {
                // Check stock
                if (productDetails.stock < quantity) {
                    return {
                        success: false,
                        message: "Bidhaa haina stock ya kutosha",
                    };
                }

                // Deduct stock
                await mainDb.update(products)
                .set({ stock: sql`${products.stock} - ${quantity}` })
                .where(eq(products.id, productDetails.id));

                // Mark as finished
                if (productDetails.stock - quantity <= 0) {
                await mainDb.update(products)
                    .set({ status: "finished" })
                    .where(eq(products.id, productDetails.id));
                }

                // Save sale
                await mainDb.insert(sales).values({
                productId: productDetails.id,
                quantity,
                discount: punguzo,
                priceSold: productDetails.priceSold,
                totalSales: formatFloatToFixed((Number(productDetails.priceSold) * quantity) - punguzo),
                shopId,
                saleType: "cash",
                customerId: null
                });

                return { success: true, message: "Mauzo yamehifadhiwa kikamilifu" };
            }

            case 'nimetumia': {
                let { 
                    action, activity, product, quantity, money 
                } = parseNimetumiaSentence(sanitizeString(text))

                if (product != 'nothing'){
                    const productUse = await mainDb
                    .select({ 
                        id: products.id,
                        priceSold: products.priceSold,
                        stock: products.stock,
                    })
                    .from(products)
                    .where(like(products.name, `%${product.split(' ')[0]}%`)) // match "mchele" in "mchele kilo"
                    .then(res => res[0]);

                    // 1. Check if product exists
                    if (!productUse) {
                        return { success: false, message: `Bidhaa '${product}' haijapatikana.` };
                    }
                
                    // Check stock
                    if (productUse.stock < quantity) {
                    return { success: false, message: "Bidhaa haina stock ya kutosha" };
                    }

                    // Deduct stock
                    await mainDb.update(products)
                        .set({ stock: sql`${products.stock} - ${quantity}` })
                        .where(eq(products.id, productDetails.id));

                    // Mark as finished
                    if (productUse.stock - quantity <= 0) {
                        await mainDb.update(products)
                            .set({ status: "finished" })
                            .where(eq(products.id, productDetails.id));
                    }
                    if(money === 0) money = Number(productUse.priceSold ) * quantity;
                
                }

                // insert into expenses
                await mainDb.insert(expenses).values({
                    description: activity,
                    amount: formatFloatToFixed(money),
                    shopId
                });
            
                return {
                    success: true,
                    message: "Matumizi yamehifadhiwa kikamilifu"
                }

            }

            case 'nimemkopesha': {
                // Check stock
                if (productDetails.stock < quantity) {
                return { success: false, message: "Bidhaa haina stock ya kutosha" };
                }

                // Deduct stock
                await mainDb.update(products)
                .set({ stock: sql`${products.stock} - ${quantity}` })
                .where(eq(products.id, productDetails.id));

                // Mark as finished
                if (productDetails.stock - quantity <= 0) {
                await mainDb.update(products)
                    .set({ status: "finished" })
                    .where(eq(products.id, productDetails.id));
                }

                // fetch customer id using its name
                let customerId: string | null = null;

                if (customer) {
                customerId = await mainDb
                    .select({ id: customers.id })
                    .from(customers)
                    .where(eq(customers.name, customer))
                    .then(res => res[0]?.id || null);
                }

                // check if customer found
                if (customerId === null) {
                    return {
                        success: false,
                        message: "Mteja hayupo! msajili kwanza"
                    }
                }

                // Save debt
                await mainDb.insert(debts).values({
                    customerId,
                    productId: productDetails.id,
                    quantity,
                    priceSold: productDetails.priceSold,
                    totalSales: formatFloatToFixed((Number(productDetails.priceSold) * quantity) - punguzo),
                    totalAmount: formatFloatToFixed((Number(productDetails.priceSold) * quantity) - punguzo),
                    remainingAmount: formatFloatToFixed((Number(productDetails.priceSold) * quantity) - punguzo),
                    shopId,
                });

                return { success: true, message: "Deni limehifadhiwa kikamilifu" };
            }

            case 'nimenunua': {
                const priceBought = await mainDb.select({ priceBought: purchases.priceBought })
                                        .from(purchases)
                                        .where(eq(purchases.productId, productDetails.id))
                                        .then(res => res[0]?.priceBought || "0");

                // Add Stock and update status 
                await mainDb.update(products)
                .set({ stock: sql`${products.stock} + ${quantity}`, status: "available" })
                .where(eq(products.id, productDetails.id));

                // insert purchases
                await mainDb.insert(purchases).values({
                    productId: productDetails.id,
                    shopId,
                    quantity,
                    priceBought,
                    totalCost: formatFloatToFixed(Number(priceBought) * quantity),
                });

                return { success: true, message: "Manunuzi yamehifadhiwa kikamilifu" };
            }

            default:
                return {
                success: false,
                message: "Hatua ya muamala haijatambuliwa"
            };

        } 
    }catch (error) {
            return {
                success: false,
                message: error instanceof Error
                    ? error.message 
                    : "Hitilafu imetokea kwenye seva"
            }
    }
    finally{
        console.timeEnd("CoreService")
    }
};