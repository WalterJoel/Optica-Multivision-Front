import { useState } from "react";
import { deleteEyeglassService } from "@/services/products/eyeglasses";

export function useDeleteEyeglass() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const deleteEyeglass = async (id: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      await deleteEyeglassService(id);
      setSuccess(true);
      setMessage("Montura eliminada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al eliminar montura: " + backendMessage
          : "Error al eliminar montura",
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteEyeglass, loading, statusMessage, success };
}
