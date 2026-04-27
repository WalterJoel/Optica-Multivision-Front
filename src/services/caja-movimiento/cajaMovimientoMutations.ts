import { api } from '../api';
import { ICrearMovimientoCaja } from '@/types/caja-movimiento';

export const crearMovimientoCajaService = async (
  payload: ICrearMovimientoCaja,
) => {
  const { data } = await api.post('/caja/crearMovimiento', payload);
  return data;
};
