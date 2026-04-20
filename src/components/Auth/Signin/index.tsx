"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Signin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!result || result.error) {
      setError(
        result?.error || "Credenciales incorrectas o error en el servidor.",
      );
      return;
    }

    router.push("/products");
  };

  return (
    <section className="min-h-screen w-full flex items-center bg-[linear-gradient(135deg,#eef2ff,#f8fafc)] px-4 py-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="overflow-hidden rounded-[14px] bg-white shadow-lg border border-[#e2e8f0] md:flex">
          {/* Imagen */}
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

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[15px] font-semibold mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full rounded-lg border border-[#e2e8f0] p-3 outline-none focus:border-blue transition-all"
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
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#e2e8f0] p-3 outline-none focus:border-blue transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-8 w-full rounded-lg bg-blue py-3 font-bold text-white transition-all transform active:scale-[0.98] ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-dark shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Validando...
                </span>
              ) : (
                "Entrar a la plataforma"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
