"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { clientRequest } from "../lib/client-api";
import type { ApiResponse, SessionUser } from "../lib/types";
import { Icon } from "./icon";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const response = await clientRequest<ApiResponse<SessionUser>>(path, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      router.push(response.data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to continue"
      );
    } finally {
      setLoading(false);
    }
  }

  if (mode === "login") {
    return (
      <div className="w-full">
        <div className="rounded-xl bg-white p-8 shadow-[0_4px_20px_rgba(79,70,229,0.05)] lg:p-10">
          <header className="mb-10">
            <h2 className="mb-2 font-headline text-3xl font-bold text-[#151c27]">
              Welcome Back
            </h2>
            <p className="text-[#464555]">Log in to manage your GST compliance.</p>
          </header>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#464555]" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center transition-all duration-200 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.1)]">
                <Icon name="mail" className="absolute left-4 h-5 w-5 text-[#94a3b8]" />
                <input
                  id="email"
                  className="w-full rounded-lg border border-[#c7c4d8]/30 bg-white py-3.5 pl-12 pr-4 text-[#151c27] outline-none transition-all placeholder:text-[#c7c4d8]/60 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[#464555]" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#3525cd] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center transition-all duration-200 focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.1)]">
                <Icon name="lock" className="absolute left-4 h-5 w-5 text-[#94a3b8]" />
                <input
                  id="password"
                  className="w-full rounded-lg border border-[#c7c4d8]/30 bg-white py-3.5 pl-12 pr-12 text-[#151c27] outline-none transition-all placeholder:text-[#c7c4d8]/60 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 text-[#c7c4d8] transition-colors hover:text-[#464555]"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <Icon
                    name={showPassword ? "eyeOff" : "eye"}
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-[#ba1a1a]">{error}</p> : null}

            <button
              type="submit"
              className="signature-gradient flex w-full items-center justify-center gap-2 rounded-lg py-4 font-headline font-bold text-white shadow-lg transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In to Dashboard"}
              <Icon name="arrowRight" className="h-5 w-5" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c7c4d8]/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 font-medium text-[#c7c4d8]">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center gap-2 rounded-lg border border-[#c7c4d8]/30 px-4 py-3 transition-colors duration-200 hover:bg-[#f0f3ff]"
                type="button"
              >
                <img
                  alt="Google"
                  className="h-5 w-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnRiEAku3Mjdxkq5Q5liadnpcrLjqIKMooGvaFLUnNM5aICIRvRujTc4ukm3shTbD-0Ul1gAf8iNI7VHOzqZx-0047qT9NpRNJfeFDgTHVLyiB6uj0i920kOlcDDX1l_FOH8avBZ1JmGRq7UP6yUDXRYbOPZF-tFxn-ivhwk9KweTRhXNI-Dzsvpv1aNo1kb3cUZTkDkvrnoHrRnafigA3XBl37_tKDRxXR8MxRA7LkSiLHzhuZp2Tcwy4dvzHzlxVf_LaKPSRuRIE"
                />
                <span className="text-sm font-semibold text-[#151c27]">Google</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-lg border border-[#c7c4d8]/30 px-4 py-3 transition-colors duration-200 hover:bg-[#f0f3ff]"
                type="button"
              >
                <Icon name="grid" className="h-5 w-5 text-[#151c27]" />
                <span className="text-sm font-semibold text-[#151c27]">Microsoft</span>
              </button>
            </div>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-sm text-[#464555]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#3525cd] underline-offset-4 hover:underline"
              >
                Create Free Account
              </Link>
            </p>
          </footer>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-[#777587]">
            Trusted by 10k+ Indian Businesses
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale contrast-125">
            <div className="h-6 w-24 rounded bg-[#464555]/20" />
            <div className="h-6 w-20 rounded bg-[#464555]/20" />
            <div className="h-6 w-28 rounded bg-[#464555]/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] bg-white/90 p-8 shadow-xl">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Start billing</p>
        <h1 className="text-3xl font-semibold text-ink">Create your account</h1>
      </div>
      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        required
      />
      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        required
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        className="w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white"
        disabled={loading}
      >
        {loading ? "Please wait..." : "Create account"}
      </button>
    </form>
  );
}
