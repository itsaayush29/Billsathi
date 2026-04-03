import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101827",
        cloud: "#eef2ff",
        sand: "#f7f1e8",
        mint: "#d8f5e6",
        ember: "#ff7448"
      },
      fontFamily: {
        body: ["var(--font-body)"],
        headline: ["var(--font-headline)"]
      }
    }
  },
  plugins: []
} satisfies Config;
