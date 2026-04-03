import type { Request, Response } from "express";
import { success } from "../../lib/api-response.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer
} from "./customer.service.js";

export async function listCustomersHandler(req: Request, res: Response) {
  const data = await listCustomers(
    req.auth!.userId,
    Number(req.query.page),
    Number(req.query.pageSize)
  );
  res.json(success(data));
}

export async function getCustomerHandler(req: Request, res: Response) {
  const data = await getCustomer(req.auth!.userId, String(req.params.id));
  res.json(success(data));
}

export async function createCustomerHandler(req: Request, res: Response) {
  const data = await createCustomer(req.auth!.userId, req.body);
  res.status(201).json(success(data, "Customer created"));
}

export async function updateCustomerHandler(req: Request, res: Response) {
  const data = await updateCustomer(req.auth!.userId, String(req.params.id), req.body);
  res.json(success(data, "Customer updated"));
}

export async function deleteCustomerHandler(req: Request, res: Response) {
  await deleteCustomer(req.auth!.userId, String(req.params.id));
  res.json(success(null, "Customer deleted"));
}
