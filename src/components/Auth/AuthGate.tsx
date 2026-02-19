"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthPage = pathname === "/signin" || pathname === "/signup";

    // No logueado => TODO al login (excepto signin/signup)
    if (!token && !isAuthPage) {
      router.replace("/signin");
      return;
    }

    // Logueado => no permitir volver a signin/signup
    if (token && isAuthPage) {
      router.replace("/products"); // o "/"
      return;
    }

    setReady(true);
  }, [router, pathname]);

  if (!ready) return null; // evita que se vea contenido sin auth
  return <>{children}</>;
}
