import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Roles } from "@/commons/constants";
import { PERMISOS_RUTAS, tienePermiso } from "@/commons/permissions";

/*
 * Rutas Públicas
 * PARA TODOS LOS ROLES
 */
const PUBLIC_ROUTES = ["/", "/signin"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const userRole = token?.role as Roles | undefined;

    // ✅ siempre permitir públicas
    if (PUBLIC_ROUTES.includes(path)) {
      return NextResponse.next();
    }

    // ❌ sin login → signin
    if (!token || !userRole) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Buscar los roles permitidos para la ruta actual
    const routeEntry = Object.entries(PERMISOS_RUTAS).find(([route]) =>
      path === route || (route !== "/" && path.startsWith(route))
    );

    // Si la ruta está registrada en PERMISOS_RUTAS, evaluar permiso
    const hasAccess = routeEntry
      ? tienePermiso(routeEntry[1], userRole)
      : true;

    // ❌ sin acceso → redirect a /products
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/products", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // pública siempre accesible
        if (PUBLIC_ROUTES.includes(path)) return true;

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
