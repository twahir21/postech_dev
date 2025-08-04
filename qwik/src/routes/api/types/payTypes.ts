export type PlanType = 'msingi' | 'lite';
export type PaymentMethod = 'SIMU' | 'KADI';
export type Duration = 1 | 6 | 12;

export interface PaymentRequest {
  id?: string;
  price: number;
  duration: Duration;
  paymentMethod: PaymentMethod;
  plan: PlanType;
}

