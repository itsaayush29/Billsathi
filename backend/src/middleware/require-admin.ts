import createHttpError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.auth?.role !== UserRole.ADMIN) {
    return next(createHttpError(403, "Admin access required"));
  }

  return next();
}
