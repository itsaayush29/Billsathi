import type { Request, Response } from "express";
import { success } from "../../lib/api-response.js";
import { clearSessionCookie, setSessionCookie } from "../../lib/auth.js";
import { getCurrentUser, loginUser, registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const result = await registerUser(req.body);
  setSessionCookie(res, result.token);
  res.status(201).json(success(result.user, "Registration successful"));
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);
  setSessionCookie(res, result.token);
  res.json(success(result.user, "Login successful"));
}

export async function logout(_req: Request, res: Response) {
  clearSessionCookie(res);
  res.json(success(null, "Logout successful"));
}

export async function me(req: Request, res: Response) {
  const user = await getCurrentUser(req.auth!.userId);
  res.json(success(user));
}
