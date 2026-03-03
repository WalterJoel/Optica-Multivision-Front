import { useState } from "react";
import { updateStoreService } from "@/services/stores/stores";
import { IStore } from "@/types/stores";

export function useUpdateStore() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const updateStore = async (id: number, payload: Partial<IStore>) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateStoreService(id, payload);
      setSuccess(true);
      setMessage("Sede actualizada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(backendMessage ? String(backendMessage) : "Error al actualizar sede");
    } finally {
      setLoading(false);
    }
  };

  return { updateStore, loading, statusMessage, success };
}