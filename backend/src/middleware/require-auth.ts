import createHttpError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { verifySessionToken } from "../lib/auth.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.COOKIE_NAME];

  if (!token) {
    return next(createHttpError(401, "Authentication required"));
  }

  try {
    const payload = verifySessionToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        plan: true
      }
    });

    if (!user) {
      return next(createHttpError(401, "Session is no longer valid"));
    }

    req.auth = {
      userId: user.id,
      role: user.role,
      plan: user.plan
    };

    return next();
  } catch {
    return next(createHttpError(401, "Invalid session"));
  }
}
