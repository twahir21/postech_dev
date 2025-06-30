import Elysia from "elysia";
import { mainDb } from "../../database/schema/connections/mainDb";
import { eq, sql } from "drizzle-orm";
import { visitorDetails } from "../../database/schema/analytics.schema";
import { users } from "../../database/schema/shop";

export const trackingVisitors = new Elysia()
    .post("/sign-visitorDetails", async ({ body, request }: { body: { visitorId: string }; request: Request }) => {
        const { visitorId } = body;
        try {
            console.log(`Visitor ID: ${visitorId}`);
        // check if user exist
        const isAvailable = await mainDb.select({ id: visitorDetails.id }).from(visitorDetails).where(eq(visitorDetails.visitorId, visitorId));

        if (isAvailable.length === 0) {
            // insert new visitor
            const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
            const userAgent = request.headers.get('user-agent') || ''; // capture browser or device info
            const referer = request.headers.get('referer') || ''; // captures the previous URL that led the user to your page.
            const refererDomain = referer.split('/').slice(2).join('/');
            const date = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

            if (ip === '127.0.0.1') {
                console.warn(`Visitor ID: ${visitorId} - Localhost IP detected: ${ip}`);
                return {
                    success: false,
                    message: "Localhost IP detected. Please use a real IP address."
                }
            }

            const result = await fetch(`https://proxycheck.io/v2/${ip}?vpn=1&asn=1`);

            const visitorInfo = await result.json();
            const data = Object.keys(visitorInfo).find((k) => k !== "status")!;
            const details = visitorInfo[data];


            // insert data
            await mainDb.insert(visitorDetails).values({
                visitorId, 
                proxy: details.proxy,
                type: details.type,
                continent: details.continent,
                country: details.country,
                region: details.region,
                city: details.city,
                latitude: details.latitude,
                longitude: details.longitude,
                timezone: details.timezone,
                provider: details.provider,
                currency: details.currency.name + ` (${details.currency.code})`,
                userAgent,
                referer,
                refererDomain,
                date,
                ip
            });
            console.log(`New visitor added: ${visitorId} from ${ip} on ${date}`);
        }
        console.log(`Visitor already exists: ${visitorId} on ${new Date().toISOString()}`);
        return {
            success: true,
            message: "Visitor details saved successfully"
        }

        } catch (error) {
            console.error(error instanceof Error ? error.message : error);
            return {
                success: false,
                message: error instanceof Error 
                        ? error.message 
                        : "Hitilafu kwenye seva"
            }
        }
    })
    .get("count-visitorDetails", async () => {
        const totalCount = await mainDb.select({
            total: sql<number>`COUNT(DISTINCT ${visitorDetails.visitorId})`,
            date: visitorDetails.date
        }).from(visitorDetails).groupBy(visitorDetails.date);   

        if(totalCount.length === 0) {
            return {
                success: true,
                total: 0,
                users: { index: [], dates: [] }
            }
        }

        const usersCount = mainDb.select({
            total: sql<number>`COUNT(DISTINCT ${visitorDetails.visitorId})`,
        }).from(users).where(eq(users.role, "owner"));

        // -- Daily
        // SELECT COUNT(DISTINCT ip) FROM visitorDetails WHERE date = '2025-06-29';

        // -- Weekly
        // SELECT COUNT(DISTINCT ip) FROM visitorDetails WHERE date >= date('now', '-7 days');

        // -- Monthly
        // SELECT COUNT(DISTINCT ip) FROM visitorDetails WHERE date >= date('now', 'start of month');


        return {
            success: true,
            total: totalCount[0].total,
            users: { index: totalCount.map((_, i) => i), dates: totalCount.map(t => t.date) }
        }
    })