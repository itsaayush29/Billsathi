import type { Request, Response } from "express";
import { success } from "../../lib/api-response.js";
import {
  createInvoice,
  deleteInvoice,
  generateInvoicePdf,
  getInvoice,
  listInvoices,
  sendInvoiceWhatsapp,
  updateInvoice
} from "./invoice.service.js";

export async function listInvoicesHandler(req: Request, res: Response) {
  const data = await listInvoices(
    req.auth!.userId,
    Number(req.query.page),
    Number(req.query.pageSize)
  );
  res.json(success(data));
}

export async function getInvoiceHandler(req: Request, res: Response) {
  const data = await getInvoice(req.auth!.userId, String(req.params.id));
  res.json(success(data));
}

export async function createInvoiceHandler(req: Request, res: Response) {
  const data = await createInvoice(req.auth!.userId, req.body);
  res.status(201).json(success(data, "Invoice created"));
}

export async function updateInvoiceHandler(req: Request, res: Response) {
  const data = await updateInvoice(req.auth!.userId, String(req.params.id), req.body);
  res.json(success(data, "Invoice updated"));
}

export async function deleteInvoiceHandler(req: Request, res: Response) {
  await deleteInvoice(req.auth!.userId, String(req.params.id));
  res.json(success(null, "Invoice deleted"));
}

export async function generateInvoicePdfHandler(req: Request, res: Response) {
  const pdf = await generateInvoicePdf(req.auth!.userId, String(req.params.id));
  res.json(success(pdf, "Invoice PDF generated"));
}

export async function sendInvoiceWhatsappHandler(req: Request, res: Response) {
  const result = await sendInvoiceWhatsapp(req.auth!.userId, String(req.params.id));
  res.json(success(result, "Invoice sent via WhatsApp"));
}
