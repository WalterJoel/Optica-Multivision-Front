import { IMovimientosCaja } from "@/types/caja-movimiento";
import { api } from "../api";

export const validarCajaAbiertaService = async (sedeId: number) => {
  const { data } = await api.get(`/caja/validarCajaAbierta/${sedeId}`);
  return data;
};

export const movimientosCajaService = async (sedeId: number) => {
  const { data } = await api.get(`/caja/movimientosCaja/${sedeId}`);
  return data;
};

export const buscarMovimientosCajaService = async (
  sedeId: number,
  fechaInicio: string,
  fechaFin: string,
) => {
  const { data } = await api.get(`/caja/buscarMovimientosPorRango`, {
    params: { sedeId, fechaInicio, fechaFin },
  });
  return data;
};

