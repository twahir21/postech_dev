export const askedFunc = async ({ shopId, userId }: { shopId: string; userId: string }): Promise<{ success: boolean; message: string; data?: unknown}> => {
    try {

        return {
            success: true,
            message: "Data fetched successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Tatizo limetokea wakati wa kupata data"
        };
    }
}

export const askedFuncPost = async ({ shopId, userId }: { shopId: string; userId: string }): Promise<{ success: boolean; message: string; data?: unknown}> => {
    try {
        // Simulate a successful post operation
        return {
            success: true,
            message: "Data posted successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Tatizo limetokea wakati wa kutuma data"
        };
    }
}