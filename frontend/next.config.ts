import type { NextConfig } from "next";

// FIX 12: In production (Vercel), BACKEND_API_URL must be set in the Vercel
// dashboard so the rewrite can forward /backend-api/* to Railway.
// Without this, the rewrite destination stays as localhost:5000 which fails.
//
// Vercel dashboard > your project > Settings > Environment Variables:
//   BACKEND_API_URL = https://billsathi-backend-production.up.railway.app/api
//
// This rewrite means browser requests to /backend-api/auth/login are
// transparently forwarded to Railway by Vercel's edge — no CORS needed.
const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:5000/api";

if (process.env.NODE_ENV === "production" && backendApiUrl.includes("localhost")) {
  console.warn(
    "\n WARNING: BACKEND_API_URL is still pointing to localhost in production!\n" +
    "   Set BACKEND_API_URL in Vercel > your project > Settings > Environment Variables\n" +
    "   to https://billsathi-backend-production.up.railway.app/api\n"
  );
}

const nextConfig: NextConfig = {
  typedRoutes: true,

  async rewrites() {
    return [
      {
        // All browser requests to /backend-api/* get forwarded to Railway
        source: "/backend-api/:path*",
        destination: `${backendApiUrl}/:path*`
      }
    ];
  },

  // FIX 13: Allow the Railway backend domain so Next.js Image Optimization
  // doesn't block images that may eventually come from the API.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "billsathi-backend-production.up.railway.app"
      }
    ]
  }
};

export default nextConfig;
