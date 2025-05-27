import { and, count, eq, sql } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { notifications } from "../database/schema/shop";

export const notifyCount = async ({ userId, shopId }: { userId: string; shopId: string }) => {
    try {
        const unread = await mainDb.select({
            count: count()
        })
        .from(notifications).where(
                and(
                    eq(notifications.isRead, false),
                    eq(notifications.shopId, shopId)
                )
            )
        return {
            success: true,
            data: [{ count: unread[0]?.count ?? 0}],
            message: "Kuna message hazijasomwa"
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : "Hitilafu imetokea kwenye seva"
        }
    }
}