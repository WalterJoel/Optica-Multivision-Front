import { api } from "../api";
import { ICreateDiscount } from "@/types/discounts";

export const searchDiscountsByProducts = async (payload) => {
  const { data } = await api.post("/descuentos/obtenerDescuentos", payload);
  return data;
};
