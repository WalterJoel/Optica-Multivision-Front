import { api } from "../api";
import { ICreateSale } from "@/types/sales";

export const createSaleService = async (payload: ICreateSale) => {
  const { data } = await api.post("/ventas/crearVenta", payload);
  return data;
};
