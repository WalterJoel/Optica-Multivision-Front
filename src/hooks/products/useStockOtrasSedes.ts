import { useState, useCallback } from "react";
import { IStockOtraSede } from "@/types/products";
import { obtenerStockOtrasSedesService } from "@/services/products";

export function useStockOtrasSedes() {
  const [loading, setLoading] = useState<boolean>(false);
  const [stockSedes, setStockSedes] = useState<IStockOtraSede[]>([]);

  const fetchStockOtrasSedes = useCallback(async (productoId: number) => {
    if (!productoId) return [];
    setLoading(true);
    try {
      const data = await obtenerStockOtrasSedesService(productoId);
      setStockSedes(data || []);
      return data || [];
    } catch (err) {
      console.error("Error al obtener el stock en otras sedes:", err);
      setStockSedes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    stockSedes,
    fetchStockOtrasSedes,
  };
}
