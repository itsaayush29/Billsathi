export type UserRole = "USER" | "ADMIN";
export type UserPlan = "FREE" | "PRO";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};
