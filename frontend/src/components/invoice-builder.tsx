"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientRequest } from "../lib/client-api";
import { Icon } from "./icon";

type Customer = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
};

type InvoiceItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type InvoiceResult = {
  id: string;
};

export function InvoiceBuilder({
  customers,
  plan
}: {
  customers: Customer[];
  plan: "FREE" | "PRO";
}) {
  const router = useRouter();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), name: "Web Development Services", quantity: 1, unitPrice: 25000 },
    { id: crypto.randomUUID(), name: "UI/UX Design Kit", quantity: 1, unitPrice: 12000 }
  ]);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [loadingAction, setLoadingAction] = useState<"create" | "whatsapp" | "pdf" | null>(null);
  const [error, setError] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!customerName.trim()) {
      return customers.slice(0, 5);
    }

    const query = customerName.toLowerCase();
    return customers
      .filter((customer) => customer.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [customerName, customers]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items]
  );
  const gst = subtotal * 0.18;
  const finalAmount = subtotal + gst;

  function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, "");
    return digits.startsWith("91") && digits.length > 10 ? digits.slice(2, 12) : digits.slice(-10);
  }

  function normalizeDecimal(value: string) {
    const sanitized = value.replace(/[^\d.]/g, "");
    const [whole = "", ...fractionParts] = sanitized.split(".");
    const fraction = fractionParts.join("");
    return fraction ? `${whole}.${fraction.slice(0, 2)}` : whole;
  }

  function selectCustomer(customer: Customer) {
    setSelectedCustomerId(customer.id);
    setCustomerName(customer.name);
    setPhone(normalizePhone(customer.phone ?? ""));
  }

  function updateItem(id: string, field: keyof Omit<InvoiceItem, "id">, value: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "name"
                  ? value
                  : Number(value) >= 0
                    ? Number(value)
                    : 0
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        unitPrice: 0
      }
    ]);
    setActiveStep(2);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function createInvoice(status: "DRAFT" | "SENT" = "DRAFT") {
    if (!customerName.trim()) {
      throw new Error("Please enter or select a customer.");
    }

    const validItems = items.filter((item) => item.name.trim() && item.quantity > 0);
    if (validItems.length === 0) {
      throw new Error("Add at least one invoice item before continuing.");
    }

    const response = await clientRequest<{ data: InvoiceResult }>("/invoices", {
      method: "POST",
      body: JSON.stringify({
        customerId: selectedCustomerId || undefined,
        customerName: customerName.trim(),
        phone: normalizePhone(phone),
        amount: finalAmount,
        status,
        invoiceDate: new Date().toISOString(),
        items: validItems
      })
    });

    return response.data.id;
  }

  async function handleCreate() {
    setLoadingAction("create");
    setError("");

    try {
      await createInvoice("DRAFT");
      router.push("/invoices");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to create invoice"
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleWhatsApp() {
    setLoadingAction("whatsapp");
    setError("");

    try {
      if (plan !== "PRO") {
        throw new Error("WhatsApp sending is available on the Pro plan only.");
      }

      const invoiceId = await createInvoice("SENT");
      await clientRequest(`/invoices/${invoiceId}/send-whatsapp`, {
        method: "POST"
      });
      router.push("/invoices");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to send invoice"
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handlePdf() {
    setLoadingAction("pdf");
    setError("");

    try {
      if (plan !== "PRO") {
        throw new Error("PDF downloads are available on the Pro plan only.");
      }

      const invoiceId = await createInvoice("SENT");
      const response = await clientRequest<{ data: { contentBase64: string; fileKey: string } }>(
        `/invoices/${invoiceId}/pdf`,
        {
          method: "POST"
        }
      );

      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${response.data.contentBase64}`;
      link.download = response.data.fileKey;
      link.click();

      router.push("/invoices");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "Unable to download PDF"
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] pb-24 text-[#151c27]">
      <nav className="glass-header fixed top-0 z-50 flex w-full items-center justify-between px-6 py-3 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-headline text-xl font-bold text-indigo-600">
            BillSathi
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
            <Icon name="bell" className="h-5 w-5 text-slate-500" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c7c4d8] bg-[#dce2f3] text-xs font-bold text-indigo-600">
            BS
          </div>
        </div>
      </nav>

      <main className="mx-auto mt-20 max-w-2xl px-4 md:px-8">
        <header className="mb-8">
          <h1 className="mb-6 font-headline text-2xl font-extrabold tracking-tight">
            Create Invoice
          </h1>
          <div className="flex items-center justify-between px-2">
            {[
              { step: 1 as const, label: "Customer", icon: "userCircle" as const },
              { step: 2 as const, label: "Items", icon: "box" as const },
              { step: 3 as const, label: "Preview", icon: "preview" as const }
            ].map((node, index) => (
              <div key={node.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                      activeStep === node.step
                        ? "step-active bg-[#3525cd] text-white"
                        : activeStep > node.step
                          ? "bg-[#4f46e5] text-white"
                          : "bg-[#dce2f3] text-[#464555]"
                    }`}
                  >
                    <Icon name={node.icon} className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-wider ${
                      activeStep === node.step ? "text-[#3525cd]" : "text-[#464555]"
                    }`}
                  >
                    {node.label}
                  </span>
                </div>
                {index < 2 ? <div className="mx-2 -mt-6 h-0.5 flex-1 bg-[#dce2f3]" /> : null}
              </div>
            ))}
          </div>
        </header>

        <section className="mb-8">
          <div className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.05)]">
            <div className="mb-6 flex items-center gap-2">
              <Icon name="userCircle" className="h-5 w-5 text-[#3525cd]" />
              <h2 className="font-headline text-lg font-bold">Customer details</h2>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <label className="mb-1.5 ml-1 block text-[11px] font-bold uppercase tracking-widest text-[#464555]">
                  Customer Name
                </label>
                <input
                  className="w-full rounded-lg border-0 bg-[#f0f3ff] px-4 py-3 text-[#151c27] transition-all duration-200 placeholder:text-[#c7c4d8] focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20"
                  placeholder="Start typing name..."
                  type="text"
                  value={customerName}
                  onFocus={() => setActiveStep(1)}
                  onChange={(event) => {
                    setSelectedCustomerId("");
                    setCustomerName(event.target.value);
                  }}
                />
                {filteredCustomers.length > 0 && customerName.trim() ? (
                  <div className="mt-2 overflow-hidden rounded-lg border border-[#dce2f3] bg-white">
                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[#f0f3ff]"
                        onClick={() => selectCustomer(customer)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6ffbbe] text-[10px] font-bold text-[#002113]">
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{customer.name}</p>
                          <p className="text-xs text-[#464555]">{customer.phone ?? "No phone"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 ml-1 block text-[11px] font-bold uppercase tracking-widest text-[#464555]">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-[#464555]">
                    +91
                  </span>
                  <input
                    className="w-full rounded-lg border-0 bg-[#f0f3ff] py-3 pl-14 pr-4 text-[#151c27] transition-all duration-200 placeholder:text-[#c7c4d8] focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20"
                    placeholder="Enter 10 digit number"
                    type="tel"
                    value={phone}
                    onFocus={() => setActiveStep(1)}
                    onChange={(event) => setPhone(normalizePhone(event.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Icon name="basket" className="h-5 w-5 text-[#3525cd]" />
              <h2 className="font-headline text-lg font-bold">Invoice items</h2>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-full bg-[#4f46e5] px-4 py-2 text-xs font-bold text-white transition-all active:scale-95"
              type="button"
              onClick={addItem}
            >
              <Icon name="plus" className="h-4 w-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) =>
              index === items.length - 1 ? (
                <div
                  key={item.id}
                  className="rounded-xl border-2 border-[#3525cd]/20 bg-white p-4 ring-4 ring-[#3525cd]/5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#3525cd]">
                        Item Name
                      </label>
                      <input
                        className="w-full rounded-lg border-0 bg-[#f0f3ff] px-3 py-2 text-sm font-semibold"
                        type="text"
                        value={item.name}
                        placeholder="Enter item name"
                        onFocus={() => setActiveStep(2)}
                        onChange={(event) => updateItem(item.id, "name", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                        Price
                      </label>
                      <input
                        className="w-full rounded-lg border-0 bg-[#f0f3ff] px-3 py-2 text-sm font-semibold"
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter price"
                        value={item.unitPrice === 0 ? "" : item.unitPrice}
                        onFocus={() => setActiveStep(2)}
                        onChange={(event) =>
                          updateItem(item.id, "unitPrice", normalizeDecimal(event.target.value))
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#464555]">
                        Quantity
                      </label>
                      <input
                        className="w-full rounded-lg border-0 bg-[#f0f3ff] px-3 py-2 text-sm font-semibold"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onFocus={() => setActiveStep(2)}
                        onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-xl border border-[#dce2f3]/30 bg-white p-4 shadow-[0_4px_20px_rgba(79,70,229,0.03)]"
                >
                  <div className="flex-1">
                    <p className="mb-1 font-bold text-[#151c27]">{item.name || "Untitled item"}</p>
                    <div className="flex items-center gap-4 text-xs text-[#464555]">
                      <span className="rounded bg-[#f0f3ff] px-2 py-0.5">Qty: {item.quantity}</span>
                      <span className="rounded bg-[#f0f3ff] px-2 py-0.5">
                        Rate: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.unitPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.quantity * item.unitPrice)}
                    </p>
                    <button
                      className="mt-2 text-[#ba1a1a]"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      <Icon name="trash" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section className="mb-8" onMouseEnter={() => setActiveStep(3)}>
          <div className="rounded-xl bg-[#e2e8f8] p-6">
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#464555]">Subtotal</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 2
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#464555]">GST (18%)</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 2
                  }).format(gst)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#dce2f3]/50 pt-4">
              <span className="font-headline text-lg font-extrabold uppercase tracking-tight">
                Final Amount
              </span>
              <span className="font-headline text-2xl font-black text-[#006c49]">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 2
                }).format(finalAmount)}
              </span>
            </div>
          </div>
        </section>

        {error ? <p className="mb-6 text-sm font-medium text-[#ba1a1a]">{error}</p> : null}

        <div className="mb-10 flex flex-col gap-3">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            onClick={handleWhatsApp}
            disabled={loadingAction !== null}
          >
            <Icon name="send" className="h-5 w-5" />
            {loadingAction === "whatsapp" ? "Sending..." : "Send via WhatsApp"}
          </button>
          <button
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#3525cd]/20 bg-white py-4 font-bold text-[#3525cd] transition-all active:scale-95"
            onClick={handlePdf}
            disabled={loadingAction !== null}
          >
            <Icon name="pdf" className="h-5 w-5" />
            {loadingAction === "pdf" ? "Preparing PDF..." : "Download PDF"}
          </button>
          <button
            className="w-full rounded-xl bg-[#3525cd] py-4 font-bold text-white transition-all active:scale-95"
            onClick={handleCreate}
            disabled={loadingAction !== null}
          >
            {loadingAction === "create" ? "Creating Invoice..." : "Save Draft"}
          </button>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-2xl bg-white px-2 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="home" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/invoices" className="flex flex-col items-center justify-center text-slate-400">
          <Icon name="receipt" className="h-5 w-5" />
          <span className="text-[10px] font-medium">Invoices</span>
        </Link>
        <Link href="/invoices/new" className="-mt-6 flex flex-col items-center justify-center text-indigo-600">
          <div className="flex rounded-full bg-[#3525cd] p-3 shadow-lg shadow-[#3525cd]/30 transition-transform duration-150 active:scale-90">
            <Icon name="addCircle" className="h-6 w-6 text-white" />
          </div>
          <span className="mt-1 text-[10px] font-medium">Create</span>
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
