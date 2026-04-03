import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  COOKIE_NAME: z.string().default("billsathi_session"),
  COOKIE_DOMAIN: z.string().optional().default(""),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  PAYMENT_PROVIDER: z.string().default("stub"),
  MESSAGING_PROVIDER: z.string().default("stub"),
  PDF_PROVIDER: z.string().default("stub")
});

export const env = envSchema.parse(process.env);
