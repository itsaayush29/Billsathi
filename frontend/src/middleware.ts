import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/invoices", "/customers", "/settings", "/subscription"];
const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has("billsathi_session");
  const { pathname } = request.nextUrl;

  const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route));
  const requiresAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if ((requiresAuth || requiresAdmin) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/invoices/:path*", "/customers/:path*", "/settings/:path*", "/subscription/:path*", "/admin/:path*"]
};
