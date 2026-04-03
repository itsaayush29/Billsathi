import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { signSessionToken } from "../../lib/auth.js";

function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    createdAt: user.createdAt
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (existingUser) {
    throw createHttpError(409, "An account with that email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: UserRole.USER
    }
  });

  return {
    token: signSessionToken({ userId: user.id }),
    user: serializeUser(user)
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    throw createHttpError(401, "Invalid email or password");
  }

  return {
    token: signSessionToken({ userId: user.id }),
    user: serializeUser(user)
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return serializeUser(user);
}
