import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

function normalizeEnvValue(value: string) {
  return value.trim().replace(/^['\"]|['\"]$/g, "");
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

  // FIX 1: The old .refine() threw a ZodError crash when JWT_SECRET was still
  // the Railway default placeholder, killing the process before it could boot.
  // Now we warn loudly instead so the operator can fix it without a boot loop.
  JWT_SECRET: z
    .string()
    .min(16, "JWT_SECRET must be at least 16 characters")
    .transform((value) => {
      const v = normalizeEnvValue(value);
      if (
        process.env.NODE_ENV === "production" &&
        v === "replace-with-a-long-random-secret"
      ) {
        console.warn(
          "\n WARNING: JWT_SECRET is still the default placeholder.\n" +
          "   Generate a real one in Railway > Variables:\n" +
          "   node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"\n"
        );
      }
      return v;
    }),

  // FIX 2: JWT_EXPIRES_IN was missing from the schema
  JWT_EXPIRES_IN: z.string().default("7d"),

  COOKIE_NAME: z.string().default("billsathi_session"),

  // FIX 3: Empty string COOKIE_DOMAIN must become undefined.
  // domain:"" passed to res.cookie() silently breaks cross-site delivery.
  COOKIE_DOMAIN: z
    .string()
    .optional()
    .default("")
    .transform((value) => {
      const v = normalizeEnvValue(value);
      return v === "" ? undefined : v;
    }),

  FRONTEND_URL: frontendUrlSchema,
  PAYMENT_PROVIDER: z.string().default("stub"),
  MESSAGING_PROVIDER: z.string().default("stub"),
  PDF_PROVIDER: z.string().default("stub"),

  // Seed vars - optional, only used by prisma/seed.ts
  SEED_ADMIN_NAME: z.string().optional().default("BillSathi Admin"),
  SEED_ADMIN_EMAIL: z.string().optional().default("admin@billsathi.local"),
  SEED_ADMIN_PASSWORD: z.string().optional().default("ChangeMe123!")
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("\n Invalid environment variables:\n");
  result.error.issues.forEach((issue) => {
    console.error("  - " + issue.path.join(".") + ": " + issue.message);
  });
  console.error("\nFix these in Railway > your service > Variables, then redeploy.\n");
  process.exit(1);
}

export const env = result.data;
