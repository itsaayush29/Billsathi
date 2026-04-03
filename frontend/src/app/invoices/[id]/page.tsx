import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "../../../components/icon";
import { InvoicePreviewActions } from "../../../components/invoice-preview-actions";
import { apiGet, requireUser } from "../../../lib/api";

type InvoiceItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type InvoiceDetail = {
  id: string;
  amount: number;
  status: "DRAFT" | "SENT" | "PAID" | "CANCELLED";
  invoiceDate: string;
  items: InvoiceItem[];
  customer?: {
    name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
  user?: {
    id: string;
    name: string;
  } | null;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatStatus(status: InvoiceDetail["status"]) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        chip: "bg-[#6cf8bb]/20 text-[#00714d]",
        dot: "bg-[#006c49]"
      };
    case "SENT":
      return {
        label: "Pending",
        chip: "bg-[#d8e2ff]/40 text-[#004395]",
        dot: "bg-[#004598]"
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        chip: "bg-[#ffdad6]/30 text-[#ba1a1a]",
        dot: "bg-[#ba1a1a]"
      };
    default:
      return {
        label: "Draft",
        chip: "bg-[#e2dfff] text-[#3323cc]",
        dot: "bg-[#3525cd]"
      };
  }
}

export default async function InvoicePreviewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  let invoice: InvoiceDetail;
  try {
    const response = await apiGet<InvoiceDetail>(`/invoices/${id}`);
    invoice = response.data;
  } catch {
    notFound();
  }

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const gst = subtotal * 0.18;
  const status = formatStatus(invoice.status);
  const customerName = invoice.customer?.name ?? "Walk-in Customer";
  const businessName = invoice.user?.name ?? user.name;
  const invoiceNumber = `INV-${invoice.id.slice(-8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-body text-[#151c27]">
      <header className="fixed top-0 z-50 w-full bg-white/80 shadow-[0_4px_20px_rgba(79,70,229,0.05)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/invoices" className="p-2 text-[#464555] md:hidden">
              <Icon name="arrowLeft" className="h-5 w-5" />
            </Link>
            <span className="font-headline text-xl font-bold text-indigo-600">BillSathi</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link className="font-medium text-slate-500 transition-colors hover:text-indigo-600" href="/dashboard">
              Dashboard
            </Link>
            <Link className="border-b-2 border-indigo-600 font-semibold text-indigo-600 transition-colors" href="/invoices">
              Invoices
            </Link>
            <Link className="font-medium text-slate-500 transition-colors hover:text-indigo-600" href="/customers">
              Customers
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100">
              <Icon name="bell" className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#e7eefe] text-xs font-bold text-indigo-600">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-32 pt-24 md:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-headline text-2xl font-bold text-[#151c27]">
              Invoice #{invoiceNumber}
            </h1>
            <p className="text-sm text-[#464555]">
              Issued on{" "}
              {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
            <InvoicePreviewActions invoiceId={invoice.id} plan={user.plan} />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#c7c4d8]/10 bg-white shadow-[0_10px_40px_rgba(79,70,229,0.08)]">
          <div className="p-8 md:p-12">
            <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="signature-gradient flex h-12 w-12 items-center justify-center rounded-xl text-white">
                  <Icon name="receipt" className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-black tracking-tight text-[#3525cd]">
                    BillSathi
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#464555]">
                    Premium GST Invoicing
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 ${status.chip}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">{status.label}</span>
                </div>
                <p className="text-sm font-medium text-[#464555]">GSTIN: 27AABCU1234F1Z5</p>
              </div>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#464555]">From</p>
                <h3 className="mb-1 font-headline font-bold text-[#151c27]">{businessName}</h3>
                <p className="text-sm leading-relaxed text-[#464555]">
                  1202, Quantum Towers, Malad West
                  <br />
                  Mumbai, Maharashtra 400064
                  <br />
                  contact@billsathi.com
                </p>
              </div>
              <div className="md:text-right">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#464555]">Bill To</p>
                <h3 className="mb-1 font-headline font-bold text-[#151c27]">{customerName}</h3>
                <p className="text-sm leading-relaxed text-[#464555]">
                  {invoice.customer?.email ?? "Email not provided"}
                  <br />
                  {invoice.customer?.phone ? `Phone: ${invoice.customer.phone}` : "Phone not provided"}
                </p>
              </div>
            </div>

            <div className="mb-12 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e2e8f8]">
                    <th className="py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                      Description
                    </th>
                    <th className="py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                      Qty
                    </th>
                    <th className="py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                      Price
                    </th>
                    <th className="py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7eefe]/50">
                  {invoice.items.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td className="py-6">
                        <p className="font-semibold text-[#151c27]">{item.name}</p>
                        <p className="text-xs text-[#464555]">BillSathi invoice line item</p>
                      </td>
                      <td className="py-6 text-right text-[#464555]">
                        {String(item.quantity).padStart(2, "0")}
                      </td>
                      <td className="py-6 text-right text-[#464555]">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-6 text-right font-bold text-[#151c27]">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
              <div className="w-full md:w-1/2">
                <div className="rounded-xl bg-[#f0f3ff] p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                    Payment Notes
                  </p>
                  <p className="text-xs leading-normal text-[#464555]">
                    All payments are non-refundable. Please quote the invoice number while making bank transfers. For GST credit, ensure your GSTIN is correctly mapped in your profile.
                  </p>
                </div>
              </div>
              <div className="w-full space-y-3 md:w-1/3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#464555]">Subtotal</span>
                  <span className="font-semibold text-[#151c27]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#464555]">GST (18%)</span>
                  <span className="font-semibold text-[#151c27]">{formatCurrency(gst)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#e2e8f8] pt-3">
                  <span className="font-headline font-bold text-[#151c27]">Grand Total</span>
                  <span className="font-headline text-xl font-extrabold text-[#3525cd]">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-20 border-t border-[#e2e8f8] pt-8 text-center">
              <p className="text-xs text-[#464555]">
                This is a computer generated invoice and does not require a physical signature.
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#3525cd]">
                Generated via BillSathi.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl bg-[#f0f3ff] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3525cd]/10 text-[#3525cd]">
              <Icon name="mail" className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Resend Email</h4>
              <p className="text-xs text-[#464555]">Sent 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-[#f0f3ff] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006c49]/10 text-[#006c49]">
              <Icon name="history" className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Payment History</h4>
              <p className="text-xs text-[#464555]">Last paid via UPI</p>
            </div>
          </div>
          <Link href="/invoices/new" className="flex items-center gap-4 rounded-xl bg-[#f0f3ff] p-6 transition-colors hover:bg-[#e7eefe]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#464555]/10 text-[#464555]">
              <Icon name="edit" className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Edit Invoice</h4>
              <p className="text-xs text-[#464555]">Add new items</p>
            </div>
          </Link>
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
        <Link href="/invoices/new" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="addCircle" className="h-7 w-7" />
          <span className="text-[10px] font-medium">Create</span>
        </Link>
        <Link href="/customers" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="users" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Customers</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="settings" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
