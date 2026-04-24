"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useNotify } from "@/providers/NotifyProvider";

const LoginForm = () => {
  const router = useRouter();
  const { error } = useNotify();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        <div className="flex flex-col items-center mb-10 select-none group">
          {/* Isotipo: Barras más anchas (w-4) */}
          <div className="flex gap-2 items-end mb-4">
            <div className="w-4 h-14 bg-blue rounded-lg transition-all duration-500 group-hover:h-12 shadow-[0_4px_20px_rgba(var(--blue-rgb),0.4)]" />
            <div className="w-4 h-14 bg-yellow-dark rounded-lg transition-all duration-500 group-hover:h-8 shadow-[0_4px_20px_rgba(var(--yellow-rgb),0.4)]" />
          </div>

          {/* Logotipo: Tipografía grande*/}
          <div className="text-center">
            <h1 className="text-[42px] font-[1000] text-dark tracking-[-0.06em] uppercase leading-none ">
              Multivision
            </h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-[2px] w-12 bg-dark/10" />
              <span className="text-[12px] font-black text-dark-3 tracking-[0.6em] uppercase opacity-40">
                Ópticas
              </span>
              <div className="h-[2px] w-12 bg-dark/10" />
            </div>
          </div>
        </div>

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
              placeholder="nombre@empresa.com"
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
