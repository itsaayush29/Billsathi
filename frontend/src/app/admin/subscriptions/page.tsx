import { AdminCommandLayout } from "../../../components/admin-command-layout";
import { Icon } from "../../../components/icon";
import { apiGet, requireAdmin } from "../../../lib/api";

type SubscriptionSummary = {
  free: number;
  pro: number;
};

export default async function AdminSubscriptionsPage() {
  const user = await requireAdmin();
  const subscriptions = await apiGet<SubscriptionSummary>("/admin/subscriptions");

  const total = subscriptions.data.free + subscriptions.data.pro;
  const proShare = total === 0 ? 0 : Math.round((subscriptions.data.pro / total) * 100);
  const freeShare = total === 0 ? 0 : 100 - proShare;

  return (
    <AdminCommandLayout
      user={user}
      activeHref="/admin/subscriptions"
      title="Subscription Control"
      subtitle="Track free-to-paid conversion, plan balance, and upgrade opportunities."
      actions={
        <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[#151c27] shadow-[0_4px_20px_rgba(79,70,229,0.05)] transition-colors hover:bg-[#dce2f3]">
          <Icon name="download" className="h-4 w-4" />
          <span className="font-medium">Export Summary</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#e7eefe] text-indigo-600">
            <Icon name="users" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Total Accounts</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{total}</h3>
          <p className="mt-2 text-xs text-[#464555]">Users across all plans</p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon name="verified" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Pro Share</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{proShare}%</h3>
          <p className="mt-2 text-xs text-[#464555]">{subscriptions.data.pro} Pro subscribers</p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon name="trendUp" className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Free Share</p>
          <h3 className="mt-1 font-headline text-3xl font-extrabold">{freeShare}%</h3>
          <p className="mt-2 text-xs text-[#464555]">{subscriptions.data.free} free accounts</p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)] lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="font-headline text-lg font-bold">Plan Distribution</h4>
              <p className="mt-1 text-xs text-[#464555]">A clean view of free and paid user concentration.</p>
            </div>
            <span className="rounded-full bg-[#f0f3ff] px-3 py-1 text-xs font-bold text-indigo-700">
              {total} total users
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-[#464555]">Pro</span>
                <span className="font-bold text-indigo-700">{subscriptions.data.pro}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f0f3ff]">
                <div className="signature-gradient h-full" style={{ width: `${proShare}%` }} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-[#464555]">Free</span>
                <span className="font-bold text-emerald-700">{subscriptions.data.free}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f0f3ff]">
                <div className="h-full bg-emerald-500" style={{ width: `${freeShare}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[#f0f3ff] p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Upgrade Opportunity</p>
              <h5 className="mt-2 font-headline text-xl font-bold">{subscriptions.data.free}</h5>
              <p className="mt-1 text-xs text-[#464555]">Accounts eligible for upsell nudges and trial extensions.</p>
            </div>
            <div className="rounded-xl bg-[#e7eefe] p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[#464555]">Retention Focus</p>
              <h5 className="mt-2 font-headline text-xl font-bold">{subscriptions.data.pro}</h5>
              <p className="mt-1 text-xs text-[#464555]">Paid users who should stay protected with renewal reminders.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
            <h4 className="font-headline font-bold">Plan Actions</h4>
            <div className="mt-4 space-y-3">
              <button className="flex w-full items-center justify-between rounded-xl bg-[#f0f3ff] px-4 py-3 text-left transition-colors hover:bg-[#dce2f3]">
                <span className="text-sm font-semibold">Manually upgrade user</span>
                <Icon name="chevronRight" className="h-4 w-4 text-[#464555]" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl bg-[#f0f3ff] px-4 py-3 text-left transition-colors hover:bg-[#dce2f3]">
                <span className="text-sm font-semibold">Extend subscription</span>
                <Icon name="chevronRight" className="h-4 w-4 text-[#464555]" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl bg-[#f0f3ff] px-4 py-3 text-left transition-colors hover:bg-[#dce2f3]">
                <span className="text-sm font-semibold">Cancel plan</span>
                <Icon name="chevronRight" className="h-4 w-4 text-[#464555]" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-6 shadow-lg">
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <Icon name="sparkles" className="h-20 w-20 text-white" />
            </div>
            <h4 className="font-headline font-bold text-white">Conversion Insight</h4>
            <p className="mt-1 text-xs leading-relaxed text-indigo-100">
              The current visible free-to-pro mix suggests room to improve upgrade flows in billing and PDF automation.
            </p>
            <button className="mt-4 w-full rounded-lg bg-white/20 py-2 text-xs font-bold text-white transition-colors hover:bg-white/30">
              Open upgrade campaign
            </button>
          </div>
        </section>
      </div>
    </AdminCommandLayout>
  );
}
