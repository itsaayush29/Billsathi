import { UserPlan } from "@prisma/client";
import { z } from "zod";

export const adminUserParamsSchema = z.object({
  id: z.string().min(1)
});

export const updatePlanSchema = z.object({
  plan: z.nativeEnum(UserPlan)
});

export const adminListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10)
});
