import { useState } from "react";
import { IMovimientosCaja } from "@/types/caja-movimiento";
import { movimientosCajaService } from "@/services/caja-movimiento";

export function useMovimientosCaja() {
  const [movimientos, setMovimientos] = useState<IMovimientosCaja[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const getMovimientosCaja = async (sedeId: number) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const res = await movimientosCajaService(sedeId);

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
