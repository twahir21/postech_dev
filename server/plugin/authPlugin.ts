import { Elysia } from 'elysia';
import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import type { CookieTypes, jwtTypes } from '../types/types';
import { extractId, isDecodedToken } from '../functions/security/jwtToken';
import { authToken } from '../functions/security/validators/data';

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";

export const authPlugin = new Elysia()
    .use(cookie())
    .use(jwt({ name: 'jwt', secret: JWT_SECRET }))
    .post('/verify-cookie', async ({ jwt, body }) => {
        const token = body.token as string;
        console.log(`Body: ${token}`)
        return { success: true, message: "Umefanikiwa kukaguliwa"};
    }, {
        body: authToken
    });