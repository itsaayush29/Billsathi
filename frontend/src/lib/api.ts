import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiResponse, SessionUser } from "./types";

const API_URL = process.env.BACKEND_API_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "Request failed");
  }

  return (await response.json()) as T;
}

export async function getSessionUser() {
  try {
    const response = await request<ApiResponse<SessionUser>>("/auth/me");
    return response.data;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}

export async function apiGet<T>(path: string) {
  return request<ApiResponse<T>>(path);
}
