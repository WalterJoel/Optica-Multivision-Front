import { useState } from "react";
import { IObtenerAccesorioResponse } from "@/types/products";
import { obtenerAccesorioService } from "@/services/products/accesories";

export function useObtenerAccesorio() {
  const [accesorio, setAccesorio] = useState<IObtenerAccesorioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  const obtenerAccesorio = async (codigoOId: string, idSede: number) => {
    const termino = codigoOId.trim();

    if (!termino) {
      setAccesorio(null);
      return null;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await obtenerAccesorioService(termino, idSede);
      setAccesorio(data);
      return data;
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      setMessage(backendMessage || "Error al buscar accesorio");
      setAccesorio(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { accesorio, loading, statusMessage, obtenerAccesorio };
}
