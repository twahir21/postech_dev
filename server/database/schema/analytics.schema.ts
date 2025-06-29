// tables for 6 graphs and do cron job for computation 
// and check if data reaches a week unlock the week function 

import { pgTable, text, uuid } from "drizzle-orm/pg-core";


// -------------------------------------------------
//              VISITORS 
// -------------------------------------------------


export const visitorDetails = pgTable("visitor_details", {
    id: uuid("id").defaultRandom().primaryKey(),
    visitorId: text("visitor_id").notNull(),
    proxy: text("proxy"),
    type: text("type"),
    continent: text("continent"),
    country: text("country"),
    city: text("city"),
    region: text("region"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    timezone: text("timezone"),
    provider: text("provider"),
    currency: text("currency"),
    userAgent: text("user_agent"), // device info
    referer: text("referer"), // captures the previous URL that led the user to your page.
    refererDomain: text("referer_domain"), // captures the previous URL that led the user to your page.
    date: text("date"),
    ip: text("ip")
});