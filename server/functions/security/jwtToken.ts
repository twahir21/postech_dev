import type { AuthCookie, CookieTypes, DecodedToken,  jwtTypes } from "../../types/types";


export function isDecodedToken(token: unknown): token is DecodedToken {
    if (
      typeof token === 'object' &&
      token !== null
    ) {
      const t = token as Record<string, unknown>;
      return (
        typeof t.userId === 'string' &&
        typeof t.shopId === 'string'
      );
    }
  
    return false;
  }
  
  
  export const extractId = async ({ jwt, cookie }: { jwt: jwtTypes; cookie: CookieTypes })=> {
    const token = cookie.auth_token?.value;
    if (!token) {
      return {
        success: false,
        message: "Huna ruhusa! - hakuna token"
      }
    }
  
    const decoded = await jwt.verify(token);
  
    if (!isDecodedToken(decoded)) {
      return {
        success: false,
        message: "Huna ruhusa! - Token sio sahihi"
      }
    }
  
    // ✅ Now fully type-safe
    return {
      userId: decoded.userId,
      shopId: decoded.shopId,
    };
  };
  


// Function to delete the auth_token cookie
export default async function deleteAuthTokenCookie(cookie: AuthCookie): Promise<void> {
    try {
        // Set the cookie value to an empty string and set its expiration date to the past
        cookie.auth_token.set({
            value: '', // Empty value to delete the cookie
            httpOnly: true, // prevents JavaScript from accessing it
            secure: true, // send over HTTPS only
            sameSite: 'none', // for cross-origin requests
            maxAge: 0, // Expire the cookie immediately
            path: '/', // Path where the cookie is accessible
            domain: '.mypostech.store', // Domain for the cookie
        });

    } catch (error) {
        console.error("Error deleting the auth token cookie:", error);
        throw new Error("Failed to delete the auth token cookie.");
    }
}

