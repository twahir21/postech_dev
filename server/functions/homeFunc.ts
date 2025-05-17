import { eq } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { emailVerifications } from "../database/schema/shop";
import type { headTypes } from "../types/types";
import { getTranslation } from "./translation";

export const homeGet = async({ headers }: {headers: headTypes}) => {


    // warm up the database
    try{
        await mainDb.delete(emailVerifications)
                .where(eq(emailVerifications.used, true));
        return {
            success: true,
            message: (lang, "greeting")
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