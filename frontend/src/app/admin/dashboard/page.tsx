import { AdminCommandLayout, formatCurrency, getInitials } from "../../../components/admin-command-layout";
import { Icon } from "../../../components/icon";
import { apiGet, requireAdmin } from "../../../lib/api";

type DashboardData = {
  totalUsers: number;
  totalInvoices: number;
  totalRevenue: number;
  subscriptions: {
    free: number;
    pro: number;
  };
};

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

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const [dashboard, users] = await Promise.all([
    apiGet<DashboardData>("/admin/dashboard"),
    apiGet<PagedData<AdminUser>>("/admin/users?page=1&pageSize=4")
  ]);

  const activeUsers = dashboard.data.totalUsers;
  const totalRevenue = dashboard.data.totalRevenue;
  const complianceScore =
    activeUsers === 0
      ? 100
      : Math.min(99.5, 90 + (dashboard.data.subscriptions.pro / Math.max(activeUsers, 1)) * 10);
  const chartBars = [40, 55, 75, 45, 60, 85, 30, 50, 95, 70, 60, 80];
  const paymentDistribution = [
    { label: "UPI Gateway", value: "64%", color: "bg-indigo-600" },
    { label: "Bank Transfer", value: "22%", color: "bg-emerald-500" },
    { label: "Cards", value: "14%", color: "bg-[#dce2f3]" }
  ];

  return (
    <AdminCommandLayout
      user={user}
      activeHref="/admin/dashboard"
      title="Admin Command Center"
      subtitle="Platform-wide overview and user management."
      actions={
        <>
          <div className="mr-4 hidden -space-x-2 sm:flex">
            {users.data.items.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f9f9ff] bg-[#dce2f3] text-[10px] font-bold text-indigo-600"
              >
                {getInitials(entry.name)}
              </div>
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f9f9ff] bg-[#e7eefe] text-[10px] font-bold">
              +{Math.max(users.data.total - 3, 0)}
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#151c27] shadow-[0_4px_20px_rgba(79,70,229,0.05)] transition-colors hover:bg-[#dce2f3]">
            <Icon name="download" className="h-4 w-4" />
            <span className="font-medium">Export Logs</span>
          </button>
          <button className="signature-gradient flex items-center gap-2 rounded-xl px-6 py-2 font-bold text-white shadow-lg shadow-indigo-500/20 transition-transform duration-200 active:scale-95">
            <Icon name="plus" className="h-4 w-4" />
            New Admin
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)] md:col-span-2">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-indigo-50 transition-transform group-hover:scale-110" />
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">
            Total Ecosystem Revenue
          </p>
          <h3 className="mt-2 font-headline text-4xl font-extrabold text-indigo-600">
            {formatCurrency(totalRevenue)}
          </h3>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center rounded-full bg-[#6cf8bb]/20 px-2 py-0.5 text-sm font-bold text-[#006c49]">
              <Icon name="trendUp" className="mr-1 h-4 w-4" />
              +12.4%
            </span>
            <span className="text-xs text-[#464555]">vs last month</span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon name="users" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">
            Active Users
          </p>
          <h3 className="mt-1 font-headline text-2xl font-extrabold">{activeUsers}</h3>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[#f0f3ff]">
            <div className="h-full w-3/4 bg-indigo-600" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon name="verified" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">
            GST Compliance
          </p>
          <h3 className="mt-1 font-headline text-2xl font-extrabold">
            {complianceScore.toFixed(1)}%
          </h3>
          <p className="mt-2 text-xs text-[#464555]">Optimal System Health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)] lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h4 className="font-headline text-lg font-bold">Revenue Momentum</h4>
              <p className="text-xs text-[#464555]">
                Real-time platform transaction volume
              </p>
            </div>
            <select className="rounded-lg bg-[#f0f3ff] px-3 py-2 text-xs font-bold focus:ring-indigo-500">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>

          <div className="flex h-64 items-end justify-between gap-2 px-2">
            {chartBars.map((height, index) => (
              <div
                key={`${height}-${index}`}
                className={`group relative w-full cursor-pointer rounded-t-lg transition-all ${
                  index === 2 || index === 8
                    ? "signature-gradient hover:opacity-90"
                    : "bg-[#f0f3ff] hover:bg-indigo-200"
                }`}
                style={{ height: `${height}%` }}
              >
                {(index === 2 || index === 8) && (
                  <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded bg-[#151c27] px-2 py-1 text-[10px] text-white group-hover:block">
                    {formatCurrency(totalRevenue / chartBars.length)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between px-1 text-[10px] font-bold text-[#464555]">
            <span>WK 1</span>
            <span>WK 2</span>
            <span>WK 3</span>
            <span>WK 4</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
            <h4 className="mb-4 font-headline font-bold">Payment Distribution</h4>
            <div className="space-y-4">
              {paymentDistribution.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-6 shadow-lg">
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Icon name="sparkles" className="h-20 w-20 text-white" />
            </div>
            <h4 className="font-headline font-bold text-white">Premium Insights</h4>
            <p className="mt-1 text-xs leading-relaxed text-indigo-100">
              System identified {dashboard.data.subscriptions.pro} high-value accounts with Pro activity this cycle.
            </p>
            <button className="mt-4 w-full rounded-lg bg-white/20 py-2 text-xs font-bold text-white transition-colors hover:bg-white/30">
              Run Audit Report
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
        <div className="flex flex-col justify-between gap-4 bg-[#f0f3ff]/50 p-6 md:flex-row md:items-center">
          <h4 className="font-headline text-lg font-bold">Enterprise Users</h4>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-56 rounded-lg bg-white py-1.5 pl-9 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-indigo-500 md:w-64"
                placeholder="Search accounts..."
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
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ff]">
              {users.data.items.map((entry, index) => {
                const active = entry.plan === "PRO" || index % 3 !== 2;
                const revenueEstimate =
                  (totalRevenue / Math.max(users.data.items.length, 1)) * (1 + index * 0.2);

                return (
                  <tr key={entry.id} className="group transition-colors hover:bg-[#f0f3ff]/20">
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
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          active
                            ? "bg-[#6cf8bb] text-[#00714d]"
                            : "bg-[#ffdad6] text-[#93000a]"
                        }`}
                      >
                        {active ? "ACTIVE" : "SUSPENDED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{entry.plan}</td>
                    <td className="px-6 py-4 text-sm text-[#464555]">
                      {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatCurrency(revenueEstimate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 transition-colors hover:text-indigo-600">
                        <Icon name="more" className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#f0f3ff] bg-[#f0f3ff]/30 p-6">
          <p className="text-xs font-medium text-[#464555]">
            Showing {users.data.items.length} of {users.data.total} users
          </p>
          <div className="flex gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#464555] shadow-sm opacity-50"
              disabled
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm">
              1
            </button>
            <button className="h-8 w-8 rounded-lg bg-white text-xs font-bold text-[#464555] shadow-sm">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#464555] shadow-sm">
              <Icon name="chevronRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AdminCommandLayout>
  );
}
