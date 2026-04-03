import { z } from "zod";

export const customerQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10)
});

export const customerParamsSchema = z.object({
  id: z.string().min(1)
});

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().optional()
});

export const updateCustomerSchema = createCustomerSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required"
);
