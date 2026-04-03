// components/Signin/index.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthData } from "@/redux/features/auth-slice";

const Signin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://apiv2.multivisionproductos.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // 1. Guardar token para las cabeceras de API
      localStorage.setItem("token", data.access_token);

      // 2. Guardar el usuario completo en Redux
      // Asumimos que data.user trae: { id, name, email, role, sedeId }
      dispatch(
        setAuthData({
          userId: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          sedeId: data.user.sedeId,
        }),
      );

      router.push("/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center bg-[linear-gradient(135deg,#eef2ff,#f8fafc)] px-4 py-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="overflow-hidden rounded-[14px] bg-white shadow-lg border border-[#e2e8f0] md:flex">
          {/* Imagen Lateral */}
          <div
            className="relative h-[200px] md:h-auto md:basis-[55%] bg-cover bg-center"
            style={{ backgroundImage: "url('/images/login/opticafondo.jpg')" }}
          >
            <div className="absolute inset-0 bg-blue/10" />
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleLogin}
            className="flex-1 bg-white p-7 sm:p-10 md:p-[50px]"
          >
            <div className="text-center mb-8">
              <h2 className="text-[34px] font-extrabold text-[#0f172a]">
                Bienvenido
              </h2>
              <p className="text-[#64748b]">
                Inicia sesión en Opticas Multivision
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[15px] font-semibold mb-1.5">
                  Correo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] p-3 outline-none focus:border-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-[15px] font-semibold mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#e2e8f0] p-3 outline-none focus:border-blue"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-8 w-full rounded-lg bg-blue py-3 font-bold text-white transition ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-dark shadow-md"
              }`}
            >
              {loading ? "Cargando..." : "Entrar a la plataforma"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
