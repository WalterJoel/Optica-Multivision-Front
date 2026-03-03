import { useState } from "react";
import { updateUserService } from "@/services/users/users";
import { IUser } from "@/types/users";

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const updateUser = async (id: number, payload: Partial<IUser> & { password?: string }) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateUserService(id, payload);
      setSuccess(true);
      setMessage("Usuario actualizado correctamente");
    } catch (err: any) {
      const data = err?.response?.data;
      const backendMessage =
        typeof data === "string"
          ? data
          : Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message || err?.message;

      setMessage(backendMessage ? String(backendMessage) : "Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, statusMessage, success };
}