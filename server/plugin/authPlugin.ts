import { Elysia } from 'elysia';
import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import type { CookieTypes, jwtTypes } from '../types/types';
import { extractId, isDecodedToken } from '../functions/security/jwtToken';

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";

export const authPlugin = new Elysia()
    .use(cookie())
    .use(jwt({ name: 'jwt', secret: JWT_SECRET }))
    .get('/verify-cookie', async ({ jwt, cookie: { auth_token } }) => {
        console.log(`Token: ${auth_token.value}`);
        return { success: true, message: "Umefanikiwa kukaguliwa"};
    });