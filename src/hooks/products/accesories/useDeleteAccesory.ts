import { useState } from "react";
import { deleteAccesoryService } from "@/services/products/accesories/accesoriesMutations";

export function useDeleteAccesory() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const deleteAccessory = async (id: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      await deleteAccesoryService(id);
      setSuccess(true);
      setMessage("Accesorio eliminado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al eliminar accesorio: " + backendMessage
          : "Error al eliminar accesorio",
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteAccessory, loading, statusMessage, success };
}
