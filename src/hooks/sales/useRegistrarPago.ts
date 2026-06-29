import { useState } from "react";
import { registrarPagoService } from "@/services/sales";

export function useRegistrarPago() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const registrarPago = async (
    id: number,
    payload: { montoPagado: number; metodoPago: string; sedeId: number }
  ) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const data = await registrarPagoService(id, payload);
      setSuccess(true);
      setMessage(data.message || "Pago registrado correctamente");
      return data;
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error: " + backendMessage
          : "Error al registrar el pago"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { registrarPago, loading, statusMessage, success };
}
