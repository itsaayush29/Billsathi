import type {
  MessagingProvider,
  SendInvoiceMessageInput,
  SendInvoiceMessageResult
} from "./messaging-provider.js";

export class StubMessagingProvider implements MessagingProvider {
  async sendInvoiceMessage(
    _input: SendInvoiceMessageInput
  ): Promise<SendInvoiceMessageResult> {
    return {
      provider: "stub",
      accepted: true
    };
  }
}
