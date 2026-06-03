import { api } from "../api";
import {
  ICrearMovimientoCaja,
  IMovimientosCaja,
} from "@/types/caja-movimiento";

export const crearMovimientoCajaService = async (
  payload: ICrearMovimientoCaja,
) => {
  const { data } = await api.post("/caja/crearMovimiento", payload);
  return data;
};

export const updateCajaMovimientoService = async (
  id: number,
  payload: Partial<ICrearMovimientoCaja>,
) => {
  const { data } = await api.patch(`/caja/actualizar/${id}`, payload);
  return data;
};
