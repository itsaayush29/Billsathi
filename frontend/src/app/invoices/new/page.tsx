import { InvoiceBuilder } from "../../../components/invoice-builder";
import { apiGet, requireUser } from "../../../lib/api";

type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
};

type PagedData<T> = {
  items: T[];
  total: number;
};

export default async function NewInvoicePage() {
  const user = await requireUser();
  const customers = await apiGet<PagedData<Customer>>("/customers?page=1&pageSize=50");

  return <InvoiceBuilder customers={customers.data.items} plan={user.plan} />;
}
