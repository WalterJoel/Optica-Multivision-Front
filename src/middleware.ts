import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    console.log("✅ MIDDLEWARE HIT:", request.nextUrl.pathname);
  }

  const token = request.cookies.get("access_token")?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/signup");

  // No logueado → mandar a login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Logueado → evitar volver al login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
