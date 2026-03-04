import { api } from "../../api";
import { ICreateAccessory, IAccessory } from "@/types/products";

export const createAccesoryService = async (payload: ICreateAccessory) => {
  const { data } = await api.post("/productos/crearAccesorio", payload);
  return data;
};

export const updateAccesoryService = async (
  id: number,
  payload: Partial<ICreateAccessory>,
) => {
  const { data } = await api.patch(`/sedes/${id}`, payload);
  return data;
};

export const getAllAccessories = async (): Promise<IAccessory[]> => {
  const { data } = await api.get("/accesorios");
  return data;
};
