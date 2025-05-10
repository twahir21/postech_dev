import type { headTypes } from "../types/types";
import { getTranslation } from "./translation";

export const homeGet = async({ headers }: {headers: headTypes}) => {

    const lang = headers["accept-language"]?.split(",")[0] || "sw";


    try{
        return {
            success: true,
            message: await getTranslation(lang, "greeting")
        }
    }catch(error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    :  await getTranslation(lang, "serverErr")
        }
    }
}