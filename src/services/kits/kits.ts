import { api } from '../api';
import { ICreateKit } from '@/types/kits';

export const createKitService = async (payload: ICreateKit) => {
  const { data } = await api.post('/kits/crearKit', payload);
  return data;
};

export const updateKitService = async (
  id: number,
  payload: Partial<ICreateKit>,
) => {
  const { data } = await api.patch(`/kits/${id}`, payload);
  return data;
};

export const updateKitStatusService = async (id: number, activo: boolean) => {
  const { data } = await api.patch(`/kits/${id}/status`, { activo });
  return data;
};
