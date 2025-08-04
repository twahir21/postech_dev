import Elysia from "elysia";
import { main } from "../robot/grok";
import { mainGemini } from "../robot/gemini";

const promptToEnter = `
    Given the following Swahili sentence: 
    'Nimempunguzia mama juma shilingi 10,000 kwenye unga kilo 5', 

    Extract the following details and return them in valid JSON format:

    {
        "productName": string,               // Name of the product (e.g., "maziwa ya ng'ombe")
        "customerName": string | null,       // Name of the customer (e.g., "mama juma")
        "action": "kukopesha" | "kuuza" | "kununua" | "kutumia",  // Only one of these fixed values
        "quantity": number | 1,              // Quantity in decimal (e.g., 17.5 for "kumi na saba na nusu")
        "discount": number | null            // Extract numeric discount if present
    }

    Notes:
    - The "action" must be one of: "kukopesha", "kuuza", "kununua", or "kutumia"
    - The "discount" value should be extracted only if mentioned using phrases like: "nimemtolea", "punguzo", or "nimempunguzia"
    - If no discount is mentioned, set "discount" to null

`;


export const robotAiPlugin = new Elysia()
    .get("/robot", async () => {
        await main(promptToEnter);
    })
    .get("/gemini", async () => {
        console.time("geminiApi")
        await mainGemini(promptToEnter)
        console.timeEnd("geminiApi")
    })