import React, { useState } from "react";
import Signin from "@/components/Auth/Signin";
import Chat from "@/components/Chat"; // crea este componente como te mostré antes

export default function AppChat() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Si no hay usuario logueado, mostrar signin
  if (!user) {
    return <Signin onLogin={(u, t) => { setUser(u); setToken(t); }} />;
  }

  // Si ya hay usuario logueado, mostrar chat
  return <Chat user={user} token={token} />;
}
