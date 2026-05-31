import { useState } from "react";
import { updateClientService } from "@/services/clients";
import { IClient } from "@/types/clients";

export function useUpdateClient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  const updateClient = async (id: number, payload: Partial<IClient>) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const data = await updateClientService(id, payload);
      setSuccess(true);
      setMessage("Cliente actualizado correctamente");
      return data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al actualizar cliente";
      setSuccess(false);
      setMessage(Array.isArray(msg) ? msg.join(", ") : msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateClient, loading, success, statusMessage };
}
