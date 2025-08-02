import Elysia from "elysia";
import { main } from "../robot/grok";
import { mainGemini } from "../robot/gemini";

const promptToEnter = `
    Given the following Swahili sentence: 
    'mama juma alikopeshwa pipi za maziwa lita sitini na saba na nusu na robo nimemtolea shilingi elfu hamisini na saba', 

    Extract the following details and return them in valid JSON format:

    {
        "productName": string,               // Name of the product (e.g., "maziwa ya ng'ombe")
        "customerName": string | null,       // Name of the customer (e.g., "mama juma")
        "action": "nimemkopesha" | "nimeuza" | "nimenunua" | "nimetumia",  // Only one of these fixed values
        "quantity": number | 1,              // Quantity in decimal (e.g., 17.5 for "kumi na saba na nusu")
        "discount": number | null            // Extract numeric discount if present
    }

    Notes:
    - The "action" must be one of: "nimemkopesha", "nimeuza", "nimenunua", or "nimetumia"
    - The "discount" value should be extracted only if mentioned using phrases like: "nimemtolea", "punguzo", or "nimempunguzia"
    - If no discount is mentioned, set "discount" to null

`;


export const robotAiPlugin = new Elysia()
    .get("/robot", async () => {
        await main(promptToEnter);
    })
    .get("/gemini", async () => {
        await mainGemini(promptToEnter)
    })