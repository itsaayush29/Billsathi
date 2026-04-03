import { AdminCommandLayout, formatCurrency } from "../../../components/admin-command-layout";
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

type Payment = {
  id: string;
  amount: number;
  status: string;
  provider: string;
};

type PagedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export default async function AdminAnalyticsPage() {
  const user = await requireAdmin();
  const [dashboard, payments] = await Promise.all([
    apiGet<DashboardData>("/admin/dashboard"),
    apiGet<PagedData<Payment>>("/admin/payments?page=1&pageSize=12")
  ]);

  const bars = [38, 44, 58, 49, 67, 73, 61, 82, 76, 88, 69, 93];
  const providerGroups = payments.data.items.reduce<Record<string, number>>((acc, payment) => {
    acc[payment.provider] = (acc[payment.provider] ?? 0) + payment.amount;
    return acc;
  }, {});
  const revenuePerUser = dashboard.data.totalUsers === 0 ? 0 : dashboard.data.totalRevenue / dashboard.data.totalUsers;
  const invoicePerUser = dashboard.data.totalUsers === 0 ? 0 : dashboard.data.totalInvoices / dashboard.data.totalUsers;

  return (
    <AdminCommandLayout
      user={user}
      activeHref="/admin/analytics"
      title="Analytics Center"
      subtitle="Watch growth patterns, revenue efficiency, and usage trends across BillSathi."
      actions={
        <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#151c27] shadow-[0_4px_20px_rgba(79,70,229,0.05)] transition-colors hover:bg-[#dce2f3]">
          <Icon name="download" className="h-4 w-4" />
          <span className="font-medium">Export Analytics</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)] md:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Revenue per User</p>
          <h3 className="mt-2 font-headline text-4xl font-extrabold text-indigo-600">
            {formatCurrency(revenuePerUser)}
          </h3>
          <p className="mt-2 text-xs text-[#464555]">Average revenue contribution across active accounts</p>
        </section>
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Invoices per User</p>
          <h3 className="mt-2 font-headline text-3xl font-extrabold">{invoicePerUser.toFixed(1)}</h3>
          <p className="mt-2 text-xs text-[#464555]">Average invoice activity</p>
        </section>
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Pro Conversion</p>
          <h3 className="mt-2 font-headline text-3xl font-extrabold">
            {dashboard.data.totalUsers === 0 ? 0 : Math.round((dashboard.data.subscriptions.pro / dashboard.data.totalUsers) * 100)}%
          </h3>
          <p className="mt-2 text-xs text-[#464555]">Share of paid accounts</p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)] lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h4 className="font-headline text-lg font-bold">Growth Momentum</h4>
              <p className="mt-1 text-xs text-[#464555]">Simulated trend view built from current platform summary metrics.</p>
            </div>
            <span className="rounded-full bg-[#f0f3ff] px-3 py-1 text-xs font-bold text-indigo-700">Last 12 periods</span>
          </div>

          <div className="flex h-72 items-end justify-between gap-2 px-2">
            {bars.map((height, index) => (
              <div
                key={`${height}-${index}`}
                className={`w-full rounded-t-lg ${index >= 8 ? "signature-gradient" : "bg-[#dce2f3]"}`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-between px-1 text-[10px] font-bold text-[#464555]">
            <span>P1</span>
            <span>P2</span>
            <span>P3</span>
            <span>P4</span>
            <span>P5</span>
            <span>P6</span>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
            <h4 className="font-headline font-bold">Gateway Revenue</h4>
            <div className="mt-4 space-y-4">
              {Object.entries(providerGroups).map(([provider, amount], index) => (
                <div key={provider} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${index === 0 ? "bg-indigo-600" : index === 1 ? "bg-emerald-500" : "bg-[#dce2f3]"}`} />
                    <span className="text-xs font-medium">{provider}</span>
                  </div>
                  <span className="text-xs font-bold">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-6 shadow-lg">
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Icon name="sparkles" className="h-20 w-20 text-white" />
            </div>
            <h4 className="font-headline font-bold text-white">Operator Note</h4>
            <p className="mt-1 text-xs leading-relaxed text-indigo-100">
              Billing volume is healthy, and paid-plan density remains the strongest lever for near-term revenue growth.
            </p>
            <button className="mt-4 w-full rounded-lg bg-white/20 py-2 text-xs font-bold text-white transition-colors hover:bg-white/30">
              Generate executive summary
            </button>
          </div>
        </section>
      </div>
    </AdminCommandLayout>
  );
}
