import { useState } from "react";
import { IAccessory } from "@/types/products/accessory";
import { buscarVentasService } from "@/services/sales";
import { IResponseSale } from "@/types/sales";

export function useSales(sedeId: number) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [sales, setSales] = useState<IResponseSale[]>([]);

  const getAllSales = async (fechaInicio: string, fechaFin: string) => {
    if (loading) return;

    setLoading(true);
    setSuccess(false);

    try {
      const data = await buscarVentasService(sedeId, fechaInicio, fechaFin);
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
