import { api } from "../api";

export const getAllVentasService = async (sedeId: number) => {
  const { data } = await api.get(`/ventas/ventas/${sedeId}`);
  return data;
};
