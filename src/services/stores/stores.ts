import { api } from "../api";
import { ICreateStore, IStore } from "@/types/stores";

export const createStoreService = async (payload: ICreateStore) => {
  const { data } = await api.post("/sedes/crearSede", payload);
  return data;
};

export const updateStoreService = async (id: number, payload: Partial<IStore>) => {
  const { data } = await api.patch(`/sedes/${id}`, payload);
  return data;
};

export const updateStoreStatusService = async (id: number, activo: boolean) => {
  const { data } = await api.patch(`/sedes/${id}/status`, { activo });
  return data;
};