import { api } from '../api';
import { ICreateCaja } from '@/types/caja';

export const createCajaService = async (payload: ICreateCaja) => {
  const { data } = await api.post('/caja/crearCaja', payload);
  return data;
};
