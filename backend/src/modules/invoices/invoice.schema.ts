import { InvoiceStatus } from "@prisma/client";
import { z } from "zod";

const invoiceItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative()
});

export const invoiceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10)
});

export const invoiceParamsSchema = z.object({
  id: z.string().min(1)
});

export const createInvoiceSchema = z.object({
  customerId: z.string().min(1).optional(),
  amount: z.number().nonnegative(),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.DRAFT),
  invoiceDate: z.string().datetime(),
  items: z.array(invoiceItemSchema).min(1)
});

export const updateInvoiceSchema = z
  .object({
    customerId: z.string().min(1).nullable().optional(),
    amount: z.number().nonnegative().optional(),
    status: z.nativeEnum(InvoiceStatus).optional(),
    invoiceDate: z.string().datetime().optional(),
    items: z.array(invoiceItemSchema).min(1).optional()
  })
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");
