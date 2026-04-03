import { Shell } from "../../components/shell";
import { apiGet, requireUser } from "../../lib/api";

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

type PagedData<T> = {
  items: T[];
  total: number;
};

export default async function CustomersPage() {
  const user = await requireUser();
  const customers = await apiGet<PagedData<Customer>>("/customers?page=1&pageSize=20");

  return (
    <Shell
      title="Customers"
      user={user}
      navigation={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/customers", label: "Customers" },
        { href: "/invoices", label: "Invoices" },
        { href: "/settings", label: "Settings" }
      ]}
    >
      <section className="rounded-[2rem] bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Customers</h2>
          <span className="rounded-full bg-mint px-4 py-2 text-sm font-medium">
            {customers.data.total} total
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {customers.data.items.map((customer) => (
            <article key={customer.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="text-lg font-semibold">{customer.name}</p>
              <p className="text-sm text-slate-500">{customer.email ?? "No email"}</p>
              <p className="text-sm text-slate-500">{customer.phone ?? "No phone"}</p>
            </article>
          ))}
          {customers.data.items.length === 0 ? (
            <p className="text-slate-500">No customers yet.</p>
          ) : null}
        </div>
      </section>
    </Shell>
  );
}
