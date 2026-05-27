//TODO: REFACTORIZAR CODE LLEVAR A CONSTANTS
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

type Role = "ADMIN" | "VENDEDOR" | "ALMACEN" | "TALLER";

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "/products",
    "/my-account",
    "/admin",
    "/profile",
    "/checkout",
    "/matrix",
    "/vender",
    "/lentes",
    "/cart",
    "/register-sale",
    "/sell-products",
    "/seguimiento-pedidos",
    "/caja",
    "/inventarios/accesorios",
    "/inventarios/excel",
  ],
  VENDEDOR: ["/products", "/dashboard", "/profile"],
  ALMACEN: ["/products", "/profile"],
  TALLER: ["/products"],
};

/*
 * Rutas Publicas
 * PARA TODOS LOS ROLES
 */
const PUBLIC_ROUTES = ["/", "/signin"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const userRole = token?.role as Role | undefined;

    // ✅ siempre permitir públicas
    if (PUBLIC_ROUTES.includes(path)) {
      return NextResponse.next();
    }

    // ❌ sin login → signin
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // ❌ sin role → bloquear
    if (!userRole) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const allowedPages = ROLE_PERMISSIONS[userRole] || [];
    const hasAccess = allowedPages.some((page) => path.startsWith(page));

    // ❌ sin acceso → redirect inteligente por rol
    if (!hasAccess) {
      const fallbackByRole: Record<Role, string> = {
        ADMIN: "/products",
        VENDEDOR: "/products",
        ALMACEN: "/products",
        TALLER: "/products",
      };

      return NextResponse.redirect(new URL(fallbackByRole[userRole], req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // pública siempre accesible
        if (path === "/" || path === "/signin") return true;

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
