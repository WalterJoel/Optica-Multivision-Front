import { useEffect, useState } from "react";
import { Lens, CreateLens } from "@/types/products";
import { createLens, getLenses, UpdateLensStock } from "@/services/products";

export function useLenses() {
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockVersion, setStockVersion] = useState(0); // <--- versión para refrescar stock

  // Obtener todos los lentes
  const getAllLenses = async () => {
    try {
      setLoading(true);
      const data = await getLenses();
      setLenses(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar lentes");
    } finally {
      setLoading(false);
    }
  };

  // Actualizar stock de uno o varios lentes
  const updateStock = async (changes: { id: number; cantidad: number }[]) => {
    try {
      setLoading(true);
      await UpdateLensStock(changes); // actualizar en la BD

      // Incrementamos la versión para que useLenteStock recargue
      setStockVersion((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Error al actualizar stock");
    } finally {
      setLoading(false);
    }
  };

  // Cargar lentes al montar el hook
  useEffect(() => {
    getAllLenses();
  }, []);

  return {
    lenses,
    loading,
    error,
    getAllLenses,
    updateStock,
    stockVersion, // <--- importante para el refresh de stock
  };
}
