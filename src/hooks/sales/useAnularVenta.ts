import { useState } from "react";
import { anularVentaService } from "@/services/sales";

export function useAnularVenta() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const anularVenta = async (id: number) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const data = await anularVentaService(id);
      setSuccess(true);
      setMessage("Venta anulada correctamente");
      return data;
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al anular venta: " + backendMessage
          : "Error al anular venta",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { anularVenta, loading, statusMessage, success };
}
