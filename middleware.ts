import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const isPublicRoute = request.nextUrl.pathname === "/signin";

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
