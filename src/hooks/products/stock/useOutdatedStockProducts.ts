import { useState } from "react";
import {
  IOutdatedProductStockResponse,
  IOutdatedStockProductosPayload,
} from "@/types/products";
import { getAllOutdatedStockProductsService } from "@/services/products/stock";
export function useOutdatedStockProducts() {
  const [loading, setLoading] = useState(false);
  const [outdatedProducts, setOutdatedProducts] = useState<
    IOutdatedProductStockResponse[]
  >([]);
  const [statusMessage, setMessage] = useState<string>("");

  const getOutdatedStockProductos = async (
    payload: IOutdatedStockProductosPayload,
  ) => {
    setLoading(true);
    try {
      const response = await getAllOutdatedStockProductsService(payload);
      setOutdatedProducts(response);
      setMessage("Actualización Correcta");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setMessage(backendMessage || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  return {
    getOutdatedStockProductos,
    outdatedProducts,
    loading,
    statusMessage,
  };
}
