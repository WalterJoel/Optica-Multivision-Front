import { api } from "../api";
import { ICreateDiscount } from "@/types/discounts";

export const createDiscountService = async (payload: ICreateDiscount) => {
  const { data } = await api.post("/descuentos/crearDescuento", payload);
  return data;
};

export const updateDiscountService = async (
  id: number,
  payload: Partial<ICreateDiscount>,
) => {
  const { data } = await api.patch(`/descuentos/${id}`, payload);
  return data;
};

export const deleteDiscountService = async (id: number) => {
  const { data } = await api.delete(`/descuentos/${id}`);
  return data;
};
