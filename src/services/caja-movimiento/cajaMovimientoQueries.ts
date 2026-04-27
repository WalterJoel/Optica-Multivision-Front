import { api } from '../api';

export const validarCajaAbiertaService = async (sedeId: number) => {
  const { data } = await api.get(`/caja/validarCajaAbierta/${sedeId}`);
  return data;
};
