import type { ReactNode } from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline"
});

export const metadata: Metadata = {
  title: "BillSathi",
  description: "Invoice management for modern teams"
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} font-body`}>{children}</body>
    </html>
  );
}
