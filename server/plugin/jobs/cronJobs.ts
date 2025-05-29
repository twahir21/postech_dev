import { mainDb } from "../../database/schema/connections/mainDb";
import { emailVerifications, expenses, notifications, products, purchases, returns, sales, shops, shopUsers, supplierPriceHistory } from "../../database/schema/shop";
import { and, eq, lt } from "drizzle-orm";
import nodemailer from "nodemailer";
import "dotenv/config";
import { retentionPeriods, type SubscriptionLevel } from "../../functions/utils/packages";

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
    const zohoEmail = "huduma@mypostech.store";
    
    let transporter = nodemailer.createTransport({
        host: "smtp.zoho.com", 
        port: 465, // Use 465 for SSL or 587 for TLS
        secure: true, // true for 465 (SSL), false for 587 (TLS)
        auth: {
            user: zohoEmail,
            pass: process.env.ZOHO_APP_PASSWORD,
        },
    });
    
    const dbTime = await mainDb
    .select({
        trialEnd: shops.trialEnd,
        id: shops.id,
        subscription: shops.subscription,
    })
    .from(shops);

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

            console.log(`⛔ Trial expired for shop ID ${shop.id}. Marked isPaid as false.`);
            // You could also send email or notification here if needed

            // send Email
            transporter.sendMail({
            from: `"myPosTech" <${zohoEmail}>`,
            to: process.env.TO_EMAIL,
            subject: "ujumbe kutoka myPosTech",
            html: `
                <!DOCTYPE html>
                <html lang="sw">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Muda umekwisha</title>
                <style>
                    body {
                    font-family: 'Quicksand', sans-serif;
                    background-color: #e2e8f0;
                    padding: 1rem;
                    color: #1f2937;
                    font-size: 14px;
                    margin: 0;
                    }
                    .container {
                    max-width: 28rem;
                    margin: 0 auto;
                    background: white;
                    border: 2px solid #334155;
                    border-radius: 1.5rem;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    overflow: hidden;
                    }
                    .header {
                    text-align: center;
                    padding: 2rem 1.5rem;
                    background: linear-gradient(to top, #8324f0, #163ce7);
                    }
                    .header img {
                    width: 5rem;
                    margin: 0 auto 1rem;
                    }
                    .header h2 {
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0;
                    }
                    .content {
                    padding: 2rem 1.5rem;
                    text-align: center;
                    }
                    .content p {
                    margin-bottom: 1.5rem;
                    font-size: 14px;
                    }
                    .content a {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    border: 2px solid #334155;
                    background-color: #c7bbfc;
                    color: #111827;
                    font-weight: bold;
                    border-radius: 9999px;
                    text-decoration: none;
                    }
                    .footer {
                    margin-top: 2rem;
                    font-size: 12px;
                    color: #6b7280;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">
                        <img src="https://www.mypostech.store/thumbail.png" alt="App Logo">
                        <h2>Muda wa Jaribio Umeisha ⏳</h2>
                    </div>
                    <div class="content">
                    <p>
                        Habari <strong>"${shopName[0].name}"</strong>,
                    </p>
                    <p style="line-height: 1.6;">
                        Jaribio lako la siku 14 kwenye <strong>myPosTech</strong> limeisha. Ili kuendelea kutumia mfumo na kuona ripoti, faida na kufanya mauzo, tafadhali boresha kifurushi chako sasa.
                    </p>
                    <p style="line-height:1.6;">
                        Tunapendekeza kujiunga na kifurushi <strong>Lite</strong> au <strong>Business</strong> kulingana na ukubwa wa biashara yako.
                    </p>
                    <a href="https://www.mypostech.store/pricing">Boresha Sasa</a>
                    <div class="footer">
                        <p>Asante kwa kutumia mfumo wetu. myPosTech - Biashara yako, Teknolojia yetu.</p>
                    </div>
                    </div>
                </div>
                </body>
                </html>
            `,
            });

            // set notification (in - app )
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
