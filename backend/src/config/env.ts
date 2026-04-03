import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

function normalizeEnvValue(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}

const frontendUrlSchema = z
  .string()
  .default("http://localhost:3000")
  .transform((value) =>
    value
      .split(",")
      .map(normalizeEnvValue)
      .filter(Boolean)
  )
  .pipe(z.array(z.string().url()).min(1));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z
    .string()
    .min(16)
    .refine(
      (value) =>
        process.env.NODE_ENV !== "production" ||
        normalizeEnvValue(value) !== "replace-with-a-long-random-secret",
      {
        message: "JWT_SECRET must be replaced with a real secret in production."
      }
    ),
  COOKIE_NAME: z.string().default("billsathi_session"),
  COOKIE_DOMAIN: z
    .string()
    .optional()
    .default("")
    .transform((value) => normalizeEnvValue(value)),
  FRONTEND_URL: frontendUrlSchema,
  PAYMENT_PROVIDER: z.string().default("stub"),
  MESSAGING_PROVIDER: z.string().default("stub"),
  PDF_PROVIDER: z.string().default("stub")
});

export const env = envSchema.parse(process.env);
