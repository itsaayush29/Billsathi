import Link from "next/link";
import type { Route } from "next";
import { Icon } from "./icon";
import { LogoutButton } from "./logout-button";
import type { SessionUser } from "../lib/types";

type NavItem = {
  href: Route;
  label: string;
  icon: "dashboard" | "users" | "payments" | "verified" | "trendUp" | "settings" | "admin";
  active: boolean;
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function adminNav(activeHref: Route): NavItem[] {
  return [
    { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard", active: activeHref === "/admin/dashboard" },
    { href: "/admin/users", label: "Users", icon: "users", active: activeHref === "/admin/users" },
    { href: "/admin/payments", label: "Payments", icon: "payments", active: activeHref === "/admin/payments" },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: "verified", active: activeHref === "/admin/subscriptions" },
    { href: "/admin/analytics", label: "Analytics", icon: "trendUp", active: activeHref === "/admin/analytics" }
  ];
}

export function AdminCommandLayout({
  user,
  title,
  subtitle,
  activeHref,
  actions,
  children
}: {
  user: SessionUser;
  title: string;
  subtitle: string;
  activeHref: Route;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const navItems = adminNav(activeHref);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27]">
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col gap-2 bg-slate-50 p-4 md:flex">
          <div className="mb-4 px-2 py-6">
            <div className="flex items-center gap-3">
              <div className="signature-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
                <Icon name="admin" className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-headline text-2xl font-black tracking-tight text-indigo-600">
                  BillSathi
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  GST Invoicing
                </p>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all duration-200 ease-out hover:bg-indigo-50"
            >
              <Icon name="dashboard" className="h-5 w-5" />
              <span className="font-medium">User Dashboard</span>
            </Link>
            {navItems.map((item) => (
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
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all duration-200 ease-out hover:bg-indigo-50"
            >
              <Icon name="settings" className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-xl bg-[#f0f3ff] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#dce2f3] text-sm font-bold text-indigo-600">
              {getInitials(user.name)}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="text-[10px] font-medium text-[#464555]">Super Admin</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-8 p-6 md:ml-64 md:p-10">
          <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-headline text-3xl font-extrabold tracking-tight">{title}</h2>
              <p className="mt-1 text-[#464555]">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {actions}
              <LogoutButton />
            </div>
          </header>

          {children}

          <div className="h-20 md:hidden" />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl bg-white px-2 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="home" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/invoices" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="receipt" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Invoices</span>
        </Link>
        <div className="relative -mt-8">
          <div className="signature-gradient flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#f9f9ff] text-white shadow-lg shadow-indigo-500/30">
            <Icon name="plus" className="h-7 w-7" />
          </div>
        </div>
        <Link href={activeHref} className="flex flex-col items-center justify-center text-indigo-600">
          <Icon name="admin" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Admin</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="settings" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
