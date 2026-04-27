import { api } from '../api';
import { ICerrarCaja, ICreateCaja } from '@/types/caja';

export const createCajaService = async (payload: ICreateCaja) => {
  const { data } = await api.post('/caja/crearCaja', payload);
  return data;
};

export const cerrarCajaService = async (payload: ICerrarCaja) => {
  const { data } = await api.post('/caja/cerrarCaja', payload);
  return data;
};
