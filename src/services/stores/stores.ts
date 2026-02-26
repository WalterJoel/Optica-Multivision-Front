import { api } from "../api";
import { CreateStore } from "@/types/stores";

export const createStoreService = async (payload: CreateStore) => {
  const { data } = await api.post("/sedes/crearSede", payload);
  return data;
};
