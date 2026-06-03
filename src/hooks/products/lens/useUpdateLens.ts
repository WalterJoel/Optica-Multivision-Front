import { useState } from "react";
import { CreateLens } from "@/types/products";
import { updateLensService } from "@/services/products/lens";

export function useUpdateLens() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateLens = async (id: number, payload: Partial<CreateLens>) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateLensService(id, payload);
      setSuccess(true);
      setMessage("Lente actualizado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al actualizar lente: " + backendMessage
          : "Error al actualizar lente",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateLens, loading, statusMessage, success };
}
