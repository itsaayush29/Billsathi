import bcrypt from "bcryptjs";
import { PrismaClient, UserPlan, UserRole } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@billsathi.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: process.env.SEED_ADMIN_NAME ?? "BillSathi Admin",
      passwordHash,
      role: UserRole.ADMIN,
      plan: UserPlan.PRO
    },
    create: {
      name: process.env.SEED_ADMIN_NAME ?? "BillSathi Admin",
      email,
      passwordHash,
      role: UserRole.ADMIN,
      plan: UserPlan.PRO
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
