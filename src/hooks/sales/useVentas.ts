import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllVentasService } from "@/services/sales";

export function useSales() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [Sales, setSales] = useState<IAccessory[]>([]);

  const getAllSales = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllVentasService();
      setSales(data);
      setSuccess(true);
      setMessage("Ventas obtenidos correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al obtener accesorios: " + backendMessage
          : "Error al obtener accesorios",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllSales,
    Sales,
    loading,
    statusMessage,
    success,
  };
}
