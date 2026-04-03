"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import type { SessionUser } from "../lib/types";
import { Icon } from "./icon";
import { LogoutButton } from "./logout-button";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SettingsPanel({ user }: { user: SessionUser }) {
  const initialValues = useMemo(
    () => ({
      businessName: user.name,
      email: user.email,
      address: "402, Highstreet Heights, Tech Park Road, Bangalore - 560001",
      gstNumber: "29ABCDE1234F1Z5",
      businessType: "Private Limited Company",
      panNumber: "ABCDE1234F",
      state: "Karnataka (29)"
    }),
    [user.email, user.name]
  );

  const [form, setForm] = useState(initialValues);
  const [message, setMessage] = useState("");

  const navigation: Array<{
    href: Route;
    label: string;
    icon: "dashboard" | "receipt" | "users" | "settings" | "admin";
    active: boolean;
  }> = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard", active: false },
    { href: "/invoices", label: "Invoices", icon: "receipt", active: false },
    { href: "/customers", label: "Customers", icon: "users", active: false },
    { href: "/settings", label: "Settings", icon: "settings", active: true },
    { href: "/admin/dashboard", label: "Admin Panel", icon: "admin", active: false }
  ];

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function discardChanges() {
    setForm(initialValues);
    setMessage("Changes discarded.");
  }

  function saveProfile() {
    setMessage("Settings saved locally. Backend profile persistence for these fields is the next step.");
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-body text-[#151c27]">
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-white/80 px-6 py-3 shadow-[0_4px_20px_rgba(79,70,229,0.05)] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="font-headline text-xl font-bold tracking-tight text-indigo-600">
            BillSathi
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            href="/invoices"
            className="rounded-lg px-3 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
          >
            Invoices
          </Link>
          <Link
            href="/settings"
            className="border-b-2 border-indigo-600 px-3 py-1 text-sm font-semibold text-indigo-600"
          >
            Settings
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <Icon name="bell" className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#e7eefe] text-xs font-bold text-indigo-600 shadow-sm">
            {getInitials(user.name)}
          </div>
        </div>
      </nav>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col gap-2 bg-slate-50 p-4 pt-20 md:flex">
        <div className="mb-6 px-2">
          <h2 className="font-headline text-2xl font-black text-indigo-600">BillSathi</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            GST Invoicing
          </p>
        </div>
        <nav className="space-y-1">
          {navigation
            .filter((item) => item.href !== "/admin/dashboard" || user.role === "ADMIN")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-sm font-bold text-indigo-600">
              {getInitials(user.name)}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs text-[#464555]">
                {user.plan === "PRO" ? "Premium Account" : "Starter Account"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="pb-24 pt-20 md:pb-8 md:pl-64">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <header className="mb-10">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[#151c27]">
              Settings
            </h1>
            <p className="mt-2 font-medium text-[#464555]">
              Manage your business profile and GST compliance details.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f46e5]/10 text-[#3525cd]">
                  <Icon name="wallet" className="h-5 w-5" />
                </div>
                <h2 className="font-headline text-xl font-bold">Business Info</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#c7c4d8]/30 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
                  <div className="group relative z-10 mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e7eefe] shadow-md">
                    <div className="flex h-full w-full items-center justify-center text-3xl font-black text-indigo-600">
                      {getInitials(form.businessName)}
                    </div>
                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-[#3525cd]/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Icon name="upload" className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Company Logo
                  </p>
                  <p className="text-center text-[10px] text-[#464555]">
                    PNG, JPG up to 5MB
                    <br />
                    200x200px recommended
                  </p>
                </div>

                <div className="rounded-xl bg-white p-8 shadow-[0_4px_20px_rgba(79,70,229,0.05)] lg:col-span-2">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#464555]">
                        Business Name
                      </label>
                      <input
                        className="w-full rounded-lg bg-[#f9f9ff] px-4 py-3 shadow-sm ring-1 ring-[#c7c4d8]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                        type="text"
                        value={form.businessName}
                        onChange={(event) => updateField("businessName", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#464555]">
                        Primary Email
                      </label>
                      <input
                        className="w-full rounded-lg bg-[#f9f9ff] px-4 py-3 shadow-sm ring-1 ring-[#c7c4d8]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField("email", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-[#464555]">
                        Registered Office Address
                      </label>
                      <textarea
                        className="w-full rounded-lg bg-[#f9f9ff] px-4 py-3 shadow-sm ring-1 ring-[#c7c4d8]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                        rows={3}
                        value={form.address}
                        onChange={(event) => updateField("address", event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6cf8bb]/20 text-[#006c49]">
                  <Icon name="verified" className="h-5 w-5" />
                </div>
                <h2 className="font-headline text-xl font-bold">GST &amp; Tax Compliance</h2>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#6cf8bb]/5 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#464555]">
                      GST Number
                      <Icon name="verified" className="h-3.5 w-3.5 text-[#006c49]" />
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg bg-[#f9f9ff] py-4 pl-4 pr-24 font-mono text-lg font-semibold shadow-sm ring-1 ring-[#c7c4d8]/30 focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                        type="text"
                        value={form.gstNumber}
                        onChange={(event) => updateField("gstNumber", event.target.value)}
                      />
                      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                        <span className="rounded-full bg-[#6cf8bb]/20 px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-[#00714d]">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#464555]">
                      Business Type
                    </label>
                    <select
                      className="w-full cursor-pointer appearance-none rounded-lg bg-[#f9f9ff] px-4 py-4 shadow-sm ring-1 ring-[#c7c4d8]/30 focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                      value={form.businessType}
                      onChange={(event) => updateField("businessType", event.target.value)}
                    >
                      <option>Private Limited Company</option>
                      <option>Partnership Firm</option>
                      <option>Sole Proprietorship</option>
                      <option>LLP</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#464555]">
                      PAN Number
                    </label>
                    <input
                      className="w-full rounded-lg bg-[#f9f9ff] px-4 py-3 font-mono shadow-sm ring-1 ring-[#c7c4d8]/30 focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                      type="text"
                      value={form.panNumber}
                      onChange={(event) => updateField("panNumber", event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#464555]">
                      State/UT
                    </label>
                    <input
                      className="w-full rounded-lg bg-[#f9f9ff] px-4 py-3 shadow-sm ring-1 ring-[#c7c4d8]/30 focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
                      type="text"
                      value={form.state}
                      onChange={(event) => updateField("state", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="rounded-xl bg-[#f0f3ff] p-4 text-sm text-[#464555]">
              These fields are currently editable in the UI for the full settings experience. Persisting business and GST details to the backend can be added next.
            </div>

            {message ? <p className="text-sm font-medium text-[#3525cd]">{message}</p> : null}

            <div className="hidden items-center justify-end gap-4 pt-4 md:flex">
              <button
                type="button"
                onClick={discardChanges}
                className="rounded-xl px-8 py-3 font-bold text-[#464555] transition-colors hover:bg-[#e7eefe]"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={saveProfile}
                className="signature-gradient rounded-xl px-12 py-3 font-bold text-white shadow-lg shadow-[#3525cd]/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </main>

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
          <Link
            href="/invoices/new"
            className="signature-gradient flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-[#3525cd]/30 transition-transform active:scale-90"
          >
            <Icon name="addCircle" className="h-7 w-7" />
          </Link>
        </div>
        <Link href="/customers" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="users" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Customers</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center justify-center text-indigo-600">
          <Icon name="settings" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>

      <div className="pointer-events-none fixed bottom-20 left-0 w-full px-6 py-4 md:hidden">
        <button
          type="button"
          onClick={saveProfile}
          className="signature-gradient pointer-events-auto flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-xl shadow-[#3525cd]/30 transition-transform active:scale-[0.98]"
        >
          <Icon name="verified" className="h-5 w-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
