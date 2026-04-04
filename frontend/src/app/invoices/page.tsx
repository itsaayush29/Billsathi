import Link from "next/link";
import type { Route } from "next";
import { Icon } from "../../components/icon";
import { LogoutButton } from "../../components/logout-button";
import { apiGet, requireUser } from "../../lib/api";

type Invoice = {
  id: string;
  amount: number;
  status: "DRAFT" | "SENT" | "PAID" | "CANCELLED";
  invoiceDate: string;
  customer?: { name: string } | null;
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
      return "bg-[#6cf8bb]/20 text-[#00714d]";
    case "SENT":
      return "bg-[#d8e2ff]/40 text-[#004395]";
    case "CANCELLED":
      return "bg-[#ffdad6]/30 text-[#ba1a1a]";
    default:
      return "bg-[#e2dfff] text-[#3323cc]";
  }
}

function getStatusDot(status: Invoice["status"]) {
  switch (status) {
    case "PAID":
      return "bg-[#006c49]";
    case "SENT":
      return "bg-[#004598]";
    case "CANCELLED":
      return "bg-[#ba1a1a]";
    default:
      return "bg-[#3525cd]";
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

export default async function InvoicesPage() {
  const user = await requireUser();
  const invoiceResponse = await apiGet<PagedData<Invoice>>("/invoices?page=1&pageSize=20");

  const invoices = invoiceResponse.data.items;
  const totalInvoices = invoiceResponse.data.total;
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidRevenue = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingRevenue = invoices
    .filter((invoice) => invoice.status === "SENT" || invoice.status === "DRAFT")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const cancelledRevenue = invoices
    .filter((invoice) => invoice.status === "CANCELLED")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const navigation: Array<{
    href: Route;
    label: string;
    icon: "dashboard" | "receipt" | "users" | "settings" | "admin";
    active: boolean;
  }> = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard", active: false },
    { href: "/invoices", label: "Invoices", icon: "receipt", active: true },
    { href: "/customers", label: "Customers", icon: "users", active: false },
    { href: "/settings", label: "Settings", icon: "settings", active: false },
    { href: "/admin/dashboard", label: "Admin Panel", icon: "admin", active: false }
  ];

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27]">
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-white/80 px-6 py-3 shadow-[0_4px_20px_rgba(79,70,229,0.05)] backdrop-blur-md md:hidden">
        <div className="text-xl font-bold text-indigo-600">BillSathi</div>
        <div className="flex items-center gap-4">
          <button className="text-slate-500">
            <Icon name="bell" className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#e7eefe] text-xs font-bold text-indigo-600">
            {getInitials(user.name)}
          </div>
        </div>
      </nav>

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col gap-2 bg-slate-50 p-4 md:flex">
        <div className="mb-6 px-2 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f46e5] text-white">
              <Icon name="receipt" className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black leading-none text-indigo-600">BillSathi</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                GST Invoicing
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navigation
            .filter((item) => item.href !== "/admin/dashboard" || user.role === "ADMIN")
            .map((item) => (
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
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
        </nav>

        <div className="mt-auto rounded-xl bg-[#f0f3ff] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-100 bg-white text-sm font-bold text-indigo-600">
              {getInitials(user.name)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-[#151c27]">{user.name}</span>
              <span className="truncate text-xs text-[#464555]">
                {user.plan === "PRO" ? "Premium Account" : "Starter Account"}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="px-4 pb-24 pt-20 md:ml-64 md:px-10 md:pb-8 md:pt-8">
        <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 font-headline text-3xl font-extrabold tracking-tight md:text-4xl">
              Invoices
            </h1>
            <p className="font-medium text-[#464555]">
              Manage and track your business transactions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-[#f0f3ff] px-5 py-2.5 font-bold text-[#3525cd] transition-colors hover:bg-[#e2e8f8]">
              <Icon name="filter" className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <Link
              href="/invoices/new"
              className="signature-gradient flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold text-white shadow-[0_4px_20px_rgba(79,70,229,0.15)] transition-transform hover:scale-[0.99]"
            >
              <Icon name="plus" className="h-5 w-5" />
              <span>Create Invoice</span>
            </Link>
          </div>
        </header>

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2dfff] text-[#3525cd]">
                <Icon name="wallet" className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[#6cf8bb]/20 px-2 py-1 text-xs font-bold text-[#006c49]">
                +12%
              </span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-[#151c27]">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-sm font-medium text-[#464555]">Total Revenue</div>
          </div>

          <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6cf8bb]/30 text-[#006c49]">
                <Icon name="verified" className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-[#151c27]">
              {formatCurrency(paidRevenue)}
            </div>
            <div className="text-sm font-medium text-[#464555]">Paid Invoices</div>
          </div>

          <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d8e2ff] text-[#004598]">
                <Icon name="hourglass" className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-[#151c27]">
              {formatCurrency(pendingRevenue)}
            </div>
            <div className="text-sm font-medium text-[#464555]">Pending Approval</div>
          </div>

          <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffdad6]/30 text-[#ba1a1a]">
                <Icon name="trash" className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-[#151c27]">
              {formatCurrency(cancelledRevenue)}
            </div>
            <div className="text-sm font-medium text-[#464555]">Cancelled</div>
          </div>
        </section>

        <div className="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#e7eefe] p-4 sm:p-6 md:flex-row md:items-center">
            <div className="relative w-full md:w-96">
              <Icon name="search" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#464555]" />
              <input
                className="w-full rounded-xl bg-[#f0f3ff] py-3 pl-12 pr-4 text-sm font-medium placeholder:text-[#777587] focus:ring-2 focus:ring-[#3525cd]"
                placeholder="Search by ID, customer name..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[#464555]">Sort by:</span>
              <select className="cursor-pointer border-none bg-transparent text-sm font-bold text-[#3525cd] focus:ring-0">
                <option>Recent First</option>
                <option>Amount: High to Low</option>
                <option>Status: Paid</option>
              </select>
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#f0f3ff]/50 text-[11px] font-bold uppercase tracking-widest text-[#464555]">
                  <th className="px-8 py-4">Invoice ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7eefe]">
                {invoices.length > 0 ? (
                  invoices.map((invoice, index) => {
                    const customerName = invoice.customer?.name ?? "Walk-in Customer";
                    const initials = getInitials(customerName);
                    const fallbackId = `INV-${String(totalInvoices - index).padStart(4, "0")}`;

                    return (
                      <tr
                        key={invoice.id}
                        className="cursor-pointer transition-colors hover:bg-[#f0f3ff]"
                      >
                        <td className="px-8 py-5 text-sm font-bold text-[#3525cd]">#{fallbackId}</td>
                        <td className="px-8 py-5">
                          <Link href={`/invoices/${invoice.id}`} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c3c0ff] text-xs font-bold text-[#0f0069]">
                              {initials}
                            </div>
                            <span className="text-sm font-semibold text-[#151c27]">
                              {customerName}
                            </span>
                          </Link>
                        </td>
                        <td className="px-8 py-5 font-bold text-[#151c27]">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(invoice.status)}`}
                          >
                            <span className={`mr-2 h-1.5 w-1.5 rounded-full ${getStatusDot(invoice.status)}`} />
                            {getStatusLabel(invoice.status)}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium text-[#464555]">
                          {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Link href={`/invoices/${invoice.id}`} className="inline-flex rounded-lg p-2 transition-colors hover:bg-white">
                            <Icon name="more" className="h-5 w-5 text-[#777587]" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center text-sm text-[#464555]">
                      No invoices yet. Create your first invoice to start tracking transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-[#e7eefe] md:hidden">
            {invoices.length > 0 ? (
              invoices.slice(0, 6).map((invoice, index) => {
                const customerName = invoice.customer?.name ?? "Walk-in Customer";
                const fallbackId = `INV-${String(totalInvoices - index).padStart(4, "0")}`;

                return (
                  <div key={invoice.id} className="p-6 transition-colors active:bg-[#f0f3ff]">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="mb-1 text-xs font-bold text-[#3525cd]">#{fallbackId}</span>
                        <span className="font-bold text-[#151c27]">{customerName}</span>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${getStatusBadge(invoice.status)}`}>
                        {getStatusLabel(invoice.status)}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="mb-0.5 text-xs text-[#464555]">
                          {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                        <span className="text-lg font-extrabold tracking-tight text-[#151c27]">
                          {formatCurrency(invoice.amount)}
                        </span>
                      </div>
                      <Link href={`/invoices/${invoice.id}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7eefe]">
                        <Icon name="chevronRight" className="h-5 w-5 text-[#464555]" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm text-[#464555]">
                No invoices yet. Create one to populate the list.
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6">
            <span className="text-sm font-medium text-[#464555]">
              Showing <span className="font-bold text-[#151c27]">1-{Math.min(invoices.length, 10)}</span>{" "}
              of {totalInvoices} invoices
            </span>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <button className="rounded-lg border border-[#e7eefe] p-2 opacity-50" disabled>
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>
              <button className="h-10 w-10 rounded-lg bg-[#3525cd] text-sm font-bold text-white">1</button>
              <button className="hidden h-10 w-10 rounded-lg text-sm font-bold text-[#151c27] transition-colors hover:bg-[#f0f3ff] sm:block">2</button>
              <button className="hidden h-10 w-10 rounded-lg text-sm font-bold text-[#151c27] transition-colors hover:bg-[#f0f3ff] sm:block">3</button>
              <span className="mx-1 hidden text-[#777587] sm:inline">...</span>
              <button className="rounded-lg border border-[#e7eefe] p-2 transition-colors hover:bg-[#f0f3ff]">
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl border-t border-slate-100 bg-white px-2 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="home" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/invoices" className="flex flex-col items-center justify-center text-indigo-600">
          <Icon name="receipt" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Invoices</span>
        </Link>
        <div className="relative -top-6">
          <Link
            href="/invoices/new"
            className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#3525cd] to-[#004598] text-white shadow-lg"
          >
            <Icon name="plus" className="h-7 w-7" />
          </Link>
        </div>
        <Link href="/customers" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="users" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Customers</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="settings" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>

      <div className="group fixed bottom-8 right-8 hidden md:block">
        <div className="pointer-events-none flex translate-y-4 flex-col items-end gap-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button className="flex items-center gap-2 rounded-xl border border-[#e7eefe] bg-white px-4 py-2 text-sm font-bold text-[#151c27] shadow-xl">
            <Icon name="upload" className="h-5 w-5" />
            Import CSV
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[#e7eefe] bg-white px-4 py-2 text-sm font-bold text-[#151c27] shadow-xl">
            <Icon name="download" className="h-5 w-5" />
            Export All
          </button>
        </div>
        <Link
          href="/invoices/new"
          className="mt-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#4f46e5] text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Icon name="plus" className="h-8 w-8" />
        </Link>
      </div>
    </div>
  );
}
