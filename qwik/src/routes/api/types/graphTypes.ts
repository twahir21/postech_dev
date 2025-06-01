export interface GraphData {
    id?: string;
    DebtsByCustomer: { customerId: string; totalDebt: number }[];
    stockTrend: { day: string; totalStock: number }[];
    cashDebtData: { type: string; amount: number }[];
}