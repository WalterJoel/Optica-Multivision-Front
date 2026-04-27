import { useState } from "react";
import { ICreateCaja } from "@/types/caja";
import { createCajaService } from "@/services/caja";

export function useCreateCaja() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");

  const createCaja = async (payload: ICreateCaja) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await createCajaService(payload);

      const data = res;

      setMessage("Caja creada correctamente");

      return {
        success: true,
        data,
      };
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;

      const msg = backendMessage
        ? "Error al registrar caja: " + backendMessage
        : "Error al registrar caja";

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
    createCaja,
    loading,
    statusMessage,
  };
}
