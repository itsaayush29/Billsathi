export type PaymentOrderInput = {
  userId: string;
  amount: number;
};

export type PaymentOrderResult = {
  provider: string;
  orderId: string;
  status: "pending";
};

export interface PaymentProvider {
  createOrder(input: PaymentOrderInput): Promise<PaymentOrderResult>;
}
