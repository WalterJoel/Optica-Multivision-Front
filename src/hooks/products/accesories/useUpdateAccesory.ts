import { useState } from "react";
import { ICreateAccessory } from "@/types/products";
import { updateAccesoryService } from "@/services/products/accesories";

export function useUpdateAccessory() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateAccessory = async (
    id: number,
    payload: Partial<ICreateAccessory>,
  ) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateAccesoryService(id, payload);
      setSuccess(true);
      setMessage("Accesorio actualizado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al actualizar accesorio: " + backendMessage
          : "Error al actualizar accesorio",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateAccessory, loading, statusMessage, success };
}