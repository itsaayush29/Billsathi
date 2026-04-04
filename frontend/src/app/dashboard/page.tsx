import Link from "next/link";
import type { Route } from "next";
import { Icon } from "../../components/icon";
import { LogoutButton } from "../../components/logout-button";
import { apiGet, requireUser } from "../../lib/api";

type Customer = {
  id: string;
  name: string;
};

type Invoice = {
  id: string;
  amount: number;
  status: "DRAFT" | "SENT" | "PAID" | "CANCELLED";
  invoiceDate: string;
  customer?: Customer | null;
};

type PagedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getStatusBadge(status: Invoice["status"]) {
  switch (status) {
    case "PAID":
      return "bg-[#6cf8bb] text-[#00714d]";
    case "SENT":
      return "bg-[#d8e2ff] text-[#004395]";
    case "CANCELLED":
      return "bg-[#ffdad6] text-[#93000a]";
    default:
      return "bg-[#e2dfff] text-[#3323cc]";
  }
}

function getStatusLabel(status: Invoice["status"]) {
  switch (status) {
    case "PAID":
      return "Paid";
    case "SENT":
      return "Pending";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Draft";
  }
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [invoiceResponse, customerResponse] = await Promise.all([
    apiGet<PagedData<Invoice>>("/invoices?page=1&pageSize=5"),
    apiGet<PagedData<Customer>>("/customers?page=1&pageSize=5")
  ]);

  const invoices = invoiceResponse.data.items;
  const invoiceTotal = invoiceResponse.data.total;
  const customerTotal = customerResponse.data.total;

  const revenue = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const pendingRevenue = invoices
    .filter((invoice) => invoice.status === "SENT" || invoice.status === "DRAFT")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const remainingInvoices = user.plan === "PRO" ? "Unlimited" : Math.max(100 - invoiceTotal, 0);

  const navigation: Array<{
    href: Route;
    label: string;
    icon:
      | "dashboard"
      | "receipt"
      | "users"
      | "settings"
      | "admin";
    active: boolean;
  }> = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" as const, active: true },
    { href: "/invoices", label: "Invoices", icon: "receipt" as const, active: false },
    { href: "/customers", label: "Customers", icon: "users" as const, active: false },
    { href: "/settings", label: "Settings", icon: "settings" as const, active: false },
    { href: "/admin/dashboard", label: "Admin Panel", icon: "admin" as const, active: false }
  ];

  const mobileNav: Array<{
    href: Route;
    label: string;
    icon: "home" | "receipt" | "users" | "settings";
    active: boolean;
  }> = [
    { href: "/dashboard", label: "Home", icon: "home" as const, active: true },
    { href: "/invoices", label: "Invoices", icon: "receipt" as const, active: false },
    { href: "/customers", label: "Customers", icon: "users" as const, active: false },
    { href: "/settings", label: "Settings", icon: "settings" as const, active: false }
  ];

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] antialiased">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col gap-2 bg-slate-50 p-4 md:flex">
        <div className="mb-4 px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="signature-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <Icon name="receipt" className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-headline text-2xl font-black leading-none tracking-tight text-indigo-600">
                BillSathi
              </h1>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                GST Invoicing
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ease-out ${
                item.active
                  ? "bg-white font-bold text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:bg-indigo-50"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="rounded-xl bg-[#e7eefe] p-4">
          <p className="mb-2 text-xs font-semibold text-[#464555]">PRO PLAN</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-3/4 bg-indigo-600" />
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            {remainingInvoices === "Unlimited"
              ? "Unlimited invoices available"
              : `${remainingInvoices}/100 invoices left`}
          </p>
        </div>
      </aside>

      <header className="glass-header fixed top-0 z-50 flex w-full items-center justify-between px-6 py-3 shadow-[0_4px_20px_rgba(79,70,229,0.05)] md:hidden">
        <div className="flex items-center gap-2">
          <span className="font-headline text-xl font-bold text-indigo-600">BillSathi</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 text-slate-500 transition-colors duration-200 active:scale-95 hover:bg-slate-100">
            <Icon name="bell" className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-indigo-100 bg-[#e7eefe] text-xs font-bold text-indigo-600">
            {getInitials(user.name)}
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-7xl px-4 pb-24 pt-20 sm:px-6 md:ml-64 md:px-10 md:pb-8 md:pt-0">
        <header className="py-8 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="font-headline text-2xl font-black tracking-tight text-[#151c27] sm:text-3xl">
              Dashboard
            </h2>
            <p className="mt-1 text-[#464555]">
              Welcome back, {user.name}. Here&apos;s your financial overview for this month.
            </p>
          </div>
          <div className="mt-6 grid w-full gap-3 sm:flex sm:flex-wrap md:mt-0 md:w-auto">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#e2dfff] px-5 py-2.5 font-semibold text-indigo-600 transition-all hover:bg-indigo-100">
              <Icon name="download" className="h-5 w-5" />
              <span className="text-sm">Reports</span>
            </button>
            <Link
              href="/invoices/new"
              className="signature-gradient flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-bold text-white shadow-lg shadow-indigo-100 transition-transform active:scale-95"
            >
              <Icon name="addCircle" className="h-5 w-5" />
              <span className="text-sm">New Invoice</span>
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group rounded-xl border border-slate-50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                <Icon name="receipt" className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-[#6cf8bb]/20 px-2 py-1 text-xs font-bold text-[#4edea3]">
                +12%
              </span>
            </div>
            <p className="text-sm font-medium text-[#464555]">Total Invoices</p>
            <h3 className="mt-1 font-headline text-2xl font-black">{invoiceTotal}</h3>
          </div>

          <div className="group rounded-xl border border-slate-50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6cf8bb]/10 text-[#006c49] transition-colors group-hover:bg-[#006c49] group-hover:text-white">
                <Icon name="payments" className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-[#6cf8bb]/20 px-2 py-1 text-xs font-bold text-[#4edea3]">
                +18.5%
              </span>
            </div>
            <p className="text-sm font-medium text-[#464555]">Revenue</p>
            <h3 className="mt-1 font-headline text-2xl font-black">{formatCurrency(revenue)}</h3>
          </div>

          <div className="group rounded-xl border border-slate-50 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffdad6]/20 text-[#ba1a1a] transition-colors group-hover:bg-[#ba1a1a] group-hover:text-white">
                <Icon name="hourglass" className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-[#ffdad6]/30 px-2 py-1 text-xs font-bold text-[#ba1a1a]">
                -4%
              </span>
            </div>
            <p className="text-sm font-medium text-[#464555]">Pending Payments</p>
            <h3 className="mt-1 font-headline text-2xl font-black">
              {formatCurrency(pendingRevenue)}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-xl font-bold tracking-tight">Recent Invoices</h3>
              <Link href="/invoices" className="text-sm font-bold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-50 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {["Invoice", "Customer", "Amount", "Status", "Action"].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.length > 0 ? (
                      invoices.map((invoice) => {
                        const customerName = invoice.customer?.name ?? "Walk-in Customer";
                        const initials = getInitials(customerName);

                        return (
                          <tr
                            key={invoice.id}
                            className="transition-colors hover:bg-slate-50/50"
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold">
                                  #{invoice.id.slice(-6).toUpperCase()}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                  })}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2dfff] text-xs font-bold text-indigo-600">
                                  {initials}
                                </div>
                                <span className="text-sm font-medium">{customerName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(invoice.status)}`}
                              >
                                {getStatusLabel(invoice.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-slate-400 hover:text-indigo-600">
                                <Icon name="more" className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                          No invoices yet. Create your first invoice to populate the dashboard.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-slate-100 md:hidden">
                {invoices.length > 0 ? (
                  invoices.map((invoice) => {
                    const customerName = invoice.customer?.name ?? "Walk-in Customer";
                    const initials = getInitials(customerName);

                    return (
                      <Link
                        key={invoice.id}
                        href={`/invoices/${invoice.id}`}
                        className="block p-4 active:bg-slate-50/50"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#151c27]">
                              #{invoice.id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(invoice.status)}`}
                          >
                            {getStatusLabel(invoice.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e2dfff] text-xs font-bold text-indigo-600">
                              {initials}
                            </div>
                            <span className="truncate text-sm font-medium">{customerName}</span>
                          </div>
                          <span className="shrink-0 text-sm font-bold">
                            {formatCurrency(invoice.amount)}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-6 py-10 text-center text-sm text-slate-500">
                    No invoices yet. Create your first invoice to populate the dashboard.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="font-headline text-xl font-bold tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-200">
                <div className="relative z-10">
                  <h4 className="font-headline text-lg font-bold leading-tight">
                    Export GST Reports
                  </h4>
                  <p className="mt-2 text-xs text-indigo-100 opacity-80">
                    Ready for GSTR-1 filing? Download your data in Excel format instantly.
                  </p>
                  <button className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-50">
                    Export Now
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-white/5 blur-xl" />
              </div>

              <Link
                href="/customers"
                className="flex items-center justify-between rounded-xl border border-slate-50 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-[#006c49]">
                    <Icon name="contactCard" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Add Customer</p>
                    <p className="text-[11px] text-slate-400">Save details for later</p>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50">
                  <Icon name="chevronRight" className="h-4 w-4" />
                </div>
              </Link>

              <div className="rounded-xl border border-slate-50 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Icon name="verified" className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-bold">Premium Subscription</span>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-slate-500">
                  Your plan is <span className="font-bold text-[#151c27]">{user.plan}</span>.{" "}
                  {user.plan === "PRO"
                    ? "You have premium invoice generation and sharing enabled."
                    : "Upgrade to unlock PDF generation and WhatsApp sharing."}
                </p>
                <Link
                  href="/subscription"
                  className="block w-full rounded-xl border-2 border-indigo-100 py-2.5 text-center text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-50"
                >
                  Manage Billing
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl bg-white px-2 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        {mobileNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-transform duration-150 active:scale-90 ${
              item.active ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        <Link href="/invoices" className="-mt-8 flex flex-col items-center justify-center text-indigo-600">
          <div className="signature-gradient flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-white shadow-lg shadow-indigo-200">
            <Icon name="plus" className="h-7 w-7" />
          </div>
          <span className="mt-1 text-[10px] font-medium">Create</span>
        </Link>
      </nav>
    </div>
  );
}
