import { api } from "../api";

export const searchDiscountsByProducts = async (payload) => {
  const { data } = await api.post("/descuentos/obtenerDescuentos", payload);
  return data;
};
