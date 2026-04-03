import { useState } from "react";
import { IUpdateStockProductos } from "@/types/products";
import { updateStockProductosService } from "@/services/products/stock";

export function useUpdateStockProductos() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const updateStockProductos = async (payload: IUpdateStockProductos) => {
    setLoading(true);
    setSuccess(false);

    try {
      await updateStockProductosService(payload);
      setSuccess(true);
      setMessage("Montura creada correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al actualizar productos: " + backendMessage
          : "Error al actualizar productos",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateStockProductos, loading, statusMessage, success };
}
