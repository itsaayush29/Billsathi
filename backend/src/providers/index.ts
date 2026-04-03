import { StubMessagingProvider } from "./messaging/stub-messaging-provider.js";
import { StubPaymentProvider } from "./payment/stub-payment-provider.js";
import { StubPdfProvider } from "./pdf/stub-pdf-provider.js";

export const paymentProvider = new StubPaymentProvider();
export const messagingProvider = new StubMessagingProvider();
export const pdfProvider = new StubPdfProvider();
