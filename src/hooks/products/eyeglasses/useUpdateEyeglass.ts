import { useState } from "react";
import { IUpdateEyeglass } from "@/types/products";
import { updateEyeglassService } from "@/services/products/eyeglasses";

export function useUpdateEyeglass() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateEyeglass = async (id: number, payload: IUpdateEyeglass) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateEyeglassService(id, payload);
      setSuccess(true);
      setMessage("Montura actualizada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al actualizar montura: " + backendMessage
          : "Error al actualizar montura",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateEyeglass, loading, statusMessage, success };
}