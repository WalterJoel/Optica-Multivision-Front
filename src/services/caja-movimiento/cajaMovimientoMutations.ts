import { api } from '../api';
import {
  ICrearMovimientoCaja,
  IMovimientosCaja,
} from '@/types/caja-movimiento';

export const crearMovimientoCajaService = async (
  payload: ICrearMovimientoCaja,
) => {
  const { data } = await api.post('/caja/crearMovimiento', payload);
  return data;
};

export const movimientosCajaService = async (payload: IMovimientosCaja) => {
  const { data } = await api.post('/caja/movimientoCaja', payload);
  return data;
};
