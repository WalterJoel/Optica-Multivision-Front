import { api } from "../../api";
import { IUpdateStockProductos } from "@/types/products";

export const updateStockProductosService = async (
  payload: Partial<IUpdateStockProductos>,
) => {
  const { data } = await api.post(
    `/productos/actualizarStockProductos`,
    payload,
  );
  return data;
};
