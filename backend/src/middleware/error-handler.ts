import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten()
    });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return res.status(503).json({
      success: false,
      message:
        "Database connection failed. Check backend/.env and make sure PostgreSQL is running."
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021" || error.code === "P2022") {
      return res.status(503).json({
        success: false,
        message:
          "Database schema is not initialized. Run `npm run prisma:push --workspace backend` and try again."
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "An account with that value already exists."
      });
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  ) {
    const status = typeof error.status === "number" ? error.status : 500;
    const message = typeof error.message === "string" ? error.message : "Server error";
    return res.status(status).json({
      success: false,
      message
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}
