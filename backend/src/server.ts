import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const host = "0.0.0.0"; // REQUIRED on Railway - 'localhost' fails health checks

const server = app.listen(env.PORT, host, () => {
  console.log(`BillSathi API listening on ${host}:${env.PORT} (${env.NODE_ENV})`);
  console.log(`Allowed origins: ${env.FRONTEND_URL.join(", ")}`);
});

// FIX 8: Graceful shutdown for Railway rolling restarts.
// Railway sends SIGTERM when stopping a deployment. Without this handler
// the process dies immediately, dropping in-flight requests mid-response.
const shutdown = (signal: string) => {
  console.log(`[${signal}] Gracefully shutting down...`);
  server.close(() => {
    console.log("All connections drained. Exiting.");
    process.exit(0);
  });
  // Force-exit if connections don't drain within 10 seconds
  setTimeout(() => {
    console.error("Graceful shutdown timed out — forcing exit");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// FIX 9: Catch unhandled rejections so they appear in Railway logs instead
// of silently corrupting server state.
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
  process.exit(1); // Always exit on uncaught exceptions - state is undefined
});
