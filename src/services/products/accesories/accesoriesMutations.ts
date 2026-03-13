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
  const { data } = await api.patch(`/productos/accesorio/${id}`, payload);
  return data;
};

export const getAllAccessories = async (): Promise<IAccessory[]> => {
  const { data } = await api.get("/productos/accesorios");
  return data;
};

export const getAccessoryById = async (id: number): Promise<IAccessory> => {
  const { data } = await api.get(`/productos/accesorio/${id}`);
  return data;
};

export const deleteAccesoryService = async (id: number) => {
  const { data } = await api.delete(`/productos/accesorio/${id}`);
  return data;
};

export const searchAccessories = async (
  nombre: string,
): Promise<{ total: number; data: IAccessory[] }> => {
  const { data } = await api.get("/productos/buscarAccesorio", {
    params: { nombre },
  });
  return data;
};