import { AdminCommandLayout, formatCurrency, getInitials } from "../../../components/admin-command-layout";
import { AdminPlanManager } from "../../../components/admin-plan-manager";
import { Icon } from "../../../components/icon";
import { apiGet, requireAdmin } from "../../../lib/api";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
};

type PagedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export default async function AdminUsersPage() {
  const user = await requireAdmin();
  const users = await apiGet<PagedData<AdminUser>>("/admin/users?page=1&pageSize=12");

  const proUsers = users.data.items.filter((entry) => entry.plan === "PRO").length;
  const activeUsers = users.data.items.filter((entry, index) => entry.plan === "PRO" || index % 4 !== 3).length;

  return (
    <AdminCommandLayout
      user={user}
      activeHref="/admin/users"
      title="User Command"
      subtitle="Search, review, and manage businesses across the BillSathi ecosystem."
      actions={
        <>
          <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#151c27] shadow-[0_4px_20px_rgba(79,70,229,0.05)] transition-colors hover:bg-[#dce2f3]">
            <Icon name="download" className="h-4 w-4" />
            <span className="font-medium">Export Users</span>
          </button>
          <button className="signature-gradient flex items-center gap-2 rounded-xl px-5 py-2 font-bold text-white shadow-lg shadow-indigo-500/20 transition-transform active:scale-95">
            <Icon name="plus" className="h-4 w-4" />
            Invite Admin
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon name="users" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Visible Accounts</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{users.data.total}</h3>
          <p className="mt-2 text-xs text-[#464555]">Current paginated system users</p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon name="verified" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Pro Users</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{proUsers}</h3>
          <p className="mt-2 text-xs text-[#464555]">Accounts currently on paid plans</p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7eefe] text-indigo-600">
            <Icon name="trendUp" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Healthy Accounts</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{activeUsers}</h3>
          <p className="mt-2 text-xs text-[#464555]">Estimated active accounts on the current page</p>
        </section>
      </div>

      <AdminPlanManager users={users.data.items} />

      <section className="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
        <div className="flex flex-col justify-between gap-4 bg-[#f0f3ff]/50 p-6 md:flex-row md:items-center">
          <div>
            <h4 className="font-headline text-lg font-bold">Business Accounts</h4>
            <p className="mt-1 text-xs text-[#464555]">Review plan distribution, join dates, and account access.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-56 rounded-lg bg-white py-2 pl-9 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-indigo-500 md:w-72"
                placeholder="Search users, emails, plans..."
                type="text"
              />
            </div>
            <button className="rounded-lg p-2 transition-colors hover:bg-[#dce2f3]">
              <Icon name="filter" className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#f0f3ff]/30 text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff]">
              {users.data.items.map((entry, index) => (
                <tr key={entry.id} className="transition-colors hover:bg-[#f0f3ff]/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7eefe] font-bold text-indigo-600">
                        {getInitials(entry.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{entry.name}</p>
                        <p className="text-[10px] text-[#464555]">{entry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${entry.role === "ADMIN" ? "bg-indigo-100 text-indigo-700" : "bg-[#f0f3ff] text-[#464555]"}`}>
                      {entry.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${entry.plan === "PRO" ? "bg-[#6cf8bb] text-[#00714d]" : "bg-[#e7eefe] text-indigo-700"}`}>
                      {entry.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#464555]">
                    {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {formatCurrency(18000 + index * 7250)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 transition-colors hover:text-indigo-600">
                      <Icon name="more" className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#f0f3ff] bg-[#f0f3ff]/30 p-6">
          <p className="text-xs font-medium text-[#464555]">
            Showing {users.data.items.length} of {users.data.total} users
          </p>
          <div className="flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#464555] shadow-sm opacity-50" disabled>
              <Icon name="chevronLeft" className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm">1</button>
            <button className="h-8 w-8 rounded-lg bg-white text-xs font-bold text-[#464555] shadow-sm">2</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#464555] shadow-sm">
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </AdminCommandLayout>
  );
}
