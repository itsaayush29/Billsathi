import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, "");
}

export function createApp() {
  const app = express();
  const allowedOrigins = env.FRONTEND_URL.split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server calls and tools that omit the Origin header.
        if (!origin) {
          callback(null, true);
          return;
        }

        if (allowedOrigins.includes(normalizeOrigin(origin))) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    "/api/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: env.NODE_ENV === "production" ? 20 : 200,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
