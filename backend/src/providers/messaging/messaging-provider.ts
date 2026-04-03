export type SendInvoiceMessageInput = {
  phone: string;
  customerName: string;
  amount: string;
};

export type SendInvoiceMessageResult = {
  provider: string;
  accepted: boolean;
};

export interface MessagingProvider {
  sendInvoiceMessage(input: SendInvoiceMessageInput): Promise<SendInvoiceMessageResult>;
}
