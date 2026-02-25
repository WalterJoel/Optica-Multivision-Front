import { useEffect, useState } from "react";
import { Lens, InventoryByStoreResponse } from "@/types/products";
import {
  createLens,
  getLenses,
  UpdateLensStock,
  getInventoryByStoresService,
} from "@/services/products";

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

export function useInventoryByStores() {
  const [loading, setLoading] = useState(false);
  const [inventoryByStore, setInventoryByStore] =
    useState<InventoryByStoreResponse | null>(null);
  const [statusMessage, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const getInventoryByStores = async (idStock: number) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response: InventoryByStoreResponse =
        await getInventoryByStoresService(idStock);
      setInventoryByStore(response);
      setSuccess(true);
      setMessage("Se cargó correctamente ");
    } catch (err: any) {
      setMessage("Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  return {
    getInventoryByStores,
    loading,
    statusMessage,
    success,
    inventoryByStore,
  };
}
