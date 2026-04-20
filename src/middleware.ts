import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

type Role = "ADMIN" | "VENDEDOR" | "ALMACEN";

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "/products",
    "/dashboard",
    "/admin",
    "/profile",
    "/checkout",
    "/matrix",
    "/shop-products",
    "/lentes",
    "/cart",
    "/register-sale",
    "/sell-products",
  ],
  VENDEDOR: ["/products", "/dashboard", "/profile"],
  ALMACEN: ["/products", "/profile"],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const userRole = token?.role as Role | undefined;

    // ✅ SIEMPRE permitir signin
    if (path === "/signin") {
      return NextResponse.next();
    }

    // ❌ si no hay token → solo aquí redirigimos
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // 🔐 proteger rol solo si existe token
    if (!userRole) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const allowedPages = ROLE_PERMISSIONS[userRole] || [];
    const hasAccess = allowedPages.some((page) => path.startsWith(page));

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/products", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        //  IMPORTANTE: signin siempre libre
        if (req.nextUrl.pathname === "/signin") return true;

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
//comentario ofrzado
