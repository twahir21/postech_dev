// Analytics Data

export interface ProfitPerProduct {
    productid: string;
    productname: string;
    totalsales: number;
    totalcost: number;
    profit: number;
}// Array

export interface highestProfitProduct {
    productid: string;
    productname: string;
    totalsales: number;
    totalcost: number;
    profit: number;
}


export interface netProfit {
    totalExpenses: number;
    totalSales: number;
    totalPurchases: number;
    netProfit: number;
}

export interface lowestProduct {
    id: string;
    name: string;
    categoryId: string;
    priceSold: number;
    stock: number;
    shopId: string;
    supplierId: string;
    minStock: number;
    status: string;
    unit: string;
    createdAt: string;
    updatedAt: string;
}

export interface lowStockProducts {
    id: string;
    name: string;
    categoryId: string;
    priceSold: number;
    stock: number;
    shopId: string;
    supplierId: string;
    minStock: number;
    status: string;
    unit: string;
    createdAt: string;
    updatedAt: string;
} // array


export interface mostSoldProductByQuantity {
    productid: string;
    productname: string;
    totalquantitysold: number;
    timesSold: number;
    unit: string;
}

export interface longTermDebtUser {
    debtId: string;
    customerId: string;
    remainingAmount: number;
    createdAt: string;
    name: string
}

export interface mostDebtUser {
    debtId: string;
    customerId: string;
    remainingAmount: number;
    createdAt: string;
    name: string;
}


export interface salesByDay {
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    sales: number
}// Array

export interface expensesByDay {
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    expenses: number
}// Array


export interface netSalesByDay {
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    netSales: number
}// Array

export interface purchasesByDay {
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    purchases: number
}// Array


// Final analytics Data types (Full version)
export interface AnalyticsTypes {
    id?: string;
    profitPerProduct: ProfitPerProduct[];
    highestProfitProduct: highestProfitProduct | null;
    mostAsked: string;
    netProfit: netProfit;
    lowestProduct: lowestProduct;
    lowStockProducts: lowStockProducts[];
    mostSoldProductByQuantity: mostSoldProductByQuantity | null;
    longTermDebtUser: longTermDebtUser;
    mostDebtUser: mostDebtUser;
    daysSinceDebt: string;
    salesByDay: salesByDay[];
    expensesByDay: expensesByDay[];
    netSalesByDay: netSalesByDay[];
    purchasesPerDay: purchasesByDay[];
    prodMessage: string;
    subscription: "Msingi" | "Lite" | "Business" | "Pro" | "AI" | "Trial";
    trialEnd: string;
}