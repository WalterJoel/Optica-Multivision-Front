import { useState } from "react";
import { cerrarCajaService } from "@/services/caja";
import { ICerrarCaja } from "@/types/caja";

export function useCerrarCaja() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  const cerrarCaja = async (payload: ICerrarCaja) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await cerrarCajaService(payload);

      setMessage("Caja cerrada correctamente");

      return {
        success: true,
        data: res,
      };
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;

      const msg = backendMessage
        ? "Error al cerrar caja: " + backendMessage
        : "Error al cerrar caja";

      setMessage(msg);

      return {
        success: false,
        error: err,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    cerrarCaja,
    loading,
    statusMessage,
  };
}
