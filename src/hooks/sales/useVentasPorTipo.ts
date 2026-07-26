import { useState, useCallback } from "react";
import { IVentaPorTipoItem } from "@/types/sales";
import { buscarVentasPorRangoTipoService } from "@/services/sales/salesQueries";

export function useVentasPorTipo() {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [items, setItems] = useState<IVentaPorTipoItem[]>([]);

  const fetchVentasPorTipo = useCallback(
    async (
      sedeId: number,
      fechaInicio: string,
      fechaFin: string,
      tipo: string
    ) => {
      if (!sedeId || !fechaInicio || !fechaFin || !tipo) return;

      setLoading(true);
      setSuccess(false);
      setStatusMessage("");

      try {
        const data = await buscarVentasPorRangoTipoService(
          sedeId,
          fechaInicio,
          fechaFin,
          tipo
        );
        setItems(data || []);
        setSuccess(true);
        setStatusMessage("Productos obtenidos correctamente");
      } catch (err: any) {
        const backendMessage = err.response?.data?.message;
        setStatusMessage(
          backendMessage
            ? `Error al obtener productos: ${backendMessage}`
            : "Error al obtener productos"
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  return {
    fetchVentasPorTipo,
    clearItems,
    items,
    loading,
    statusMessage,
    success,
  };
}
