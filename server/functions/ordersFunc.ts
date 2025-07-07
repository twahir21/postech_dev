import { eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb"
import { supplierPriceHistory } from "../database/schema/shop"
import { formatFloatToFixed } from "./security/money"

export const orderSet = async ({ supplierId, productId, shopId, priceBought }: { supplierId: string, productId: string, shopId: string, priceBought: number })  => {
    // insert supplier price history
    await mainDb.insert(supplierPriceHistory).values({
        supplierId,
        productId: productId,
        shopId,
        price: formatFloatToFixed(priceBought)
    });


    await mainDb.update(supplierPriceHistory).set({
        price: formatFloatToFixed(priceBought)
    }).where(eq(supplierPriceHistory.productId, productId));

}