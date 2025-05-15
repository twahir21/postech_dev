import { Elysia } from "elysia";
import { redirect } from "elysia";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const backendURL = process.env.NODE_ENV === 'development'
                    ? process.env.BACKEND_URL_DEV!
                    : process.env.BACKEND_URL!

const REDIRECT_URI = `${backendURL}/auth/google/callback`;

const googlePlugin = new Elysia()

  .get("/auth/google", () => {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "email profile openid");

    return redirect(url.toString(), 302);
  })

  .get("/auth/google/callback", async ({ query }) => {
    const code = query.code;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    try {
      const { access_token, id_token } = await tokenRes.json();

      const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      }).then(res => res.json());
  
      // ⬇️ Upsert user into your DB, then create a session token
      const { email, name, picture, sub: googleId } = userInfo;
  
      // Create JWT or session cookie here...
      console.log(email, name, picture);
  
      return `Logged in as ${email}`;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error 
                ? error.message
                : "Google failed"
      }
    }
  })

  .post('/verify-captcha', async ({ body }: { body: { token: string } }) => {
    const token = body.token;

    if (!token) {
      return {
        success: false,
        message: "Tokeni ya reCAPTCHA haipo! jaribu tena"
      }
    }
    
    try {
      const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY!, // Secret key from Google
          response: token
        }).toString()
      });
    
      const result = await res.json();
    
      if (result.success) {
        // Passed the captcha
        return { success: true, message: "Success" };
      } else {
        return { success: false, message: result['error-codes'] };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error 
                ? error.message
                : "Imeshindwa kuhakiki reCAPTCHA!"
      }
    }
  })
  
export default googlePlugin;