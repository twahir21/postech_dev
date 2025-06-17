import { mainDb } from "../../database/schema/connections/mainDb";
import { emailVerifications, expenses, notifications, passwordResets, products, purchases, returns, sales, shops, shopUsers, supplierPriceHistory, users } from "../../database/schema/shop";
import { and, eq, lt } from "drizzle-orm";
import nodemailer from "nodemailer";
import "dotenv/config";
import { retentionPeriods, type SubscriptionLevel } from "../../functions/utils/packages";
import { notifyTrialEnd } from "../email/trialEnd.email";

export const clearVerifiedEmails = async() => {

    // warm up the database
    try{
        await mainDb.delete(emailVerifications)
                .where(eq(emailVerifications.used, true));
        console.log("Tumefuta email zilizohakikiwa");
    }catch(error) {
            console.log (error instanceof Error
                    ? error.message
                    :  "Hitilafu imetokea kwenye seva")
    }
}


export const pingAPI = () => {
    // warm up the server and clear caches
    try{
        console.log("Karibu kwenye seva ya Elysia na Bun!");
    }catch(error) {
        console.log(error instanceof Error
            ? error.message
            :  "Hitilafu imetokea kwenye seva")
    }
}


export const isTrialEnd = async () => {
    try{
    // 1. Get all shops and their subscriptions
    const dbTime = await mainDb
    .select({
        trialEnd: shops.trialEnd,
        id: shops.id,
        subscription: shops.subscription,
        email: users.email
    })
    .from(shops)
    .innerJoin(shopUsers, eq(shops.id, shopUsers.shopId))
    .innerJoin(users, eq(users.id, shopUsers.userId));
    

    for (const shop of dbTime) {
        if (!shop.trialEnd) continue;

        const isTrialExpired = new Date() > new Date(shop.trialEnd);

        if (isTrialExpired && shop.subscription === 'Trial') {
            await mainDb
            .update(shopUsers)
            .set({ isPaid: false })
            .where(eq(shopUsers.shopId, shop.id));

            const shopName = await mainDb.select({ name: shops.name })
                            .from(shops)
                            .where(eq(shops.id, shop.id));

            // 2. Send Email for notification
            const link = process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL_DEV : process.env.FRONTEND_URL;
            await notifyTrialEnd({ shopName: shopName[0].name, link: link!, email: shop.email });

            // 3. Set notification (in - app )
            await mainDb.insert(notifications).values({
                shopId: shop.id,
                title: "Lipia account yako!",
                message: "Account yako imekwisha muda wake wa matumizi, chagua kifurushi kisha lipia kufungua account yako.",
                type: "upgrade"
            });
        }
    }

    }catch(error) {
        console.log(error instanceof Error
            ? error.message
            :  "Hitilafu imetokea kwenye seva")
    }
}

export async function cleanupOldData() {
  // Get all shops and their subscriptions
  const shopsWithSubs = await mainDb.select({
    shopId: shops.id,
    subscription: shops.subscription,
  }).from(shops);

  const tables = [
    expenses,
    sales,
    purchases,
    returns,
    supplierPriceHistory,
    products,
  ];

  for (const { shopId, subscription } of shopsWithSubs) {
    const monthsToKeep = retentionPeriods[subscription as SubscriptionLevel];
    if (!monthsToKeep) continue; // Skip if subscription is undefined or invalid

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);

    for (const table of tables) {
      await mainDb.delete(table).where(
        and(
          eq(table.shopId, shopId),
          lt(table.createdAt, cutoffDate)
        )
      );
    }
  }
}

export const cleanResets = async () => {
  // Get all password resets that have expired
  const expiredResets = await mainDb.select({ id: passwordResets.id })
    .from(passwordResets)
    .where(lt(passwordResets.expiresAt, new Date()));

  // Delete expired password resets
  for (const reset of expiredResets) {
    await mainDb.delete(passwordResets).where(eq(passwordResets.id, reset.id));
  }
}