import { api } from "../api";
//auemnte la la I
import { ICreateStore } from "@/types/stores";

export const createStoreService = async (payload: ICreateStore) => {
  const { data } = await api.post("/sedes/crearSede", payload);
  return data;
};
