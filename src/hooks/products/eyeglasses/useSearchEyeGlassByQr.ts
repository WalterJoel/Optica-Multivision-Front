import { useState, useRef } from "react";
import { IEyeglassQrResponse } from "@/types/products/eyeglass";
import { searchEyeglassByQrService } from "@/services/products/eyeglasses";

export function useSearchEyeglassByQr() {
  const [eyeglass, setEyeglass] = useState<IEyeglassQrResponse>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchEyeglassByQr = (qr: string, idSede: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!qr || qr.length < 2) {
        setEyeglass(null);
        return;
      }

      setLoading(true);

      try {
        const data = await searchEyeglassByQrService(qr, idSede);
        setEyeglass(data);
      } catch (err) {
        const backendMessage = err.response?.data?.message;
        setMessage(
          backendMessage
            ? "Error al registrar accesorio: " + backendMessage
            : "Error al registrar accesorio",
        );
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return {
    eyeglass,
    loading,
    statusMessage,
    searchEyeglassByQr,
  };
}
