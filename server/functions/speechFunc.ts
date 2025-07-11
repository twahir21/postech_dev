import { eq, like, sql } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { customers, debts, expenses, products, purchases, sales } from "../database/schema/shop";
import { sanitizeString } from "./security/xss";
import { isPotentialXSS } from "./utils/isXSS";
import { detectSwahiliTransaction, parseNimetumiaSentence } from "./utils/NLP";
import { formatFloatToFixed } from "./security/money";

export const handleSpeech = async (shopId: string, userId: string, text: string): Promise<{ success: boolean; message: string }> => {
    try {
        console.time("CoreService");
        
        // Security check first
        if (isPotentialXSS(text)) {
            return {
                success: false,
                message: "Maandishi yako yana vitu visivyo salama. Huwezi kudukua kirahisi hivyo."
            };
        }

        const sanitizedText = sanitizeString(text);
        let action: string, customer: string | null, product: string, quantity: number, punguzo: number;
        let activity: string, money: number;

        // Handle "nimetumia" case separately
        if (sanitizedText.toLowerCase().includes("nimetumia")) {
            const parsed = parseNimetumiaSentence(sanitizedText);
            action = parsed.action;
            activity = parsed.activity;
            product = parsed.product;
            quantity = parsed.quantity;
            money = parsed.money;
            
            console.log("nimetumia parse:", { action, activity, product, quantity, money });
            
            // Handle product usage if specified
            if (product !== 'nothing') {
                const productUse = await mainDb
                    .select({ 
                        id: products.id,
                        priceSold: products.priceSold,
                        stock: products.stock,
                    })
                    .from(products)
                    .where(like(products.name, `%${product.split(' ')[0]}%`))
                    .then(res => res[0]);

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
                    .where(eq(products.id, productUse.id));

                // Mark as finished if needed
                if (productUse.stock - quantity <= 0) {
                    await mainDb.update(products)
                        .set({ status: "finished" })
                        .where(eq(products.id, productUse.id));
                }

                // Set money to product price if not specified
                if (money === 0) {
                    money = Number(productUse.priceSold) * quantity;
                }
            }

            // Record expense
            await mainDb.insert(expenses).values({
                description: activity,
                amount: formatFloatToFixed(money),
                shopId
            });

            return {
                success: true,
                message: "Matumizi yamehifadhiwa kikamilifu"
            };
        }

        // Handle regular transactions
        const transaction = await detectSwahiliTransaction(sanitizedText, shopId);
        action = transaction.action;
        customer = transaction.customer || null;
        product = transaction.product;
        quantity = transaction.quantity || 1; // default to 1 if quantity is 0
        punguzo = transaction.punguzo;

        console.log("regular transaction:", { action, customer, product, quantity, punguzo });

        // Fetch product details
        const productDetails = await mainDb
            .select({ 
                id: products.id,
                priceSold: products.priceSold,
                stock: products.stock,
            })
            .from(products)
            .where(eq(products.name, product))
            .then(res => res[0]);

        if (!productDetails) {
            return { success: false, message: `Bidhaa '${product}' haijapatikana.` };
        }

        // Process different action types
        switch (action) {
            case 'nimeuza': {
                if (productDetails.stock < quantity) {
                    return { success: false, message: "Bidhaa haina stock ya kutosha" };
                }

                // Update stock
                await mainDb.update(products)
                    .set({ stock: sql`${products.stock} - ${quantity}` })
                    .where(eq(products.id, productDetails.id));

                // Mark as finished if needed
                if (productDetails.stock - quantity <= 0) {
                    await mainDb.update(products)
                        .set({ status: "finished" })
                        .where(eq(products.id, productDetails.id));
                }

                // Record sale
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

            case 'nimemkopesha': {
                if (productDetails.stock < quantity) {
                    return { success: false, message: "Bidhaa haina stock ya kutosha" };
                }

                // Update stock
                await mainDb.update(products)
                    .set({ stock: sql`${products.stock} - ${quantity}` })
                    .where(eq(products.id, productDetails.id));

                // Mark as finished if needed
                if (productDetails.stock - quantity <= 0) {
                    await mainDb.update(products)
                        .set({ status: "finished" })
                        .where(eq(products.id, productDetails.id));
                }

                // Find customer
                let customerId: string | null = null;
                if (customer) {
                    customerId = await mainDb
                        .select({ id: customers.id })
                        .from(customers)
                        .where(eq(customers.name, customer))
                        .then(res => res[0]?.id || null);
                }

                if (customerId === null) {
                    return { success: false, message: "Mteja hayupo! msajili kwanza" };
                }

                // Record debt
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
                const priceBought = await mainDb
                    .select({ priceBought: purchases.priceBought })
                    .from(purchases)
                    .where(eq(purchases.productId, productDetails.id))
                    .then(res => res[0]?.priceBought || "0");

                // Update stock
                await mainDb.update(products)
                    .set({ 
                        stock: sql`${products.stock} + ${quantity}`, 
                        status: "available" 
                    })
                    .where(eq(products.id, productDetails.id));

                // Record purchase
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
                return { success: false, message: "Hatua ya muamala haijatambuliwa" };
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message 
                : "Hitilafu imetokea kwenye seva"
        };
    } finally {
        console.timeEnd("CoreService");
    }
};