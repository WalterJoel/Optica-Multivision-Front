import { useSession } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  const user = session?.user;

  return {
    // estado
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",

    // datos del usuario
    id: user?.id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    sedeId: user?.sedeId,
    accessToken: session?.accessToken,

    // objeto user completo
    user,
    session,
  };
};
