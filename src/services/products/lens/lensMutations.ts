import { api } from "../../api";
import { CreateLens, ILens } from "@/types/products";

export const updateLensService = async (
  id: number,
  payload: Partial<CreateLens>,
) => {
  const { data } = await api.patch(`/productos/lentes/actualizar/${id}`, payload);
  return data;
};

export const deleteLensService = async (id: number) => {
  const { data } = await api.delete(`/productos/lentes/eliminar/${id}`);
  return data;
};

export const getLensByIdService = async (id: number): Promise<ILens> => {
  const { data } = await api.get(`/productos/lente/${id}`);
  return data;
};
