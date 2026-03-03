import { useState } from "react";
import { updateUserStatusService } from "@/services/users/users";

export function useToggleUserStatus() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleStatus = async (id: number, activo: boolean) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateUserStatusService(id, activo);
      setSuccess(true);
      setMessage(activo ? "Usuario activado" : "Usuario suspendido");
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message || err?.message;
      setMessage(backendMessage ? String(backendMessage) : "Error al cambiar estado");
    } finally {
      setLoading(false);
    }
  };

  return { toggleStatus, loading, statusMessage, success };
}