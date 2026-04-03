import { useState, useRef } from "react";
import { IEyeglassQrResponse } from "@/types/products/eyeglass";
import { searchEyeglassByQrService } from "@/services/products/eyeglasses";

export function useSearchEyeglassByQr() {
  const [eyeglass, setEyeglass] = useState<IEyeglassQrResponse>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  // Eliminamos el debounceRef y el setTimeout
  const searchEyeglassByQr = async (qr: string, idSede: number) => {
    if (!qr || qr.length < 2) {
      setEyeglass(null);
      return;
    }

    setLoading(true);
    setMessage(""); // Limpiamos mensajes previos

    try {
      const data = await searchEyeglassByQrService(qr, idSede);
      setEyeglass(data);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(backendMessage || "Error al buscar producto");
      setEyeglass(null);
    } finally {
      setLoading(false);
    }
  };

  return { eyeglass, loading, statusMessage, searchEyeglassByQr };
}
