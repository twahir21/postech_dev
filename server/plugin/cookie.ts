// plugins/jwtCookie.ts
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";

export const jwtCookiePlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt', // globally accessible via `ctx.jwt`
      secret: JWT_SECRET
    })
  )
  .derive(({ jwt, cookie: { name } }) => {
    return {
      async signToken(data: any) {
        const token = await jwt.sign(data)
        name.set({
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'none',
            maxAge: 7 * 86400,
            path: '/',
            domain: process.env.NODE_ENV === 'development' 
                    ? undefined
                    : ".mypostech.store"
        })
        return token
      },
      async verifyToken() {
        return await jwt.verify(name.value)
      }
    }
  })
