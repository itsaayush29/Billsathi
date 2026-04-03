import type { UserPlan, UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: UserRole;
        plan: UserPlan;
      };
    }
  }
}

export {};
