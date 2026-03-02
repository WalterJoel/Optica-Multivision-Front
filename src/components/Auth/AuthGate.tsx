"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/services/api";

const AUTH_PAGES = ["/signin", "/signup"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const token = localStorage.getItem("token");
      const isAuthPage = AUTH_PAGES.includes(pathname);

      // 1) Si está en signin/signup:
      // - sin token => ok mostrar
      // - con token => validar y mandar a /products
      if (isAuthPage) {
        if (!token) {
          if (!cancelled) setReady(true);
          return;
        }

        try {
          const { data } = await api.get("/auth/me"); // requiere Bearer, tu interceptor lo pone
          localStorage.setItem("user", JSON.stringify(data.user));
          if (!cancelled) router.replace("/products");
        } catch {
          // si falla, el interceptor puede limpiar y redirigir, pero por si acaso:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (!cancelled) setReady(true);
        }
        return;
      }

      // 2) Rutas privadas:
      if (!token) {
        router.replace("/signin");
        return;
      }

      // 3) Validar token con backend
      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem("user", JSON.stringify(data.user));
        if (!cancelled) setReady(true);
      } catch {
        // si token inválido => api interceptor hará logout y redirect
        if (!cancelled) setReady(false);
      }
    };

    check();

    // Reaccionar a cambios de auth (logout automático interceptor / login)
    const onAuthChanged = () => {
      setReady(false);
      check();
    };

    window.addEventListener("auth-changed", onAuthChanged);
    window.addEventListener("storage", onAuthChanged);

    return () => {
      cancelled = true;
      window.removeEventListener("auth-changed", onAuthChanged);
      window.removeEventListener("storage", onAuthChanged);
    };
  }, [pathname, router]);

  if (!ready) return null; // aquí pon tu PreLoader/LoadingModal si quieres
  return <>{children}</>;
}