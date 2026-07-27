import { api } from "../api";
import { IStockOtraSede } from "@/types/products";

export const obtenerStockOtrasSedesService = async (
  productoId: number
): Promise<IStockOtraSede[]> => {
  const { data } = await api.get<IStockOtraSede[]>(`/productos/stockOtrasSedes/${productoId}`);
  return data;
};
