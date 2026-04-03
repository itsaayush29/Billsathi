import { PaymentStatus, Prisma, UserPlan, UserRole } from "@prisma/client";
import createHttpError from "http-errors";
import { prisma } from "../../config/prisma.js";
import { auditLog } from "../../lib/audit.js";

export async function getDashboardStats() {
  const [users, invoices, payments, freeUsers, proUsers] = await Promise.all([
    prisma.user.count({ where: { role: UserRole.USER } }),
    prisma.invoice.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.SUCCESS }
    }),
    prisma.user.count({ where: { plan: UserPlan.FREE } }),
    prisma.user.count({ where: { plan: UserPlan.PRO } })
  ]);

  return {
    totalUsers: users,
    totalInvoices: invoices,
    totalRevenue: Number(payments._sum.amount ?? new Prisma.Decimal(0)),
    subscriptions: {
      free: freeUsers,
      pro: proUsers
    }
  };
}

export async function listUsers(page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.user.count()
  ]);

  return { items, total, page, pageSize };
}

export async function updateUserPlan(adminUserId: string, id: string, plan: UserPlan) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { plan },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true
    }
  });

  auditLog("admin.user.plan_updated", {
    adminUserId,
    targetUserId: id,
    plan
  });

  return updated;
}

export async function listPayments(page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.payment.count()
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      amount: Number(item.amount)
    })),
    total,
    page,
    pageSize
  };
}

export async function getSubscriptionOverview() {
  const [free, pro] = await Promise.all([
    prisma.user.count({ where: { plan: UserPlan.FREE } }),
    prisma.user.count({ where: { plan: UserPlan.PRO } })
  ]);

  return { free, pro };
}
