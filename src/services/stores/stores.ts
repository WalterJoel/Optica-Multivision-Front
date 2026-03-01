import { api } from "../api";
import { ICreateStore } from "@/types/stores";

export const createStoreService = async (payload: ICreateStore) => {
  const { data } = await api.post("/sedes/crearSede", payload);
  return data;
};
