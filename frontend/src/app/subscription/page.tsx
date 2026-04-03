import { Shell } from "../../components/shell";
import { requireUser } from "../../lib/api";

export default async function SubscriptionPage() {
  const user = await requireUser();
  const isPro = user.plan === "PRO";

  return (
    <Shell
      title="Subscription"
      user={user}
      navigation={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/subscription", label: "Subscription" },
        { href: "/invoices", label: "Invoices" }
      ]}
    >
      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-[2rem] bg-white p-6 shadow-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Current plan</p>
          <h2 className="mt-3 text-4xl font-semibold">{user.plan}</h2>
          <p className="mt-4 text-slate-600">
            {isPro
              ? "PDF generation and WhatsApp invoice delivery are unlocked."
              : "Upgrade to Pro to generate PDFs and send invoices over WhatsApp."}
          </p>
        </article>
        <article className="rounded-[2rem] bg-ink p-6 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Upgrade path</p>
          <h2 className="mt-3 text-3xl font-semibold">Pro unlocks premium invoice actions</h2>
          <p className="mt-4 text-slate-300">
            The backend already enforces plan checks, so this page reflects the real permissions your account has.
          </p>
        </article>
      </section>
    </Shell>
  );
}
