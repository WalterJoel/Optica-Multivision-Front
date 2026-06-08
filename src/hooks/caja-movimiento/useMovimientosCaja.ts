import { useState } from "react";
import { IMovimientoCajaResponse } from "@/types/caja-movimiento";
import { movimientosCajaService, buscarMovimientosCajaService } from "@/services/caja-movimiento";

export function useMovimientosCaja() {
  const [movimientos, setMovimientos] = useState<IMovimientoCajaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const getMovimientosCaja = async (sedeId: number, fechaInicio?: string, fechaFin?: string) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const res = (fechaInicio && fechaFin)
        ? await buscarMovimientosCajaService(sedeId, fechaInicio, fechaFin)
        : await movimientosCajaService(sedeId);

      setMovimientos(res || []);

      setSuccess(true);
      setMessage("Movimientos cargados correctamente");

      return { success: true, data: res };
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;

      const message = backendMessage
        ? "Error al obtener movimientos: " + backendMessage
        : "Error al obtener movimientos";

      setMessage(message);
      setSuccess(false);

      return { success: false, data: [] };
    } finally {
      setLoading(false);
    }
  };

  return {
    movimientos,
    getMovimientosCaja,
    loading,
    statusMessage,
    success,
  };
}
