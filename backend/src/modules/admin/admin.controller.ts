import type { Request, Response } from "express";
import { success } from "../../lib/api-response.js";
import {
  getDashboardStats,
  getSubscriptionOverview,
  listPayments,
  listUsers,
  updateUserPlan
} from "./admin.service.js";

export async function getDashboardHandler(_req: Request, res: Response) {
  const data = await getDashboardStats();
  res.json(success(data));
}

export async function listUsersHandler(req: Request, res: Response) {
  const data = await listUsers(Number(req.query.page), Number(req.query.pageSize));
  res.json(success(data));
}

export async function updateUserPlanHandler(req: Request, res: Response) {
  const data = await updateUserPlan(req.auth!.userId, String(req.params.id), req.body.plan);
  res.json(success(data, "Subscription updated"));
}

export async function listPaymentsHandler(req: Request, res: Response) {
  const data = await listPayments(Number(req.query.page), Number(req.query.pageSize));
  res.json(success(data));
}

export async function getSubscriptionsHandler(_req: Request, res: Response) {
  const data = await getSubscriptionOverview();
  res.json(success(data));
}
