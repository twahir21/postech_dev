import type { JWTPayloadSpec } from "@elysiajs/jwt";
import type { StatusMap } from "elysia";
import type { ElysiaCookie } from "elysia/cookies";
import type { HTTPHeaders } from "elysia/types";

// interfaces
export interface registerRequest {
    email: string;
    username: string;
    password: string;
    name: string;
    phoneNumber: string;
}

export interface productTypes {
    name: string;
    priceBought: number;
    priceSold: number;
    stock: number;
    minStock: number;
    unit: string;
}

export interface headTypes {
    [key: string]: string | undefined;
}

export interface suppTypes {
    company: string;
    contact: string;
}

export interface loginTypes {
    username?: string;
    password?: string;
}


export interface ProductQuery {
    search?: string;
    page?: string;
    limit?: string;
  }
  
export interface CustomerTypes {
    name: string;
    contact: string;
}

export interface QrData {
    calculatedTotal: number;
    quantity: number;
    saleType: string;
    discount: number;
    description: string;
    typeDetected: string;
    productId: string;
    priceSold: number;
    priceBought: number;
    supplierId: string;
    customerId: string;
}

export type SalesQuery = {
    search?: string;
    date?: string;
    page?: string;
    limit?: string;
    from?: string;
    to?: string;
  };

  
export type exportSet = {
        headers: HTTPHeaders;
        status?: number | keyof StatusMap;
        redirect?: string;
        cookie?: Record<string, ElysiaCookie>;
}


export interface shopTypes {
    email: string;
    phoneNumber: string;
    shopName: string;
}

export interface pswdType {
    currentPassword: string;
    newPassword: string;
}


export interface DecodedToken {
    userId: string;
    shopId: string;
  }
  
  
export  interface CookieTypes {
      auth_token?: {
        value: string;
      };
  }

export  interface jwtTypes {
    readonly sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
    readonly verify: (jwt?: string) => Promise<false | (Record<string, string | number> & JWTPayloadSpec)>;
  }


  // ------------------
  // DEBTS TYPES
  // ------------------
  interface CustomerDebt {
  debtId: string;
  customerId: string;
  name: string;
  totalDebt: number;
  remainingAmount: number;
  lastPaymentDate: Date;
  createdAt: Date;
}

interface PaymentHistory {
  customerId: string;
  name: string;
  totalPaid: number;
  paymentDate: Date;
}

interface DebtReceipt {
  date: Date;
  customerId: string;
  product: string;
  quantity: number;
  priceSold: number;
  total: number;
}

export interface MergedCustomerData extends CustomerDebt {
  payment: {
    totalPaid: number;
    lastPayment: Date;
  } | null;
  receipts: {
    date: Date;
    product: string;
    quantity: number;
    priceSold: number;
    total: number;
  }[];
}


export type PlanType = 'msingi' | 'lite';
export type PaymentMethod = 'TIGO-PESA' | 'AIRTEL-MONEY';
export type Duration = 1 | 6 | 12;

export interface PaymentRequest {
  id?: string;
  price: number;
  duration: Duration;
  paymentMethod: PaymentMethod;
  plan: PlanType;
}

export interface USSDCheckResponse {
    checkUSSDResult: {
        activeMethods: {
        name: 'TIGO-PESA' | 'AIRTEL-MONEY';
        status: 'AVAILABLE' | 'UNAVAILABLE'; 
        fee: number;
        }[];
    };
}