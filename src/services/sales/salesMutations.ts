import { api } from "../api";
import { ICreateSale } from "@/types/sales";

export const createSaleService = async (payload: ICreateSale) => {
  const { data } = await api.post("/ventas/crearVenta", payload);
  return data;
};

export const anularVentaService = async (id: number) => {
  const { data } = await api.post(`/ventas/anularVenta/${id}`);
  return data;
};

export const editarVentaService = async (id: number, payload: any) => {
  const { data } = await api.patch(`/ventas/editarVenta/${id}`, payload);
  return data;
};

export const registrarPagoService = async (id: number, payload: { montoPagado: number; metodoPago: string; sedeId: number }) => {
  const { data } = await api.post(`/ventas/registrarPago/${id}`, payload);
  return data;
};
