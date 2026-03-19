import { api } from "../../api";
import {
  ICreateEyeglass,
  IEyeglass,
  IUpdateEyeglass,
} from "@/types/products";

export const createEyeglassService = async (payload: ICreateEyeglass) => {
  const { data } = await api.post("/productos/crearMontura", payload);
  return data;
};

export const getAllEyeglasses = async (): Promise<IEyeglass[]> => {
  const { data } = await api.get("/productos/monturas");
  return data;
};

export const getEyeglassById = async (id: number): Promise<IEyeglass> => {
  const { data } = await api.get(`/productos/montura/${id}`);
  return data;
};

export const updateEyeglassService = async (
  id: number,
  payload: IUpdateEyeglass,
) => {
  const { data } = await api.patch(`/productos/montura/${id}`, payload);
  return data;
};

export const deleteEyeglassService = async (id: number) => {
  const { data } = await api.delete(`/productos/montura/${id}`);
  return data;
};

export const searchEyeglasses = async (
  busqueda: string,
): Promise<{ total: number; monturas: IEyeglass[] }> => {
  const { data } = await api.get("/productos/buscarMontura", {
    params: { busqueda },
  });
  return data?.monturas || [];
};