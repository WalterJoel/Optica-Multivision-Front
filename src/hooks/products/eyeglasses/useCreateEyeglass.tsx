import { useState } from "react";
import { ICreateEyeglass } from "@/types/products";
import { createEyeglassService } from "@/services/products/eyeglasses";

export function useCreateEyeglass() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const addEyeglass = async (payload: ICreateEyeglass) => {
    setLoading(true);
    setSuccess(false);

    try {
      await createEyeglassService(payload);
      setSuccess(true);
      setMessage("Montura creada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al registrar montura: " + backendMessage
          : "Error al registrar montura",
      );
    } finally {
      setLoading(false);
    }
  };

  return { addEyeglass, loading, statusMessage, success };
}