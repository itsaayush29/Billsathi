"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientRequest } from "../lib/client-api";
import type { ApiResponse, UserPlan } from "../lib/types";
import { Icon } from "./icon";

type AdminPlanUser = {
  id: string;
  name: string;
  email: string;
  plan: string;
};

export function AdminPlanManager({ users }: { users: AdminPlanUser[] }) {
  const router = useRouter();
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );
  const [selectedUserId, setSelectedUserId] = useState(sortedUsers[0]?.id ?? "");
  const [plan, setPlan] = useState<UserPlan>("FREE");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedUserId) {
      setError("Select a user first.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await clientRequest<ApiResponse<{ id: string; plan: string }>>(
        `/admin/users/${selectedUserId}/plan`,
        {
          method: "PATCH",
          body: JSON.stringify({ plan })
        }
      );

      setMessage(response.message ?? `Plan updated to ${plan}.`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to update plan");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h4 className="font-headline text-lg font-bold">Manual Plan Override</h4>
          <p className="mt-1 text-xs text-[#464555]">
            Use this if the automatic subscription flow does not update a user correctly.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon name="verified" className="h-5 w-5" />
        </div>
      </div>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-[1.8fr_1fr_auto]" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#464555]">
            Select User
          </span>
          <select
            className="w-full rounded-xl bg-[#f0f3ff] px-4 py-3 text-sm font-medium text-[#151c27] focus:ring-2 focus:ring-indigo-500"
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
          >
            {sortedUsers.length === 0 ? (
              <option value="">No users available</option>
            ) : (
              sortedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {user.email} · {user.plan}
                </option>
              ))
            )}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#464555]">
            Target Plan
          </span>
          <select
            className="w-full rounded-xl bg-[#f0f3ff] px-4 py-3 text-sm font-medium text-[#151c27] focus:ring-2 focus:ring-indigo-500"
            value={plan}
            onChange={(event) => setPlan(event.target.value as UserPlan)}
          >
            <option value="FREE">FREE</option>
            <option value="PRO">PRO</option>
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSaving || sortedUsers.length === 0}
            className="signature-gradient flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="trendUp" className="h-4 w-4" />
            {isSaving ? "Updating..." : "Update Plan"}
          </button>
        </div>
      </form>

      {message ? <p className="mt-4 text-sm font-medium text-[#00714d]">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-medium text-[#93000a]">{error}</p> : null}
    </section>
  );
}
