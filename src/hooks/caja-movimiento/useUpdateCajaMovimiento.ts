import { useState } from "react";
import { ICrearMovimientoCaja } from "@/types/caja-movimiento";
import { updateCajaMovimientoService } from "@/services/caja-movimiento";

export function useUpdateCajaMovimiento() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateCajaMovimiento = async (
    id: number,
    payload: Partial<ICrearMovimientoCaja>,
  ) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const res = await updateCajaMovimientoService(id, payload);
      setSuccess(true);
      setMessage("Movimiento de caja actualizado correctamente");
      return { success: true, data: res };
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setSuccess(false);
      setMessage(
        backendMessage
          ? "Error al actualizar movimiento de caja: " + backendMessage
          : "Error al actualizar movimiento de caja",
      );
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCajaMovimiento,
    loading,
    statusMessage,
    success,
  };
}
