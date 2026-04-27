import { useState } from "react";
import { ICrearMovimientoCaja } from "@/types/caja-movimiento";
import { crearMovimientoCajaService } from "@/services/caja-movimiento";

export function useCrearMovimientoCaja() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const crearMovimientoCaja = async (payload: ICrearMovimientoCaja) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const res = await crearMovimientoCajaService(payload);

      setSuccess(true);
      setMessage("Movimiento registrado correctamente");

      return {
        success: true,
        data: res,
      };
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;

      setSuccess(false);
      setMessage(
        backendMessage
          ? "Error al registrar movimiento: " + backendMessage
          : "Error al registrar movimiento",
      );

      return {
        success: false,
        error: err,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    crearMovimientoCaja,
    loading,
    statusMessage,
    success,
  };
}
