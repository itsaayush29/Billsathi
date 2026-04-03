// FIX 10: In production, NEXT_PUBLIC_API_URL is NOT set (Vercel doesn't know
// your Railway URL at build time unless you add it as an env var).
// The app correctly falls back to "/backend-api" which next.config.ts rewrites
// to your Railway backend. This means in production all API calls go through
// Vercel's edge rewrite — no CORS at all because origin and destination are
// both billsathi.vercel.app from the browser's perspective.
//
// For this to work you MUST set in Vercel dashboard > Environment Variables:
//   BACKEND_API_URL = https://billsathi-backend-production.up.railway.app/api
//
// NEXT_PUBLIC_API_URL should NOT be set in Vercel — the default "/backend-api"
// rewrite is correct and is what makes CORS irrelevant for browser requests.
//
// We also force "/backend-api" for production browser requests so login keeps
// the session cookie on the Vercel domain even if NEXT_PUBLIC_API_URL is set.
function getApiUrl() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    return "/backend-api";
  }

  return process.env.NEXT_PUBLIC_API_URL ?? "/backend-api";
}

export async function clientRequest<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      // credentials:"include" is needed if you ever call the Railway backend
      // directly from the browser. With the Vercel rewrite in place it's
      // harmless (same-origin requests ignore it) but keeps dev mode working.
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(body?.message ?? "Request failed");
    }

    return body as T;
  } catch (error) {
    if (error instanceof Error && error.message !== "Failed to fetch") {
      throw error;
    }

    // FIX 11: Replaced hardcoded "port 5000" message with a production-safe one
    throw new Error(
      "Unable to reach the backend. Please check your connection and try again."
    );
  }
}
