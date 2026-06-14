import { IProductoVendidoResponse } from "@/types/sales";
import { api } from "../api";

export const getAllVentasService = async (sedeId: number) => {
  const { data } = await api.get(`/ventas/ventas/${sedeId}`);
  return data;
};

export const buscarVentasService = async (
  sedeId: number,
  fechaInicio: string,
  fechaFin: string,
) => {
  const { data } = await api.get(`/ventas/buscarVentasPorRango`, {
    params: { sedeId, fechaInicio, fechaFin },
  });
  return data;
};

export const buscarProductosVendidosPorRangoService = async (
  sedeId: number,
  fechaInicio: string,
  fechaFin: string,
): Promise<IProductoVendidoResponse[]> => {
  const { data } = await api.get<IProductoVendidoResponse[]>(`/ventas/buscarProductosVendidosPorRango`, {
    params: { sedeId, fechaInicio, fechaFin },
  });
  return data;
};

export const revisarDeudasService = async (clienteId: number) => {
  const { data } = await api.get(`/ventas/revisarDeudas/${clienteId}`);
  return data;
};

