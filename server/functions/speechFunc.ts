import { NLP, validateTransactionText } from "./utils/NLP";

export const handleSpeech = async (shopId: string, userId: string, text: string) : Promise<{ success: boolean; message: string }> => {
    try {
        console.log(text);

        // we must validate the speech/text given
        // ? format is [action] [optional: customer] [product] [quantity] [optional: punguzo <number>]
        const result = validateTransactionText(text);

        if (!result.valid) {
            return {
            success: false,
            message: result.errors.join('; ')
            };
        }

        // ! swahili texts convertion to numbers are supported up to 9999 as stocks
        // const { action, customer, product, quantity, discount } = result.parsed;




        // const { quantity, product } = NLP(text);

        // console.log(quantity, product);

        return {
            success: true,
            message: "Imefanikiwa kufanya mauzo"
        }
    } catch (error) {
        return {
            success: false,
             message: error instanceof Error
                ? error.message 
                : "Hitilafu imetokea kwenye seva"
        }
    }
};