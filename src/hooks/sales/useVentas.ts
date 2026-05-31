import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { getAllVentasService } from "@/services/sales";
import { IResponseSale } from "@/types/sales";

export function useSales(sedeId: number) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [sales, setSales] = useState<IResponseSale[]>([]);

  const getAllSales = async () => {
    if (loading) return;

    setLoading(true);
    setSuccess(false);

    try {
      const data = await getAllVentasService(sedeId);
      setSales(data || []);
      setSuccess(true);
      setMessage("Ventas obtenidas correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(
        backendMessage
          ? "Error al obtener ventas: " + backendMessage
          : "Error al obtener ventas",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllSales,
    sales,
    loading,
    statusMessage,
    success,
  };
}
