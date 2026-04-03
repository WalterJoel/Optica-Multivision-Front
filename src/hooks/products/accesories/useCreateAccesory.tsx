import { useState } from "react";
import { ICreateAccessory, IAccessory } from "@/types/products";
import { createAccesoryService } from "@/services/products/accesories";

export function useCreateAccessory() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addAccessory = async (payload: ICreateAccessory) => {
    setLoading(true);
    setSuccess(false);

    try {
      await createAccesoryService(payload);
      setSuccess(true);
      setMessage("Accesorio creado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar accesorio: " + backendMessage
          : "Error al registrar accesorio",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addAccessory, loading, statusMessage, success };
}
