const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/backend-api";

export async function clientRequest<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
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

    throw new Error(
      "Unable to reach the backend. Start the API server on port 5000 and try again."
    );
  }
}
