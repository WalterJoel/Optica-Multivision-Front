import { useState } from "react";
import { IEyeglass } from "@/types/products/eyeglass";
import { getAllEyeglasses } from "@/services/products/eyeglasses";

export function useEyeglasses() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [eyeglasses, setEyeglasses] = useState<IEyeglass[]>([]);

  const getAllEyeglassesData = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllEyeglasses();
      setEyeglasses(data);
      setSuccess(true);
      setMessage("Monturas obtenidas correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al obtener monturas: " + backendMessage
          : "Error al obtener monturas",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllEyeglassesData,
    eyeglasses,
    loading,
    statusMessage,
    success,
  };
}