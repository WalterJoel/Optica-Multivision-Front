import { useState } from "react";
import { editarVentaService } from "@/services/sales";

export function useEditarVenta() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const editarVenta = async (id: number, payload: any) => {
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const data = await editarVentaService(id, payload);
      setSuccess(true);
      setMessage("Venta editada correctamente");
      return data;
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al editar venta: " + backendMessage
          : "Error al editar venta",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editarVenta, loading, statusMessage, success };
}
