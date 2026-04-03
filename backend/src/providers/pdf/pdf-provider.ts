export type GenerateInvoicePdfInput = {
  invoiceId: string;
  businessName: string;
  customerName: string;
  amount: string;
  status: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
};

export type GenerateInvoicePdfResult = {
  provider: string;
  fileKey: string;
  contentBase64: string;
};

export interface PdfProvider {
  generateInvoicePdf(input: GenerateInvoicePdfInput): Promise<GenerateInvoicePdfResult>;
}
