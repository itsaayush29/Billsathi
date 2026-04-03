import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { LogoutButton } from "./logout-button";
import type { SessionUser } from "../lib/types";

type NavigationItem = {
  href: Route;
  label: string;
};

export function Shell({
  title,
  user,
  navigation,
  children
}: {
  title: string;
  user: SessionUser;
  navigation: NavigationItem[];
  children: ReactNode;
}) {
  const syncedNavigation: NavigationItem[] = [{ href: "/", label: "Home" }, ...navigation];

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-[2rem] bg-ink px-6 py-5 text-white shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{title}</p>
              <h1 className="text-3xl font-semibold">BillSathi</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {syncedNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  {item.label}
                </Link>
              ))}
              <LogoutButton />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
            <span>{user.plan}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
