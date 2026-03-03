import { useState } from "react";
import { updateStoreStatusService } from "@/services/stores/stores";

export function useToggleStoreStatus() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleStatus = async (id: number, activo: boolean) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateStoreStatusService(id, activo);
      setSuccess(true);
      setMessage(activo ? "Sede activada" : "Sede suspendida");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(backendMessage ? String(backendMessage) : "Error al cambiar estado");
    } finally {
      setLoading(false);
    }
  };

  return { toggleStatus, loading, statusMessage, success };
}