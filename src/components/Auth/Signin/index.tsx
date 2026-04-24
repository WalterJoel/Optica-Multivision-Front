"use client";

import LoginCarrusel from "./LoginCarrusel";
import LoginForm from "./LoginForm";

const SignIn = () => {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* IZQUIERDA: CARRUSEL (50% de la pantalla) */}
      <LoginCarrusel />

      {/* DERECHA: SECCIÓN DE LOGIN (50% de la pantalla) */}
      <LoginForm />
    </main>
  );
};

export default SignIn;
