import { useState } from "react";
import type { CreateUser } from "@/types/users";
import { createUserService } from "@/services/users";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addUser = async (payload: CreateUser) => {
    setLoading(true);
    setSuccess(false);

    try {
      await createUserService(payload);
      setSuccess(true);
      setMessage("Usuario creado correctamente");
    } catch (err: any) {
      const data = err?.response?.data;

      const backendMessage =
        typeof data === "string"
          ? data
          : Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message || err?.message;

      setMessage(
        backendMessage
          ? "Error al registrar usuario: " + backendMessage
          : "Error al registrar usuario",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addUser, loading, statusMessage, success };
}