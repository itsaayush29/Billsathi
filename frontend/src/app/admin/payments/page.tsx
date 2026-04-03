import { AdminCommandLayout, formatCurrency, getInitials } from "../../../components/admin-command-layout";
import { Icon } from "../../../components/icon";
import { apiGet, requireAdmin } from "../../../lib/api";

type Payment = {
  id: string;
  amount: number;
  status: string;
  provider: string;
  user: {
    name: string;
    email: string;
  };
};

type PagedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export default async function AdminPaymentsPage() {
  const user = await requireAdmin();
  const payments = await apiGet<PagedData<Payment>>("/admin/payments?page=1&pageSize=12");

  const totalRevenue = payments.data.items.reduce((sum, payment) => sum + payment.amount, 0);
  const successful = payments.data.items.filter((payment) => payment.status === "SUCCESS").length;
  const failed = payments.data.items.filter((payment) => payment.status === "FAILED").length;

  return (
    <AdminCommandLayout
      user={user}
      activeHref="/admin/payments"
      title="Payment Control"
      subtitle="Track settlements, payment failures, and provider health across the platform."
      actions={
        <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#151c27] shadow-[0_4px_20px_rgba(79,70,229,0.05)] transition-colors hover:bg-[#dce2f3]">
          <Icon name="download" className="h-4 w-4" />
          <span className="font-medium">Export Payments</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon name="payments" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Captured Volume</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{formatCurrency(totalRevenue)}</h3>
          <p className="mt-2 text-xs text-[#464555]">Current page payment volume</p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon name="verified" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Successful</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{successful}</h3>
          <p className="mt-2 text-xs text-[#464555]">Confirmed payments received</p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffdad6] text-[#ba1a1a]">
            <Icon name="hourglass" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Failed / Pending</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{failed}</h3>
          <p className="mt-2 text-xs text-[#464555]">Requires verification or retry</p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(79,70,229,0.05)] lg:col-span-2">
          <div className="flex flex-col justify-between gap-4 bg-[#f0f3ff]/50 p-6 md:flex-row md:items-center">
            <div>
              <h4 className="font-headline text-lg font-bold">Transaction Log</h4>
              <p className="mt-1 text-xs text-[#464555]">Provider-level payment activity and merchant attribution.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-56 rounded-lg bg-white py-2 pl-9 pr-4 text-xs shadow-sm focus:ring-2 focus:ring-indigo-500 md:w-72"
                  placeholder="Search payment ID, provider..."
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
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3ff]">
                {payments.data.items.map((payment) => (
                  <tr key={payment.id} className="transition-colors hover:bg-[#f0f3ff]/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7eefe] font-bold text-indigo-600">
                          {getInitials(payment.user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{payment.user.name}</p>
                          <p className="text-[10px] text-[#464555]">{payment.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{payment.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-[#464555]">{payment.provider}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${payment.status === "SUCCESS" ? "bg-[#6cf8bb] text-[#00714d]" : payment.status === "FAILED" ? "bg-[#ffdad6] text-[#93000a]" : "bg-[#e7eefe] text-indigo-700"}`}>
                        {payment.status}
                      </span>
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
        </section>

        <section className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
            <h4 className="font-headline font-bold">Provider Split</h4>
            <div className="mt-4 space-y-4">
              {["RAZORPAY", "BANK_TRANSFER", "MANUAL"].map((provider, index) => (
                <div key={provider} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${index === 0 ? "bg-indigo-600" : index === 1 ? "bg-emerald-500" : "bg-[#dce2f3]"}`} />
                    <span className="text-xs font-medium">{provider}</span>
                  </div>
                  <span className="text-xs font-bold">
                    {payments.data.items.filter((payment) => payment.provider === provider).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-6 shadow-lg">
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Icon name="sparkles" className="h-20 w-20 text-white" />
            </div>
            <h4 className="font-headline font-bold text-white">Risk Queue</h4>
            <p className="mt-1 text-xs leading-relaxed text-indigo-100">
              {failed} payment records need follow-up for retries, refunds, or merchant outreach.
            </p>
            <button className="mt-4 w-full rounded-lg bg-white/20 py-2 text-xs font-bold text-white transition-colors hover:bg-white/30">
              Review failed payments
            </button>
          </div>
        </section>
      </div>
    </AdminCommandLayout>
  );
}
