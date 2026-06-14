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

export const revisarDeudasService = async (clienteId: number) => {
  const { data } = await api.get(`/ventas/revisarDeudas/${clienteId}`);
  return data;
};

