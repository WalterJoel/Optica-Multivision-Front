import { IDescuento } from "@/types/discounts";
import { api } from "../api";

export const searchDiscountsByProducts = async (payload) => {
  const { data } = await api.post("/descuentos/obtenerDescuentos", payload);
  return data;
};

export const getDiscountsService = async (): Promise<IDescuento[]> => {
  const { data } = await api.get<IDescuento[]>("/descuentos");
  return data;
};
