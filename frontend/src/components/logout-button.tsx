"use client";

import { useRouter } from "next/navigation";
import { clientRequest } from "../lib/client-api";

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await clientRequest("/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white"
    >
      Logout
    </button>
  );
}
