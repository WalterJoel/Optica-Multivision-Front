import { useState } from "react";
import { updateClientService } from "@/services/clients";

export function useToggleClientStatus() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  const toggleClientStatus = async (id: number, activo: boolean) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      await updateClientService(id, { activo });
      setSuccess(true);
      setMessage(`Cliente ${activo ? "activado" : "desactivado"} correctamente`);
      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al cambiar estado del cliente";
      setSuccess(false);
      setMessage(Array.isArray(msg) ? msg.join(", ") : msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleClientStatus, loading, success, statusMessage };
}
