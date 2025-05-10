import { Elysia } from "elysia";
import { redirect } from "elysia";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";

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

    const { access_token, id_token } = await tokenRes.json();

    const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(res => res.json());

    // ⬇️ Upsert user into your DB, then create a session token
    const { email, name, picture, sub: googleId } = userInfo;

    // Create JWT or session cookie here...
    console.log(email, name, picture);

    return `Logged in as ${email}`;
  })

  .post('/verify-recaptcha', async ({ body }) => {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const token = body.token;

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token
      })
    });

    const data = await res.json();
    return { success: data.success };
  })
export default googlePlugin;