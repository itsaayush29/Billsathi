import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "../../components/auth-form";
import { Icon } from "../../components/icon";
import { getSessionUser } from "../../lib/api";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
  }

  return (
    <>
      <main className="flex min-h-screen flex-col md:flex-row">
        <div className="signature-gradient relative hidden overflow-hidden p-12 md:flex md:w-1/2 md:flex-col md:justify-between lg:p-20">
          <div className="absolute -mr-20 -mt-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -mb-10 -ml-10 bottom-0 left-0 h-64 w-64 rounded-full bg-[#6cf8bb]/20 blur-3xl" />

          <div className="z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg">
                <Icon name="wallet" className="h-6 w-6 text-[#3525cd]" />
              </div>
              <span className="font-headline text-2xl font-extrabold tracking-tight text-white">
                BillSathi
              </span>
            </div>
          </div>

          <div className="z-10 space-y-6">
            <h1 className="font-headline text-5xl font-extrabold leading-tight text-white lg:text-7xl">
              Create GST invoices in 30 seconds
            </h1>
            <p className="max-w-md text-xl leading-relaxed text-white/80">
              Experience the Kinetic Sanctuary of modern accounting. Simple, lightning-fast, and beautiful.
            </p>
            <div className="flex flex-wrap gap-4 pt-8">
              <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6cf8bb]">
                  <Icon name="bolt" className="h-5 w-5 text-[#00714d]" />
                </div>
                <div>
                  <p className="font-bold text-white">Fast Execution</p>
                  <p className="text-sm text-white/60">Real-time GST calculations</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Icon name="security" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Bank-Grade</p>
                  <p className="text-sm text-white/60">Secure data encryption</p>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10">
            <p className="text-sm text-white/60">© 2024 BillSathi Financial. All rights reserved.</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[#f9f9ff] p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center justify-between md:hidden">
              <div className="flex items-center gap-2">
                <Icon name="wallet" className="h-8 w-8 text-[#3525cd]" />
                <span className="font-headline text-2xl font-extrabold tracking-tight text-[#151c27]">
                  BillSathi
                </span>
              </div>
              <Link
                href="/"
                className="rounded-full border border-slate-300/60 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur"
              >
                Home
              </Link>
            </div>

            <div className="mb-6 hidden md:block">
              <Link
                href="/"
                className="inline-flex rounded-full border border-slate-300/60 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur"
              >
                Back to home
              </Link>
            </div>

            <AuthForm mode="login" />
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 hidden max-w-xs items-center gap-4 rounded-xl border border-[#c7c4d8]/20 bg-white p-4 shadow-xl lg:flex">
        <div className="relative">
          <img
            alt="Customer"
            className="h-12 w-12 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7FhkiLAS2EYqsIN-56BpHUX7SX8cI48Zo9Pa_0xD4BY9axaRtxzAsZehUXAHNPlBO5BN9KyoSYEbcdfmI_S_aZi9ed4G2q9EU2UmAjbX1aVbazw0cAmmAAegX2sLmhQvnilwVFA40GGpjnDvK_p4L7fdk_qBC4n3Fp6QZTg_YH4VZpaz6daYPLFe6C1baHrdo1Vuppnu5ctCbht5_FNxZB-64u97jrk5F6G9xroQa9E5wXI_iu-zGmnNx1uXN5X8wgtkqtNScjjci"
          />
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#006c49]">
            <Icon name="checkCircle" className="h-3 w-3 text-white" />
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-[#151c27]">Verified Business Owner</p>
          <p className="text-[10px] text-[#464555]">
            &quot;BillSathi saved us 4 hours a week on GST filings. Truly a sanctuary for CFOs.&quot;
          </p>
        </div>
      </div>
    </>
  );
}
