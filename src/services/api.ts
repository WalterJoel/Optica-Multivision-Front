import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  // token-only => no cookies
  withCredentials: false,
});

// ✅ Enviar token en cada request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Si el token muere => logout automático
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (typeof window !== "undefined" && status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-changed"));
      // opcional: mandar al login
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  },
);