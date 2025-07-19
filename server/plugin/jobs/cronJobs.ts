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
    
    // 2. loop every shop 
    for (const shop of dbTime) {
        if (!shop.trialEnd) continue;

        const isTrialExpired = new Date() > new Date(shop.trialEnd);

        if (isTrialExpired && shop.subscription === 'Trial') {
            // 3. Set isPaid to false (Block user to use account)
            await mainDb
            .update(shopUsers)
            .set({ isPaid: false })
            .where(eq(shopUsers.shopId, shop.id));

            const shopName = await mainDb.select({ name: shops.name })
                            .from(shops)
                            .where(eq(shops.id, shop.id));

            // 4. Send Email for notification
            const link = process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL_DEV : process.env.FRONTEND_URL;
            await notifyTrialEnd({ shopName: shopName[0].name, link: link!, email: shop.email });


        }
    }

    }catch(error) {
        console.log(error instanceof Error
            ? error.message
            :  "Hitilafu imetokea kwenye seva")
    }
}

export const notifyBeforeEnds = async () => {
    try {
        // 1. Get all shops and their subscriptions
        const dbTime = await mainDb
            .select({
                trialEnd: shops.trialEnd,
                id: shops.id,
                subscription: shops.subscription,
            })
            .from(shops);

        const currentTime = new Date().getTime();

        for (const shop of dbTime) {
            if (!shop.trialEnd) continue;
            const subscription = shop.subscription;

            const trialEndTime = new Date(shop.trialEnd).getTime();
            const notifyTime = trialEndTime - 7 * 24 * 60 * 60 * 1000; // 7 days before
            
            // 2. Check if current time is after notification time but before trial end
            if (currentTime >= notifyTime && currentTime < trialEndTime) {
                // 3. Check if notification already exists to avoid duplicates
                const existingNotification = await mainDb
                    .select()
                    .from(notifications)
                    .where(
                        and(
                            eq(notifications.shopId, shop.id),
                            eq(notifications.type, "upgrade")
                        )
                    )
                    .limit(1);

                if (existingNotification.length === 0) {
                    // 4. Create notification if it doesn't exist
                    await mainDb.insert(notifications).values({
                        shopId: shop.id,
                        title: "Lipia account yako!",
                        message: `Kifurushi chako cha ${subscription} kitaisha ${new Date(shop.trialEnd).toDateString()}.`,
                        type: "upgrade",
                        createdAt: new Date()
                    });
                }
            }
        }
    } catch (error) {
        console.log(error instanceof Error
            ? error.message
            : "Hitilafu imetokea kwenye seva");
    }
}

export async function cleanupOldData() {
  // 1. Get all shops and their subscriptions
  const shopsWithSubs = await mainDb.select({
    shopId: shops.id,
    subscription: shops.subscription,
  }).from(shops);

  // 2. Define tables for cleanup 
  const tables = [
    expenses,
    sales,
    purchases,
    returns,
    supplierPriceHistory,
    products,
  ];

  // 3. Loop each shop
  for (const { shopId, subscription } of shopsWithSubs) {
    // Retention is export function which has time for the deletion as per package 
    const monthsToKeep = retentionPeriods[subscription as SubscriptionLevel];
    if (!monthsToKeep) continue; // Skip if subscription is undefined or invalid

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);

    // * Please implement deletion per timer
    // ! ⚠️ Effect of bulk deletion
// DB Spikes: CPU, memory, and I/O usage can spike sharply.

// Table Locking: Can lock large parts of the table, blocking other reads/writes.

// Transaction Logs Bloat: Can fill up disk with huge transaction logs.

// Downtime in Low-RAM VPS: Deletion might freeze or kill DB if RAM is limited.

// VACUUM Pressure (in PostgreSQL): Post-delete cleanup gets heavier.


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
  // 1. Get all password resets that have expired
  const expiredResets = await mainDb.select({ id: passwordResets.id })
    .from(passwordResets)
    .where(lt(passwordResets.expiresAt, new Date()));

  // 2. Delete expired password resets
  for (const reset of expiredResets) {
    await mainDb.delete(passwordResets).where(eq(passwordResets.id, reset.id));
  }
}

