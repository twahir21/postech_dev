import { Elysia } from "elysia";

const frontendURL = process.env.NODE_ENV === 'development'
  ? process.env.FRONTEND_URL_DEV!
  : process.env.FRONTEND_URL!;

// Normalize and expand allowed origins
const normalizeOrigin = (url: string) => {
  const u = new URL(url);
  return [
    u.origin,               // http://localhost:5173
    `${u.protocol}//${u.host}` // http://localhost:5173 (no trailing slash)
  ];
};

const allowedOrigins = new Set([
  ...normalizeOrigin(frontendURL),
  // Add other production domains if needed
]);

// Relax in development (optional)
const isDevelopment = process.env.NODE_ENV === 'development';

export const csrfProtection = (app: Elysia) =>
  app
    .onBeforeHandle(({ request, set }) => {
      const origin = request.headers.get("origin");
      const method = request.method.toUpperCase();

      // Skip for safe methods
      if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return;

      // Allow same-origin requests (no origin header)
      if (!origin) return;

      // Block if origin exists but isn't allowed
      if (!allowedOrigins.has(origin)) {
        if (isDevelopment) {
          console.warn(`⚠️ CSRF warning: Blocked origin "${origin}"`);
        }
        set.status = 403;
        return {
          success: false,
          message: "Blocked: CSRF protection (invalid origin)"
        };
      }
    })
    // Security headers
    .onAfterHandle(({ set }) => {
      set.headers['Vary'] = 'Origin';
    });