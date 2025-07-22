import { Elysia } from 'elysia';
import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import { authToken } from '../functions/security/validators/data';
import { extractId, isDecodedToken } from '../functions/security/jwtToken';
import { mainDb } from '../database/schema/connections/mainDb';
import { shopUsers, users } from '../database/schema/shop';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";

export const authPlugin = new Elysia()
    .use(cookie())
    .use(jwt({ name: 'jwt', secret: JWT_SECRET }))
    .post('/verify-cookie', async ({ jwt, body, headers }) => {
    
        try {
            const token = body.token as string;
    
            const decoded = await jwt.verify(token);
    
            if (!isDecodedToken(decoded)) {
                return {
                success: false,
                message: "Huna ruhusa! - Token sio sahihi"
                }
            }
            return { success: true, message: "Umefanikiwa kukaguliwa"};
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error
                            ? error.message
                            : "Hitilafu kwenye seva"
            }
        }
    }, {
        body: authToken
    })
    .get("/delete-cookie", async ({ headers, cookie }) => {
            try {
            cookie.auth_token.set({
                value: "",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development' ? false : true,
                sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
                maxAge: 0,
                path: '/',
                domain: process.env.NODE_ENV === 'development' 
                        ? undefined: ".mypostech.store"
            });
            return {
                success: true,
                message: "umefanikiwa kutoka"
            }
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error
                            ? error.message
                            : "Hitilafu kwenye seva"
            }
        }
    })
    .get("/me", async ({ jwt, cookie, headers }) => {
            try{
            const { userId, shopId } = await extractId({ jwt, cookie });
            if (!userId) return;
            const usernameInfo = await mainDb
                                    .select({ username: users.username})
                                    .from(users).where(eq(users.id, userId));
            const username = usernameInfo[0].username;

            cookie.username.set({
                value: username,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development' ? false : true,
                sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
                maxAge: 7 * 86400,
                path: '/',
                domain: process.env.NODE_ENV === 'development' 
                        ? undefined: ".mypostech.store"
            })
            return {
                success: true,
                data: [{ username }],
                message: "successful"
            }
        }catch (error) {
            return {
                success: false,
                message: error instanceof Error
                            ? error.message
                            : "Hitilafu kwenye seva"
            }
        }
    })
    .get("/isPaid", async({ jwt, cookie }) => {
        try {
            const { userId, shopId } = await extractId({ jwt, cookie });

            if (!shopId || !userId) {
                return {
                    success: false,
                    message: "Hakikisha ume login!"
                }
            }

            const isPaid = await mainDb.select({ isPaid: shopUsers.isPaid })
                .from(shopUsers)
                .where(
                    eq(shopUsers.shopId, shopId)
                ).then(r => r[0].isPaid);

            return {
                success: true,
                message: "Status ya malipo imepatikana!",
                data: [{ isPaid }]
            }
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ?
                    error.message
                    : "Hitilafu kwenye seva katika api ya kuangalia malipo"
            }
        }
    })