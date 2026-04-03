import type { UserPlan } from "@prisma/client";
import createHttpError from "http-errors";
import type { NextFunction, Request, Response } from "express";

export function requirePlan(plan: UserPlan) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.auth?.plan !== plan) {
      return next(createHttpError(403, "This feature requires a pro subscription"));
    }

    return next();
  };
}
