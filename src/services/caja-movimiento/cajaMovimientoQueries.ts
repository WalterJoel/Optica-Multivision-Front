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
