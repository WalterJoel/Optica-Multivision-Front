import { api } from "../api";
import { ICreateDiscount } from "@/types/discounts";

export const createDiscountService = async (payload: ICreateDiscount) => {
  const { data } = await api.post("/descuentos/crearDescuento", payload);
  return data;
};
