import createHttpError from "http-errors";
import { prisma } from "../../config/prisma.js";

export async function listCustomers(userId: string, page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    prisma.customer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.customer.count({ where: { userId } })
  ]);

  return { items, total, page, pageSize };
}

export async function getCustomer(userId: string, id: string) {
  const customer = await prisma.customer.findFirst({
    where: { id, userId }
  });

  if (!customer) {
    throw createHttpError(404, "Customer not found");
  }

  return customer;
}

export async function createCustomer(
  userId: string,
  input: { name: string; phone?: string; email?: string }
) {
  return prisma.customer.create({
    data: {
      userId,
      ...input
    }
  });
}

export async function updateCustomer(
  userId: string,
  id: string,
  input: Partial<{ name: string; phone?: string; email?: string }>
) {
  await getCustomer(userId, id);
  return prisma.customer.update({
    where: { id },
    data: input
  });
}

export async function deleteCustomer(userId: string, id: string) {
  await getCustomer(userId, id);
  await prisma.customer.delete({ where: { id } });
}
