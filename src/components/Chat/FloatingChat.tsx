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
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue text-white p-4 rounded-full shadow-1 hover:bg-blue-dark ease-out duration-200"
          aria-label="Abrir chat"
        >
          💬
        </button>
      )}

      {open && (
        <>
          <button
            onClick={() => setOpen(false)}
            className="fixed bottom-[420px] right-6 z-50 bg-red text-white px-3 py-1 rounded-md shadow-1"
          >
            X
          </button>

          <Chat user={user} token="" />
        </>
      )}
    </>
  );
}
