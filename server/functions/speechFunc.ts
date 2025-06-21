import { detectSwahiliTransaction } from "./utils/NLP";

export const handleSpeech = async (shopId: string, userId: string, text: string) : Promise<{ success: boolean; message: string }> => {
    try {

        // we must validate the speech/text given
        // ? format is [action] [optional: customer] [product] [optional: unit] [quantity] [optional: punguzo <number>]

         const result = detectSwahiliTransaction(text);


        console.log("Result: ", result);
        // ! swahili texts convertion to numbers are supported above 10,000 as stocks
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