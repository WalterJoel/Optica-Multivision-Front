import { useState } from "react";
import { deleteLensService } from "@/services/products/lens";

export function useDeleteLens() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const deleteLens = async (id: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      await deleteLensService(id);
      setSuccess(true);
      setMessage("Lente eliminado/desactivado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al desactivar lente: " + backendMessage
          : "Error al desactivar lente",
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteLens, loading, statusMessage, success };
}
