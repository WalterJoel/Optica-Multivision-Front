"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/products");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Breadcrumb title={"Signin"} pages={["Signin"]} />

      <section className="py-20 bg-gray-2">
        <div className="max-w-[570px] mx-auto bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue text-white py-3 rounded hover:bg-blue-dark"
            >
              Entrar
            </button>
          </form>

          <p className="text-center mt-4">
            ¿No tienes cuenta?
            <Link href="/signup" className="text-blue ml-2">
              Regístrate
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Signin;
