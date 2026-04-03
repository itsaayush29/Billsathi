export function auditLog(event: string, metadata: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "test") {
    console.info(`[audit] ${event}`, metadata);
  }
}
