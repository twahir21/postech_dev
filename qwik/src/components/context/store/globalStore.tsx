import { createContextId } from "@builder.io/qwik";

export interface profitPerProduct {
    productname?: string;
    totalsales?: string;
    totalcost?: string;
    profit?: string;
}

export interface netProfit {
    totalExpenses?: number;
    totalSales?: number;
    totalPurchases?: number;
    netProfit?: number;
}

export interface highestProfitProfit {
    productname?: string;
    profit?: string;
}

export interface lowestProduct {
    name?: string;
    stock?: number;
    minStock?: number;
}

export interface mostProdQuantity {
    productname?: string;
    totalquantitysold?: string;
}

export interface freqProdQuantity {
    productname?: string;
    timessold?: string;
}

export interface longDebtUser {
    name?: string;
    remainingAmount?: number;
    daysSinceDebt?: string;
}

export interface mostDebtUser {
    name?: string;
    remainingAmount?: string;
}

export interface globalStoreTypes {
    profitPerProduct: profitPerProduct[];

}

export const globalStoreContext = createContextId<globalStoreTypes>('globalstore-context');


