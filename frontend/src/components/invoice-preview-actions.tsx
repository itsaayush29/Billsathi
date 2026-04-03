"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientRequest } from "../lib/client-api";
import type { UserPlan } from "../lib/types";
import { Icon } from "./icon";

export function InvoicePreviewActions({
  invoiceId,
  plan
}: {
  invoiceId: string;
  plan: UserPlan;
}) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<"pdf" | "whatsapp" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handlePdf() {
    setLoadingAction("pdf");
    setMessage("");
    setError("");

    try {
      if (plan !== "PRO") {
        throw new Error("PDF downloads are available on the Pro plan only.");
      }

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
      router.refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to download PDF");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleWhatsapp() {
    setLoadingAction("whatsapp");
    setMessage("");
    setError("");

    try {
      if (plan !== "PRO") {
        throw new Error("WhatsApp sending is available on the Pro plan only.");
      }

      await clientRequest(`/invoices/${invoiceId}/send-whatsapp`, {
        method: "POST"
      });
      setMessage("Invoice sent via WhatsApp.");
      router.refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to send invoice");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePdf}
        disabled={loadingAction !== null}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#c7c4d8]/20 bg-white px-6 py-2.5 font-semibold text-[#3525cd] transition-all hover:bg-[#f0f3ff] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:flex-none"
      >
        <Icon name="pdf" className="h-5 w-5" />
        {loadingAction === "pdf" ? "Preparing..." : "PDF"}
      </button>
      <button
        type="button"
        onClick={handleWhatsapp}
        disabled={loadingAction !== null}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#006c49]/20 transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:flex-none"
      >
        <Icon name="share" className="h-5 w-5" />
        {loadingAction === "whatsapp" ? "Sending..." : "WhatsApp"}
      </button>
      {message ? <p className="w-full text-sm font-medium text-[#00714d]">{message}</p> : null}
      {error ? <p className="w-full text-sm font-medium text-[#93000a]">{error}</p> : null}
    </>
  );
}
