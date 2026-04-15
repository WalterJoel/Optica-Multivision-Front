import { useState } from "react";
import { IEyeglassQrResponse } from "@/types/products/stock";
import { searchEyeglassByQrService } from "@/services/products/eyeglasses";

export function useSearchEyeglassByQr() {
  const [eyeglass, setEyeglass] = useState<IEyeglassQrResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  const searchEyeglassByQr = async (qr: string, idSede: number) => {
    if (!qr || qr.length < 2) {
      setEyeglass(null);
      return null;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await searchEyeglassByQrService(qr, idSede);

      // 2. Actualizamos el estado para la UI
      setEyeglass(data);

      return data;
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(backendMessage || "Error al buscar producto");
      setEyeglass(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { eyeglass, loading, statusMessage, searchEyeglassByQr };
}
