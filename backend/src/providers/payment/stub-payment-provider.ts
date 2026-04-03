import type { PaymentOrderInput, PaymentOrderResult, PaymentProvider } from "./payment-provider.js";

export class StubPaymentProvider implements PaymentProvider {
  async createOrder(input: PaymentOrderInput): Promise<PaymentOrderResult> {
    return {
      provider: "stub",
      orderId: `stub-order-${input.userId}-${Date.now()}`,
      status: "pending"
    };
  }
}
