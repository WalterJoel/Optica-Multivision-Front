import { api } from "../api";

export const getAllVentasService = async () => {
  const { data } = await api.get("/ventas/ventas");
  return data;
};
