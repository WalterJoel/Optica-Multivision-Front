import { useState } from "react";
import { ICreateStore } from "@/types/stores";
import { createStoreService } from "@/services/stores";

export function useCreateStore() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addStore = async (payload: ICreateStore) => {
    setLoading(true);
    setSuccess(false);

    try {
      await createStoreService(payload);
      setSuccess(true);
      setMessage("Sede creada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar sede: " + backendMessage
          : "Error al registrar sede",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addStore, loading, statusMessage, success };
}
