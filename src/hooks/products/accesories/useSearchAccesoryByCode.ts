import { useState } from "react";
import { IAccesoryQrResponse } from "@/types/products";
import { searchAccesoriesByCodeService } from "@/services/products/accesories";

export function useSearchAccesoryByCode() {
  const [accesory, setAccesory] = useState<IAccesoryQrResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [success, setSuccess] = useState(false);

  /* RESET */
  const resetState = () => {
    setAccesory(null);
    setStatusMessage("");
    setSuccess(false);
  };

  /* NORMALIZAR CÓDIGO */
  const normalizeCode = (value: string) => {
    return value.trim().replace(/\s+/g, "").toUpperCase();
  };

  /* SEARCH */
  const searchAccesoryByCode = async (qr: string, idSede: number) => {
    const codigo = normalizeCode(qr);

    if (!codigo) {
      resetState();
      return null;
    }

    setLoading(true);
    setStatusMessage("");
    setSuccess(false);

    try {
      const data = await searchAccesoriesByCodeService(codigo, idSede);

      if (!data) {
        setAccesory(null);
        setStatusMessage("Producto no encontrado");
        setSuccess(false);

        return null;
      }

      setAccesory(data);
      setSuccess(true);

      return data;
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;

      setAccesory(null);
      setSuccess(false);

      setStatusMessage(backendMessage || "Error al buscar producto");

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    accesory,
    loading,
    statusMessage,
    success,
    searchAccesoryByCode,
    resetState,
  };
}
