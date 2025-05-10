import { Elysia } from 'elysia';
import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import type { CookieTypes, jwtTypes } from '../types/types';
import { extractId, isDecodedToken } from '../functions/security/jwtToken';

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";

export const authPlugin = new Elysia()
    .use(cookie())
    .use(jwt({ name: 'jwt', secret: JWT_SECRET }))
    .get('/validate-session', async ({ jwt, cookie }: {jwt: jwtTypes, cookie: CookieTypes}) => {
        // if(!token) {
        //     return {
        //         success: false,
        //         message: "Huna ruhusa ya kuingia, tafadhali login"
        //     }
        // }


        // const decoded = await jwt.verify(token);
  
        // if (!isDecodedToken(decoded)) {
        //   return {
        //     success: false,
        //     message: "Huna ruhusa! - Token sio sahihi"
        //   }
        // }
      
        // Return user data or session status
        const { userId, shopId } = await extractId({ jwt, cookie });

        console.log(userId, shopId)
        return { success: true, message: "Umefanikiwa kukaguliwa"};
    });