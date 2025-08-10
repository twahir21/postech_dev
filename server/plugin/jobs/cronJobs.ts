import { mainDb } from "../../database/schema/connections/mainDb";
import { emailVerifications, expenses, notifications, passwordResets, paymentSaaS, products, purchases, returns, sales, shops, shopUsers, supplierPriceHistory, users } from "../../database/schema/shop";
import { and, eq, inArray, lt } from "drizzle-orm";
import "dotenv/config";
import { retentionPeriods, type SubscriptionLevel } from "../../functions/utils/packages";
import { notifyTrialEnd } from "../email/trialEnd.email";
import { sendDelWarning } from "../email/backup.email";
import { logSnagErrors, logSnagSuccess } from "../app/logSnag";
import { sendDailyReportEmail } from "../email/report.email";

export const clearVerifiedEmails = async() => {

    // warm up the database
    try{
        await mainDb.delete(emailVerifications)
                .where(eq(emailVerifications.used, true));
        await logSnagSuccess("Clear verified emails", "clearVerifiedEmails");
    }catch(error) {
        await logSnagErrors( 
          error instanceof Error ? error.message : "Hitilafu imetokea kwenye seva"
          , "clearVerifiedEmails"
        );
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

            // 5. Log to Snag
            await logSnagSuccess(`Trial ended for ${shopName[0].name}`, "isTrialEnd");
        }
    }

    }catch(error) {
        await logSnagErrors(error instanceof Error
            ? error.message
            :  "Hitilafu imetokea kwenye seva",
          "isTrialEnd");
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
          // log to logSnag
          await logSnagSuccess(`Notification sent to ${shop.id}`, "notifyBeforeEnds"); 
        }
    } catch (error) {
        await logSnagErrors(error instanceof Error
            ? error.message
            : "Hitilafu imetokea kwenye seva", 
          "notifyBeforeEnds");
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

export async function cleanupOldData() {
  try {
      // 1. Select all shops and their subscription
const shopsWithSubs = await mainDb.select({
    shopId: shops.id,
    subscription: shops.subscription,
    shopName: shops.name,
    email: users.email,
    phoneNumber: users.phoneNumber // Added phone number for notifications
  })
  .from(shops)
  .innerJoin(shopUsers, eq(shops.id, shopUsers.shopId))
  .innerJoin(users, eq(shopUsers.userId, users.id))

  // 2. Define tables to delete (old Data per subscription)
  const tables = [
    expenses,
    sales,
    purchases,
    returns,
    supplierPriceHistory,
    products,
  ];

  // 3. Loop each shop 
  for (const { shopId, subscription, shopName, email } of shopsWithSubs) {
    const monthsToKeep = retentionPeriods[subscription as SubscriptionLevel];
    if (!monthsToKeep) continue;

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsToKeep);

    // send email and in-app notification before deletion occurs

    const deletionCutoff = new Date();
    deletionCutoff.setMonth(deletionCutoff.getMonth() - monthsToKeep);
    const notificationCutoff = new Date(deletionCutoff);
    notificationCutoff.setDate(notificationCutoff.getDate() - 7); // 7 days before deletion



    if (new Date() >= notificationCutoff && new Date() < deletionCutoff) {
      // save in-app notification
      await mainDb.insert(notifications).values({
        shopId, title: "Ufutaji wa taarifa", 
        message: `Taarifa zako za zaidi ya ${monthsToKeep === 1 ? "mwezi" : "miezi"} ${monthsToKeep}, zitafutwa tarehe ${deletionCutoff.toLocaleDateString()}. Tafadhali pakua nakala yako kama unazihitaji`,      
        type: "warning"
      });
      // sending email
      await sendDelWarning ({ shopName, email, monthsToKeep, warningDays: 7 });
    }


    for (const table of tables) {
      let attempts = 0;
      const batchSize = 1000;

    // 4. Implement retry-mechanism because much deletion is risky to database
      while (attempts < 3) {
        try {
          while (true) {
            // 5. Fetch rows in batches to avoid leakage and spikes in database 
            const rowsToDelete = await mainDb
              .select({ id: table.id })
              .from(table)
              .where(
                and(
                  eq(table.shopId, shopId),
                  lt(table.createdAt, cutoffDate)
                )
              )
              .limit(batchSize);

            if (rowsToDelete.length === 0) break;
            
            // 6. Restructure array of ids to delete
            const ids = rowsToDelete.map(r => r.id);
            
            // 7. Delete per selected ids above
            await mainDb
              .delete(table)
              .where(inArray(table.id, ids));
            
            // 8. Log deleted rows
            await logSnagSuccess(`
              Deleted ${ids.length} rows from ${table._.name} for shop ${shopId}`,
            "OldDataCleanup"
            );

            // 9. Waits before next execution starts (cooldown here ..)
            await new Promise(resolve => setTimeout(resolve, 300));
          }

          break; // Exit retry loop on success

        } catch (error) {
          // 10. Retry again if failed
          attempts++;
          await logSnagErrors(
            `Attempt ${attempts} failed for table ${table._.name}, shop ${shopId}:`
            , "cleanupOldData"
          );
          
          // 11. Promolong the execution to avoid RAM and CPU much resource usage and deadlocks
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }
    }
  }
  } catch (error) {
    await logSnagErrors( 
      error instanceof Error ? error.message : "Hitilafu imetokea kwenye seva", 
      "cleanupOldData"
    );
  }
}

export const cleanCancelledPayments = async () => {
  try{
    // delete in chuncks 
    const batchSize = 1000;
    let attempts = 0;
    while (attempts < 3) {
      try {
        while (true) {
          const rowsToDelete = await mainDb
            .select({ id: paymentSaaS.id })
            .from(paymentSaaS)
            .where(eq(paymentSaaS.status, "failed"))
            .limit(batchSize);

          if (rowsToDelete.length === 0) break;
          const ids = rowsToDelete.map(r => r.id);
          await mainDb
            .delete(paymentSaaS)
            .where(inArray(paymentSaaS.id, ids));

          await logSnagSuccess(`
            Deleted ${ids.length} rows from ${paymentSaaS._.name}`,
          "cleanupCancelledPayments"
          );
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        break;
      } catch (error) {
        attempts++;
        await logSnagErrors(
          `Attempt ${attempts} failed for table ${paymentSaaS._.name}:`, 
          "cleanupCancelledPayments"
        );
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }
  }
  catch(error) {
    await logSnagErrors (error instanceof Error
              ? error.message
              :  "Hitilafu imetokea kwenye func ya kufuta malipo yaliyoahirishwa",
              "cleanupCancelledPayments");
  }
}

// function to send daily report
export const sendDailyReportCron = async () => {
  try {
    const emails = await mainDb.select({
      email: users.email,
      shopName: shops.name
    }).from(users)
    .innerJoin(shopUsers, eq(users.id, shopUsers.userId))
    .innerJoin(shops, eq(shops.id, shopUsers.shopId));

    console.log("Emails: ", emails);

    // await sendDailyReportEmail();
  } catch (error) {
        await logSnagErrors (error instanceof Error
              ? error.message
              :  "Hitilafu imetokea kwenye func ya kutuma dailyReport",
              "sendDailyReportCron");
  }
}