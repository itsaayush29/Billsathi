import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";
import { prisma } from "../../config/prisma.js";
import { messagingProvider, paymentProvider, pdfProvider } from "../../providers/index.js";

type InvoiceItems = Array<{ name: string; quantity: number; unitPrice: number }>;

function serializeInvoice<T extends {
  amount: Prisma.Decimal;
  items: Prisma.JsonValue;
}>(invoice: T): Omit<T, "amount" | "items"> & { amount: number; items: InvoiceItems } {
  return {
    ...invoice,
    amount: Number(invoice.amount),
    items: invoice.items as InvoiceItems
  };
}

export async function listInvoices(userId: string, page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.invoice.count({ where: { userId } })
  ]);

  return {
    items: items.map(serializeInvoice),
    total,
    page,
    pageSize
  };
}

export async function getInvoice(userId: string, id: string) {
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId },
    include: {
      customer: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!invoice) {
    throw createHttpError(404, "Invoice not found");
  }

  return serializeInvoice(invoice);
}

export async function createInvoice(
  userId: string,
  input: {
    customerId?: string;
    amount: number;
    status: string;
    invoiceDate: string;
    items: InvoiceItems;
  }
) {
  if (input.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: input.customerId, userId }
    });
    if (!customer) {
      throw createHttpError(404, "Customer not found");
    }
  }

  const paymentOrder = await paymentProvider.createOrder({
    userId,
    amount: input.amount
  });

  const invoice = await prisma.invoice.create({
    data: {
      userId,
      customerId: input.customerId,
      amount: new Prisma.Decimal(input.amount),
      status: input.status as never,
      invoiceDate: new Date(input.invoiceDate),
      items: input.items
    },
    include: {
      customer: true
    }
  });

  await prisma.payment.create({
    data: {
      userId,
      amount: new Prisma.Decimal(input.amount),
      provider: paymentOrder.provider,
      providerOrderId: paymentOrder.orderId
    }
  });

  return serializeInvoice(invoice);
}

export async function updateInvoice(
  userId: string,
  id: string,
  input: Partial<{
    customerId: string | null;
    amount: number;
    status: string;
    invoiceDate: string;
    items: InvoiceItems;
  }>
) {
  await getInvoice(userId, id);

  if (input.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: input.customerId, userId }
    });
    if (!customer) {
      throw createHttpError(404, "Customer not found");
    }
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      customerId: input.customerId,
      amount: input.amount === undefined ? undefined : new Prisma.Decimal(input.amount),
      status: input.status as never,
      invoiceDate: input.invoiceDate ? new Date(input.invoiceDate) : undefined,
      items: input.items
    },
    include: {
      customer: true
    }
  });

  return serializeInvoice(invoice);
}

export async function deleteInvoice(userId: string, id: string) {
  await getInvoice(userId, id);
  await prisma.invoice.delete({ where: { id } });
}

export async function generateInvoicePdf(userId: string, id: string) {
  const invoice = await getInvoice(userId, id);
  const items = invoice.items as InvoiceItems;
  const customerName =
    typeof invoice.customer === "object" && invoice.customer && "name" in invoice.customer
      ? String(invoice.customer.name)
      : "Walk-in customer";

  const businessName =
    typeof invoice.user === "object" && invoice.user && "name" in invoice.user
      ? String(invoice.user.name)
      : "BillSathi";

  const pdf = await pdfProvider.generateInvoicePdf({
    invoiceId: id,
    businessName,
    customerName,
    amount: String(invoice.amount),
    status: String(invoice.status),
    items
  });

  await prisma.invoice.update({
    where: { id },
    data: {
      pdfFileKey: pdf.fileKey
    }
  });

  return pdf;
}

export async function sendInvoiceWhatsapp(userId: string, id: string) {
  const invoice = await getInvoice(userId, id);

  const phone =
    typeof invoice.customer === "object" && invoice.customer && "phone" in invoice.customer
      ? invoice.customer.phone
      : null;

  const customerName =
    typeof invoice.customer === "object" && invoice.customer && "name" in invoice.customer
      ? String(invoice.customer.name)
      : "Customer";

  if (!phone) {
    throw createHttpError(400, "Customer phone number is required to send WhatsApp messages");
  }

  return messagingProvider.sendInvoiceMessage({
    phone,
    customerName,
    amount: String(invoice.amount)
  });
}
