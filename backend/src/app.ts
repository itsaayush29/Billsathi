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
  return origin.trim().replace(/^['\"]|['\"]$/g, "").replace(/\/$/, "");
}

export function createApp() {
  const app = express();

  const allowedOrigins = env.FRONTEND_URL
    .map(normalizeOrigin)
    .filter(Boolean);

  const corsMiddleware = cors({
    origin(origin, callback) {
      // Allow server-to-server calls and tools that omit the Origin header
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = normalizeOrigin(origin);

      // Exact match (production + localhost)
      if (allowedOrigins.includes(normalized)) {
        callback(null, true);
        return;
      }

      // FIX 4: Also allow any Vercel preview deployment for this project.
      // Without this, every preview deploy (git branch) gets CORS-blocked.
      if (/^https:\/\/billsathi[a-z0-9-]*\.vercel\.app$/.test(normalized)) {
        callback(null, true);
        return;
      }

      console.warn("[CORS] Blocked origin:", origin);
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
    maxAge: 86400
  });

  // FIX 5: trust proxy MUST come before corsMiddleware so req.ip is the real
  // client IP, not Railway's internal proxy IP (which would cause all users to
  // share one rate-limit bucket and hit the cap immediately).
  app.set("trust proxy", 1);

  // FIX 6: CORS and OPTIONS preflight MUST be first — before helmet and every
  // other middleware. If helmet runs first it can strip headers the browser
  // needs from the preflight response, causing CORS failures.
  app.use(corsMiddleware);
  app.options(/.*/, corsMiddleware);

  // FIX 7: Helmet crossOriginResourcePolicy was at default "same-origin" which
  // blocks the frontend from loading any resource (images, fonts, JSON) served
  // from a different origin. Set to "cross-origin" for a cross-domain setup.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      // Don't set a rigid CSP here — Next.js injects its own nonces and the
      // default helmet CSP will break the frontend silently in production.
      contentSecurityPolicy: false
    })
  );

  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.use(
    "/api/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: env.NODE_ENV === "production" ? 20 : 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many attempts from this IP. Please try again after 15 minutes."
      }
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check — Railway pings this to verify the deployment is alive.
  // Set "Health Check Path" to /health in Railway > your service > Settings.
  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: "ok",
        timestamp: new Date().toISOString()
      }
    });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
