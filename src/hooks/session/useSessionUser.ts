"use client";

import { useSession } from "next-auth/react";

export const useSessionUser = () => {
  const { data: session, status, update } = useSession();

  const user = session?.user;
  const nombre = user?.name?.split(" ")[0] ?? "";
  const apellido = user?.name?.split(" ")[1] ?? "";

  const fullName = user?.name ?? `${nombre} ${apellido}`.trim();

  const foto =
    nombre && apellido
      ? `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
      : "";

  const updateSessionSede = async (newSedeId: number, newSedeNombre?: string) => {
    await update({ sedeId: newSedeId, sedeNombre: newSedeNombre });
  };

  return {
    // estados
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",

    // datos base (NextAuth session)
    userId: user?.id as number | undefined,
    email: user?.email ?? undefined,
    name: user?.name ?? undefined,

    // custom fields del JWT
    role: (user as any)?.role as string | undefined,
    sedeId: (user as any)?.sedeId as number | undefined,
    sedeNombre: (user as any)?.sedeNombre as string | undefined,

    // token
    accessToken: (session as any)?.accessToken as string | undefined,

    // UI helpers
    fullName,
    foto,

    // acciones de sesion en caliente
    updateSession: update,
    updateSessionSede,

    // raw
    user,
    session,
  };
};
