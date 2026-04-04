import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterFlow } from "../../components/register-flow";
import { getSessionUser } from "../../lib/api";

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
  }

  return (
    <div>
      <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex rounded-full border border-slate-300/60 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur"
        >
          Back to home
        </Link>
      </div>
      <RegisterFlow />
    </div>
  );
}
