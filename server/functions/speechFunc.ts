import { NLP } from "./utils/NLP";

export const handleSpeech = async (shopId: string, userId: string, text: string) : Promise<{ success: boolean; message: string }> => {
    try {
        console.log(text);

        const { quantity, product } = NLP(text);

        console.log(quantity, product);

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