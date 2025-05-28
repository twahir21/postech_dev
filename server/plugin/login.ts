import { Elysia } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { jwt } from '@elysiajs/jwt';
import argon2 from 'argon2'; // For hashing passwords
import { mainDb } from '../database/schema/connections/mainDb';
import { users, shopUsers } from '../database/schema/shop';
import { eq } from 'drizzle-orm';
import { sanitizeString } from '../functions/security/xss';
import { loginData } from '../functions/security/validators/data';
import { loginCache } from '../functions/utils/caches';

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";

export const loginPlugin = new Elysia()
    .use(cookie()) // Use cookie plugin
    .use(
        jwt({
            name: 'jwt',
            secret: JWT_SECRET,  // Secret for JWT
        })
    )
    .post('/login', async ({ body, jwt, cookie: { auth_token }, headers }) => {

        try {
            let { username, password } = body as { username: string, password: string };
            username = sanitizeString(username.trim().toLowerCase());
            password = sanitizeString(password.trim());

            if (!username || !password) {
                return {
                    success: false,
                    message: "Taarifa ulizoweka sio sahihi"
                };
            }

            // 🧠 Generate a unique cache key based on username
            const cacheKey = `LoginData:${username}`;

            // ✅ Try cache first
            const cached = loginCache.get(cacheKey);
            if (cached && typeof cached === 'object') {
                // Generate JWT
                const token = await jwt.sign({
                    userId: cached.payload.userId,
                    shopId: cached.payload.shopId
                });

                if (!token) {
                    return {
                        success: false,
                        message: "Hakuna tokeni, hujaruhusiwa"
                    };
                }

                // Set secure cookie
                auth_token.set({
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
                    maxAge: 7 * 86400,
                    path: '/',
                    domain: process.env.NODE_ENV === 'development'
                        ? undefined: ".mypostech.store"
                });

                return {
                    success: true,
                    message: `Umefanikiwa kuingia kama ${username}`,
                    ...cached.payload
                };
            }

            // ❌ Not in cache → fetch from DB
            const user = await mainDb
                .select({
                    id: users.id,
                    username: users.username,
                    password: users.password
                })
                .from(users)
                .where(eq(users.username, username))
                .limit(1);

            if (!user.length) {
                return {
                    success: false,
                    message: "Mtumiaji hayupo!"
                };
            }

            const userData = user[0];

            // Verify password
            const isValidPassword = await argon2.verify(userData.password, password);
            if (!isValidPassword) {
                return { success: false, message: "Taarifa ulizoweka sio sahihi" };
            }

            // Fetch associated shopId
            const shop = await mainDb
                .select({
                    shopId: shopUsers.shopId,
                })
                .from(shopUsers)
                .where(eq(shopUsers.userId, userData.id))
                .limit(1);

            if (!shop.length) {
                return { success: false, message: 'Hakuna duka lililosajiliwa kwa ajili yako' };
            }

            const shopData = shop[0];

            // Generate JWT
            const token = await jwt.sign({
                userId: userData.id,
                shopId: shopData.shopId
            });

            if (!token) {
                return {
                    success: false,
                    message: "Hakuna tokeni, hujaruhusiwa"
                };
            }

            // Set secure cookie
            auth_token.set({
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development' ? false : true,
                sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
                maxAge: 7 * 86400,
                path: '/',
                domain: process.env.NODE_ENV === 'development'
                        ? undefined: ".mypostech.store"
            });

            // 🧠 Store result in cache for future logins
            const payload = {
                userId: userData.id,
                shopId: shopData.shopId,
            };

            loginCache.set(cacheKey, {
                payload
            });

            return {
                success: true,
                message: `Umefanikiwa kuingia kama ${username}`,
                ...payload
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error
                        ? error.message
                        : "Hitilafu kwenye seva"
            };
        }
    }, {
        body: loginData
    });