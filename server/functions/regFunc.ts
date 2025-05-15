import type { headTypes, registerRequest } from "../types/types"; 
import { mainDb } from "../database/schema/connections/mainDb";
import { emailVerifications, shops, users } from "../database/schema/shop";
import { hashPassword } from "./security/hash";
import { getTranslation } from "./translation";
import { eq } from "drizzle-orm"; // Ensure this is imported for querying
import { sanitizeString } from "./security/xss";
import { shopCheckCache, userCheckCache } from "./utils/caches";
import { cacheStatsTracker } from "./utils/Stats";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";




export const regPost = async ({ body, headers }: { body: registerRequest; headers: headTypes }) => {
    const lang = headers["accept-language"]?.split(",")[0] || "sw";
    const frontendURL = process.env.NODE_ENV  === 'development' 
                        ? process.env.FRONTEND_URL_DEV!
                        : process.env.FRONTEND_URL!;

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
    

    try {

        let { name, username, email, password, phoneNumber } = body as registerRequest;

        // 🛡️ **Sanitize Inputs** (takes 3ms)
        name = sanitizeString(name.trim().toLowerCase());
        username = sanitizeString(username.trim().toLowerCase());
        email = sanitizeString(email.trim());
        password = sanitizeString(password.trim());
        phoneNumber = sanitizeString(phoneNumber.trim());
        
        // Check if the email or user is already registered
        // 🧠 Try memory cache first
        const [existingUserCached, existingShopCached] = await Promise.all([
            userCheckCache.get(`user:${email}`),
            shopCheckCache.get(`shop:${name}`),
        ]);

        if (existingUserCached) {
            cacheStatsTracker.recordHit('userCheckCache');
            return {
              success: false,
              message: await getTranslation(lang, "emailExistsErr")
            };
        }

        if (existingShopCached) {
            cacheStatsTracker.recordHit('shopCheckCache');
            return {
              success: false,
              message: await getTranslation(lang, "shopExistsErr")
            };
          }

        // 🚦 Run DB checks in parallel (avoid select() and run one per time)
        // 🔍 If not cached, fetch from DB
        // save is missed
        cacheStatsTracker.recordMiss('userCheckCache');
        cacheStatsTracker.recordMiss('shopCheckCache');

        const [existingUser, existingShop] = await Promise.all([
            mainDb.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1),
            mainDb.select({ id: shops.id }).from(shops).where(eq(shops.name, name)).limit(1)
        ]);
    
        if (existingUser.length > 0) {
            userCheckCache.set(`user:${email}`, { exists: true });
            return {
            success: false,
            message: await getTranslation(lang, "emailExistsErr")
            };
        }
    
        if (existingShop.length > 0) {
            shopCheckCache.set(`shop:${name}`, { exists: true });
            return {
            success: false,
            message: await getTranslation(lang, "shopExistsErr")
            };
        }
        // verify email
        // Step 1: generate token
        const token = uuidv4();

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Step 2: store in DB
        await mainDb.insert(emailVerifications).values({
            token,
            email: body.email,
            password: hashedPassword,
            phone: body.phoneNumber,
            shopName: body.name,
            username: body.username,
            expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
            used: false
        });


        // Step 3: send email with magic link
        const link = `${frontendURL}/verify-email?token=${token}`;

        await transporter.sendMail({
            from: `"PosTech" <${zohoEmail}>`,
            to: body.email,
            subject: "Hakiki barua pepe",
            html: `
                <!DOCTYPE html>
                <html lang="sw">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Thibitisha Barua Pepe</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
                    <style>
                    body {
                        font-family: 'Quicksand', sans-serif;
                    }
                    </style>
                </head>
                <body class="bg-slate-200 p-4 text-gray-800 min-h-screen flex items-center justify-center">
                    <div class="max-w-md mx-auto bg-white border-2 border-slate-700 rounded-3xl shadow-md overflow-hidden">
                    <div class="text-center py-8 px-6 bg-gradient-to-t from-teal-300 to-teal-800">
                        <img src="${frontendURL}/thumbail.png" alt="App Logo" class="w-20 mx-auto mb-4">
                        <h2 class="text-white text-2xl font-semibold">Thibitisha Barua Pepe Yako</h2>
                    </div>
                    <div class="px-6 py-8 text-center">
                        <p class="mb-6 text-base">Habari! Tafadhali bonyeza kitufe hapa chini kuthibitisha anwani yako ya barua pepe <span class="text-red-500">kabla ya dakika 20.</span></p>
                        <a href="${link}"
                        class="inline-block px-6 py-3 rounded-full border-2 border-slate-700 bg-green-200 text-gray-900 font-bold hover:bg-green-300 transition">
                        Thibitisha Barua Pepe
                        </a>
                        <div class="mt-8 text-sm text-gray-500">
                        <p>Ikiwa hukutuma ombi la akaunti au ujumbe huu, tafadhali puuza barua pepe hii.</p>
                        </div>
                    </div>
                    </div>
                </body>
                </html>
            `,
        });

        return {
            success: true,
            message: "Ingia kwenye email yako kuhakiki",
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : sanitizeString(await getTranslation(lang, "serverErr"))
        }
    }
};
