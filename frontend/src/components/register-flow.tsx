"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { clientRequest } from "../lib/client-api";
import type { ApiResponse, SessionUser } from "../lib/types";
import { Icon } from "./icon";

type AccountForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type BusinessForm = {
  businessType: string;
  businessName: string;
  category: string;
  address: string;
  gst: string;
  logoName: string;
};

const businessTypes = [
  "Freelancer",
  "Shop Owner",
  "Service Provider",
  "Agency",
  "Other"
];

function InputShell({
  label,
  icon,
  children,
  helper
}: {
  label: string;
  icon?: string;
  children: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#151c27]">{label}</label>
      <div className="relative">
        {icon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            <Icon
              name={
                icon === "person"
                  ? "person"
                  : icon === "mail"
                    ? "mail"
                    : icon === "call"
                      ? "phone"
                      : icon === "lock"
                        ? "lock"
                        : "reset"
              }
              className="h-5 w-5"
            />
          </div>
        ) : null}
        {children}
      </div>
      {helper ? <p className="text-[11px] text-[#464555]">{helper}</p> : null}
    </div>
  );
}

export function RegisterFlow() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<AccountForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [business, setBusiness] = useState<BusinessForm>({
    businessType: "Freelancer",
    businessName: "",
    category: "",
    address: "",
    gst: "",
    logoName: ""
  });

  const passwordMessage = useMemo(() => {
    if (!account.password) {
      return "Must include 8+ chars, 1 uppercase & 1 special character";
    }
    const isStrong =
      account.password.length >= 8 &&
      /[A-Z]/.test(account.password) &&
      /[^A-Za-z0-9]/.test(account.password);
    return isStrong
      ? "Strong password"
      : "Must include 8+ chars, 1 uppercase & 1 special character";
  }, [account.password]);

  function validateStepOne() {
    if (!account.name || !account.email || !account.password || !account.confirmPassword) {
      setError("Please fill all required fields.");
      return false;
    }

    const isStrong =
      account.password.length >= 8 &&
      /[A-Z]/.test(account.password) &&
      /[^A-Za-z0-9]/.test(account.password);

    if (!isStrong) {
      setError("Password must be at least 8 characters and include uppercase and special characters.");
      return false;
    }

    if (account.password !== account.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  }

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await clientRequest<ApiResponse<SessionUser>>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          password: account.password
        })
      });

      router.push(response.data.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {step === 1 ? (
        <main className="flex min-h-screen flex-col md:flex-row">
          <section className="signature-gradient relative hidden overflow-hidden p-12 md:flex md:w-5/12 md:flex-col md:justify-between">
            <div className="z-10">
              <div className="mb-12 flex items-center gap-2">
                <Icon name="wallet" className="h-9 w-9 text-white" />
                <h1 className="font-headline text-2xl font-extrabold tracking-tight text-white">
                  BillSathi
                </h1>
              </div>
              <div className="max-w-md space-y-6">
                <h2 className="font-headline text-5xl font-extrabold leading-tight tracking-tight text-white">
                  Create GST invoices in 30 seconds
                </h2>
                <p className="text-lg font-medium leading-relaxed text-[#dad7ff] opacity-90">
                  Experience the Kinetic Sanctuary of fintech, where high-frequency billing meets editorial elegance.
                </p>
              </div>
            </div>

            <div className="z-10">
              <div className="kinetic-shadow max-w-xs rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6cf8bb] text-[#00714d]">
                    <Icon name="bolt" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Ultra Fast Performance</p>
                    <p className="text-xs text-white/70">99.9% uptime for your business</p>
                  </div>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-2/3 bg-[#6ffbbe]" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
          </section>

          <section className="flex w-full flex-col items-center justify-center bg-[#f9f9ff] px-4 py-6 sm:px-6 md:w-7/12 md:p-12">
            <div className="mb-10 flex w-full items-center justify-center gap-2 md:hidden">
              <Icon name="wallet" className="h-8 w-8 text-[#3525cd]" />
              <span className="font-headline text-xl font-extrabold text-[#151c27]">BillSathi</span>
            </div>

            <div className="w-full max-w-lg">
              <div className="mb-8 flex flex-col gap-2">
                <span className="font-headline text-sm font-bold uppercase tracking-wider text-[#3525cd]">
                  Step 1 of 2
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#e7eefe]">
                  <div className="signature-gradient h-full w-1/2" />
                </div>
              </div>

              <div className="kinetic-shadow rounded-xl border border-[#c7c4d8]/10 bg-white p-5 sm:p-8">
                <div className="mb-8">
                  <h3 className="mb-2 font-headline text-2xl font-bold text-[#151c27]">
                    Account Information
                  </h3>
                  <p className="text-[#464555]">
                    Let&apos;s start with your personal contact details.
                  </p>
                </div>

                <form
                  className="space-y-6"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (validateStepOne()) {
                      setStep(2);
                    }
                  }}
                >
                  <InputShell label="Full Name" icon="person">
                    <input
                      className="w-full rounded-lg border border-[#c7c4d8]/20 bg-white py-3 pl-10 pr-4 outline-none transition-all duration-200 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"
                      placeholder="John Doe"
                      value={account.name}
                      onChange={(event) => setAccount({ ...account, name: event.target.value })}
                    />
                  </InputShell>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputShell label="Email Address" icon="mail">
                      <input
                        className="w-full rounded-lg border border-[#c7c4d8]/20 bg-white py-3 pl-10 pr-4 outline-none transition-all duration-200 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"
                        type="email"
                        placeholder="john@example.com"
                        value={account.email}
                        onChange={(event) => setAccount({ ...account, email: event.target.value })}
                      />
                    </InputShell>

                    <InputShell label="Phone Number" icon="call">
                      <input
                        className="w-full rounded-lg border border-[#c7c4d8]/20 bg-white py-3 pl-10 pr-4 outline-none transition-all duration-200 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={account.phone}
                        onChange={(event) => setAccount({ ...account, phone: event.target.value })}
                      />
                    </InputShell>
                  </div>

                  <InputShell
                    label="Password"
                    icon="lock"
                    helper={passwordMessage}
                  >
                    <input
                      className="w-full rounded-lg border border-[#c7c4d8]/20 bg-white py-3 pl-10 pr-10 outline-none transition-all duration-200 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={account.password}
                      onChange={(event) => setAccount({ ...account, password: event.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#777587] transition-colors hover:text-[#3525cd]"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      <Icon
                        name={showPassword ? "eyeOff" : "eye"}
                        className="h-5 w-5"
                      />
                    </button>
                  </InputShell>

                  <InputShell label="Confirm Password" icon="lock_reset">
                    <input
                      className="w-full rounded-lg border border-[#c7c4d8]/20 bg-white py-3 pl-10 pr-4 outline-none transition-all duration-200 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"
                      type="password"
                      placeholder="••••••••"
                      value={account.confirmPassword}
                      onChange={(event) =>
                        setAccount({ ...account, confirmPassword: event.target.value })
                      }
                    />
                  </InputShell>

                  {error ? <p className="text-sm text-[#ba1a1a]">{error}</p> : null}

                  <button
                    className="signature-gradient kinetic-shadow group mt-8 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 font-headline font-bold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    type="submit"
                  >
                    Next: Business Info
                    <span className="transition-transform group-hover:translate-x-1">
                      <Icon name="arrowRight" className="h-5 w-5" />
                    </span>
                  </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-4 border-t border-[#e7eefe] pt-8">
                  <p className="text-sm text-[#464555]">
                    Already have an account?{" "}
                    <Link className="font-bold text-[#3525cd] hover:underline" href="/login">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="flex min-h-screen bg-[#f9f9ff]">
          <section className="signature-gradient relative hidden w-1/2 overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
            <div className="z-10">
              <div className="mb-12 flex items-center gap-2">
                <Icon name="wallet" className="h-9 w-9 text-white" />
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-white">
                  BillSathi
                </h1>
              </div>
              <div className="max-w-md">
                <h2 className="mb-6 font-headline text-5xl font-extrabold leading-tight text-white">
                  Setup your business in seconds.
                </h2>
                <p className="text-lg leading-relaxed text-[#dad7ff] opacity-90">
                  Join thousands of businesses streamlining their GST invoicing and financial tracking with BillSathi&apos;s kinetic workspace.
                </p>
              </div>
            </div>

            <div className="z-10 mt-12 grid grid-cols-2 gap-6">
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <Icon name="verified" className="mb-3 h-6 w-6 text-[#6ffbbe]" />
                <h3 className="mb-1 font-semibold text-white">GST Ready</h3>
                <p className="text-sm text-[#dad7ff]">Automated tax calculations and compliance.</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                <Icon name="speed" className="mb-3 h-6 w-6 text-[#6ffbbe]" />
                <h3 className="mb-1 font-semibold text-white">Fast Checkout</h3>
                <p className="text-sm text-[#dad7ff]">Create and send invoices via WhatsApp instantly.</p>
              </div>
            </div>

            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
          </section>

          <section className="flex w-full items-center justify-center bg-[#f9f9ff] px-4 py-6 sm:px-6 md:p-12 lg:w-1/2 lg:p-20">
            <div className="w-full max-w-xl">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-headline text-2xl font-extrabold text-[#151c27]">
                    Business Profile
                  </h2>
                  <p className="mt-1 text-sm text-[#464555]">
                    Tell us about your venture to customize your experience.
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#3525cd]">
                    Step 2 of 2
                  </span>
                  <div className="flex gap-1">
                    <div className="h-1 w-8 rounded-full bg-[#3525cd]" />
                    <div className="h-1 w-8 rounded-full bg-[#3525cd]" />
                  </div>
                </div>
              </div>

              <div className="kinetic-shadow rounded-xl border border-[#dce2f3]/30 bg-white p-5 sm:p-8">
                <form className="space-y-8" onSubmit={submitRegistration}>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#151c27]">
                      Business Type <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {businessTypes.map((type) => {
                        const active = business.businessType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                              active
                                ? "border-[#3525cd] bg-[#3525cd]/5 text-[#3525cd]"
                                : "border-[#c7c4d8]/30 bg-[#f0f3ff] text-[#464555] hover:border-[#3525cd]/50"
                            }`}
                            onClick={() => setBusiness({ ...business, businessType: type })}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InputShell label="Business Name *">
                      <input
                        className="w-full rounded-lg border border-[#c7c4d8]/20 bg-[#f0f3ff] px-4 py-3 outline-none transition-all placeholder:text-[#464555]/50 focus:border-transparent focus:ring-2 focus:ring-[#3525cd]"
                        placeholder="e.g. Acme Services"
                        value={business.businessName}
                        onChange={(event) =>
                          setBusiness({ ...business, businessName: event.target.value })
                        }
                        required
                      />
                    </InputShell>

                    <InputShell label="Category">
                      <select
                        className="w-full appearance-none rounded-lg border border-[#c7c4d8]/20 bg-[#f0f3ff] px-4 py-3 text-[#151c27] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3525cd]"
                        value={business.category}
                        onChange={(event) =>
                          setBusiness({ ...business, category: event.target.value })
                        }
                      >
                        <option value="">Select category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="grocery">Grocery</option>
                        <option value="digital">Digital Services</option>
                      </select>
                    </InputShell>
                  </div>

                  <InputShell label="Business Address">
                    <input
                      className="w-full rounded-lg border border-[#c7c4d8]/20 bg-[#f0f3ff] px-4 py-3 outline-none transition-all placeholder:text-[#464555]/50 focus:border-transparent focus:ring-2 focus:ring-[#3525cd]"
                      placeholder="Full operational address"
                      value={business.address}
                      onChange={(event) =>
                        setBusiness({ ...business, address: event.target.value })
                      }
                    />
                  </InputShell>

                  <InputShell
                    label="GST Number"
                    helper="Optional, required for generating valid tax invoices."
                  >
                    <input
                      className="w-full rounded-lg border border-[#c7c4d8]/20 bg-[#f0f3ff] px-4 py-3 outline-none transition-all placeholder:text-[#464555]/50 focus:border-transparent focus:ring-2 focus:ring-[#3525cd]"
                      placeholder="22AAAAA0000A1Z5"
                      value={business.gst}
                      onChange={(event) => setBusiness({ ...business, gst: event.target.value })}
                    />
                  </InputShell>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#151c27]">Business Logo</label>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c7c4d8]/50 bg-[#e7eefe] text-[#464555] transition-colors hover:border-[#3525cd] hover:text-[#3525cd]">
                        <Icon name="upload" className="h-7 w-7" />
                        <span className="mt-1 text-[10px] font-semibold">UPLOAD</span>
                        <input
                          className="hidden"
                          type="file"
                          accept=".png,.jpg,.jpeg,.svg"
                          onChange={(event) =>
                            setBusiness({
                              ...business,
                              logoName: event.target.files?.[0]?.name ?? ""
                            })
                          }
                        />
                      </label>
                      <div className="flex-1">
                        <p className="text-xs text-[#464555]">Recommended: PNG or SVG, max 2MB.</p>
                        <p className="mt-1 text-[10px] uppercase tracking-tight text-[#777587]">
                          {business.logoName || "Your logo appears on all PDF invoices."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {error ? <p className="text-sm text-[#ba1a1a]">{error}</p> : null}

                  <div className="pt-4">
                    <button
                      className="signature-gradient kinetic-shadow flex w-full items-center justify-center gap-2 rounded-lg py-4 font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                      <Icon name="arrowRight" className="h-5 w-5" />
                    </button>
                    <p className="mt-6 text-center text-xs text-[#464555]">
                      By creating an account, you agree to our{" "}
                      <a className="text-[#3525cd] hover:underline" href="#">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a className="text-[#3525cd] hover:underline" href="#">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </form>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-medium text-[#464555] transition-colors hover:text-[#3525cd]"
                  onClick={() => setStep(1)}
                >
                  <Icon name="arrowLeft" className="h-4 w-4" />
                  Back
                </button>
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-sm font-medium text-[#464555] transition-colors hover:text-[#3525cd]"
                >
                  <Icon name="help" className="h-4 w-4" />
                  Need Help?
                </Link>
              </div>
            </div>
          </section>
        </main>
      )}

      <footer className="flex w-full flex-col items-center justify-center gap-6 border-t border-[#f0f3ff] bg-[#f9f9ff] px-6 py-8 md:flex-row">
        <div className="flex gap-6">
          <a className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-500" href="#">
            Privacy Policy
          </a>
          <a className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-500" href="#">
            Terms of Service
          </a>
          <a className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-500" href="#">
            Help Center
          </a>
        </div>
        <p className="text-xs text-slate-500">© 2024 BillSathi Fintech. All rights reserved.</p>
      </footer>
    </>
  );
}
