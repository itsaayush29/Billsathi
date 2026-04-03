import PDFDocument from "pdfkit";
import type { PdfProvider, GenerateInvoicePdfInput, GenerateInvoicePdfResult } from "./pdf-provider.js";

export class StubPdfProvider implements PdfProvider {
  async generateInvoicePdf(input: GenerateInvoicePdfInput): Promise<GenerateInvoicePdfResult> {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    doc.fontSize(20).text("BillSathi Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Business: ${input.businessName}`);
    doc.text(`Customer: ${input.customerName}`);
    doc.text(`Amount: ${input.amount}`);
    doc.text(`Status: ${input.status}`);
    doc.moveDown();
    input.items.forEach((item) => {
      doc.text(`${item.name} - ${item.quantity} x ${item.unitPrice}`);
    });
    doc.end();

    const buffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    return {
      provider: "stub",
      fileKey: `invoice-${input.invoiceId}.pdf`,
      contentBase64: buffer.toString("base64")
    };
  }
}
