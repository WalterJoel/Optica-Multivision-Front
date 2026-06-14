"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useNotify } from "@/providers/NotifyProvider";
import { LogoMultivision } from "@/components/Common/LogoMultivision";

const LoginForm = () => {
  const router = useRouter();
  const { error } = useNotify();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      error(result.error);
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex w-full flex-col justify-center lg:w-1/2 px-8 sm:px-16 md:px-24 bg-beige relative min-h-screen">
      <div className="mx-auto w-full max-w-md relative">
        {/* Glow de fondo para profundidad premium */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-white rounded-full blur-[120px] opacity-60 pointer-events-none" />

        {/* LOGO CENTRADO Y ANCHO */}
        <LogoMultivision margin="mb-10" />

        {/* FORMULARIO */}
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-dark-2 uppercase tracking-[0.2em] ml-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-3 bg-white p-4.5 outline-none focus:border-blue focus:ring-4 focus:ring-blue/5 transition-all duration-300 placeholder:text-gray-4 text-dark shadow-sm"
              placeholder="correo@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-dark-2 uppercase tracking-[0.2em] ml-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-3 bg-white p-4.5 outline-none focus:border-blue focus:ring-4 focus:ring-blue/5 transition-all duration-300 placeholder:text-gray-4 text-dark shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-2xl py-5 font-black text-dark uppercase tracking-[0.2em] text-[13px] transition-all transform active:scale-[0.97] shadow-xl ${
                loading
                  ? "bg-gray-4 cursor-not-allowed"
                  : "bg-yellow-dark hover:bg-yellow hover:shadow-yellow/20 shadow-yellow-dark/10"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
