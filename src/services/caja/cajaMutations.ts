import { api } from '../api';
import { ICerrarCaja, ICreateCaja, ICrearMovimientoCaja } from '@/types/caja';

export const createCajaService = async (payload: ICreateCaja) => {
  const { data } = await api.post('/caja/crearCaja', payload);
  return data;
};

export const cerrarCajaService = async (payload: ICerrarCaja) => {
  const { data } = await api.post('/caja/cerrarCaja', payload);
  return data;
};

export const crearMovimientoCajaService = async (
  payload: ICrearMovimientoCaja,
) => {
  const { data } = await api.post('/caja/crearMovimiento', payload);
  return data;
};
