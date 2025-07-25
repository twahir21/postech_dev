import Elysia from "elysia";
import homePlugin from "./plugin/home";
import regPlugin from "./plugin/registration";
import { cors } from "@elysiajs/cors";

import suppPlugin from "./plugin/supplier";
import { loginPlugin } from "./plugin/login";
import { prodPlugin } from "./plugin/products";
import { mailPlugin } from "./plugin/email/smtp";
import cookie from "@elysiajs/cookie";
import { CustomersPlugin } from "./plugin/customer";
import analyticsRoute from "./plugin/analytics";
import { authPlugin } from "./plugin/authPlugin";
import settingsPlugin from "./plugin/settings";
import googlePlugin from "./plugin/google";
import paymentPlugin from "./plugin/payment";
import notifyPlugin from "./plugin/notifications";
import { expensesPlugin } from "./plugin/expenses";
import { debtPlugin } from "./plugin/Debts";
import { trackingVisitors } from "./plugin/app/visitors";
import { askedPlugin } from "./plugin/askedPrd";
import { resetPlugin } from "./plugin/reset";
import { speechPlugin } from "./plugin/speech";
import { csrfProtection } from "./plugin/CSRF";
import { rateLimitMiddleware } from "./functions/security/rateLimiting";
import { bgJobsPlugin } from "./plugin/jobs/worker";

const startTime = Date.now(); // Start time tracking

// LOAD DATA PER ENV
const frontendURL = process.env.NODE_ENV  === 'development' 
                    ? process.env.FRONTEND_URL_DEV!
                    : process.env.FRONTEND_URL!


// initialize translation before start the server
new Elysia()
    // use cookie for JWT
    .use(cookie())

    // Proper CORS handling
    .use(
        cors({
          allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          maxAge: 3600,
          origin: frontendURL,

        })
      )
      .onRequest(({ set }) => {
        set.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'";
        set.headers["X-Frame-Options"] = "DENY";
        set.headers["X-Content-Type-Options"] = "nosniff";
      }
    )

    // 💥 Add it here (before plugins that handle POST/PUT/etc.)
    .use(csrfProtection)
    .onRequest(rateLimitMiddleware)

    .use(homePlugin)
    .use(regPlugin)
    .use(loginPlugin)
    .use(suppPlugin)
    .use(prodPlugin)
    .use(mailPlugin)
    .use(CustomersPlugin)
    .use(analyticsRoute)
    .use(authPlugin)
    .use(settingsPlugin)
    .use(googlePlugin)
    .use(paymentPlugin)
    .use(notifyPlugin)
    .use(expensesPlugin)
    .use(debtPlugin)
    .use(trackingVisitors)
    .use(askedPlugin)
    .use(resetPlugin)
    .use(speechPlugin)
    .use(bgJobsPlugin)

.listen(process.env.PORT ?? 3000) // am using Render.
const endTime = Date.now(); // Start time tracking

console.log(`Server Execution Time: ${endTime - startTime}ms`);

console.log("Server is running ... ")