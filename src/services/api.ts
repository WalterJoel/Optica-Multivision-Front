import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: false,
});
// ✅ Enviar token en cada request
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();

    const token = session?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ✅ Si el token muere => logout automático
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      await signOut({
        callbackUrl: "/signin",
      });
    }

    return Promise.reject(error);
  },
);
