"use client";

import { useEffect, useState } from "react";
import Chat from "./index";

interface User {
  id: number;
  email: string;
  role: string;
}

export default function FloatingChat() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null; // 🔥 si no está logueado no aparece nada

  return (
    <>
      {/* Botón flotante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
        >
          💬
        </button>
      )}

      {/* Ventana del chat */}
      {open && (
        <div>
          <button
            onClick={() => setOpen(false)}
            className="fixed bottom-[420px] right-6 bg-red-500 text-white px-3 py-1 rounded"
          >
            X
          </button>

          <Chat user={user} token="" />
        </div>
      )}
    </>
  );
}
