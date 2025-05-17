import { eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { emailVerifications } from "../database/schema/shop";

export const homeGet = async() => {


    // warm up the database
    try{
        await mainDb.delete(emailVerifications)
                .where(eq(emailVerifications.used, true));
        return {
            success: true,
            message: "Karibu kwenye seva ya Elysia na Bun!"
        }
    }catch(error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    :  "Hitilafu imetokea kwenye seva"
        }
    }
}