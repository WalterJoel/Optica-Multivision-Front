"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Signin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ cookie httpOnly
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/products");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center bg-[linear-gradient(135deg,#eef2ff,#f8fafc)] px-4 py-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_18px_45px_rgba(15,23,42,.12)] border border-[#e2e8f0] md:flex">
          {/* Imagen */}
          <div
            className="relative h-[200px] md:h-auto md:basis-[55%] bg-cover bg-center md:bg-right"
            style={{ backgroundImage: "url('/images/login/opticafondo.jpg')" }}>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,.25),rgba(56,189,248,.15))]" />
          </div>
          {/* Form */}
          <form onSubmit={handleLogin} className="flex-1 bg-white p-7 sm:p-10 md:p-[50px]">
            <div className="text-center">
              <h2 className="text-[34px] sm:text-[38px] font-extrabold tracking-[-0.5px] text-[#0f172a]">
                Bienvenido de nuevo
              </h2>
              <p className="mt-1 text-[16px] sm:text-[18px] font-medium text-[#64748b]">
                Inicia sesión con tu cuenta
              </p>
            </div>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6">
              <label className="block text-[15px] font-semibold text-[#0f172a] mb-1.5">
                Usuario
              </label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border border-[#e2e8f0] px-3.5 py-3 text-[15px] outline-none transition
                           placeholder:text-[#94a3b8]
                           focus:border-[#2563eb] focus:ring-4 focus:ring-[rgba(37,99,235,.15)]"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-[15px] font-semibold text-[#0f172a] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[10px] border border-[#e2e8f0] px-3.5 py-3 text-[15px] outline-none transition
                           placeholder:text-[#94a3b8]
                           focus:border-[#2563eb] focus:ring-4 focus:ring-[rgba(37,99,235,.15)]"
                required
              />
            </div>

            <div className="mt-3">
              <a href="#" className="text-[14px] font-semibold text-[#2563eb] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-[10px] bg-[#2563eb] py-3 text-[16px] font-bold text-white
                         shadow-[0_10px_20px_rgba(37,99,235,.25)]
                         hover:bg-[#1d4ed8] active:translate-y-[1px] transition"
            >
              Login
            </button>

            <p className="mt-6 text-center text-sm text-[#64748b]">
              ¿No tienes cuenta?
              <Link href="/signup" className="ml-2 font-semibold text-[#2563eb]">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
