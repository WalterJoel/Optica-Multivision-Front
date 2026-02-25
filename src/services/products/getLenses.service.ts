import { ROUTES_MANIFEST } from "next/dist/shared/lib/constants";
import { api } from "../api";
import { Lens, InventoryByStoreResponse } from "@/types/products";

export const getLenses = async (): Promise<Lens[]> => {
  const { data } = await api.get("/productos/lentes");
  return data.map((item: any) => ({
    ...item,
    precio_serie1: Number(item.precio_serie1),
    precio_serie2: Number(item.precio_serie2),
    precio_serie3: Number(item.precio_serie3),
  }));
};

export const getInventoryByStoresService = async (
  idStock: number,
): Promise<InventoryByStoreResponse> => {
  const { data } = await api.get<InventoryByStoreResponse>(
    `/productos/obtenerInventarioPorSede/${idStock}`,
  );
  return data;
};
