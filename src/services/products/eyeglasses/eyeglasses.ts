import { TipoProducto } from "@/commons/constants";
import { api } from "../../api";
import {
  ICreateEyeglass,
  IEyeglass,
  IEyeglassQrResponse,
  IUpdateEyeglass,
} from "@/types/products";

export const createEyeglassService = async (payload: ICreateEyeglass) => {
  const { data } = await api.post("/productos/monturas/crearMontura", payload);
  return data;
};

// Ajustamos la función para que reciba obligatoriamente el sedeId
export const getAllEyeglassesService = async (
  idSede: number,
): Promise<IEyeglass[]> => {
  const { data } = await api.get(`/productos/monturas/${idSede}`);

  return data;
};

export const getEyeglassById = async (id: string): Promise<IEyeglass> => {
  const { data } = await api.get(`/productos/montura/qr/${id}/`);
  return data;
};

export const updateEyeglassService = async (
  id: number,
  payload: IUpdateEyeglass,
) => {
  const { data } = await api.patch(`/productos/monturas/actualizar/${id}`, payload);
  return data;
};

export const deleteEyeglassService = async (id: number) => {
  const { data } = await api.delete(`/productos/monturas/eliminar/${id}`);
  return data;
};

export const searchEyeglassesService = async (
  sedeId: number,
  busqueda: string,
): Promise<{ total: number; monturas: IEyeglass[] }> => {
  const { data } = await api.get(`/productos/monturas/buscarMontura/${sedeId}`, {
    params: { busqueda },
  });
  return data;
};

export const searchEyeglassByQrService = async (
  codigo: string,
  idSede: number,
): Promise<IEyeglassQrResponse> => {
  const { data } = await api.get(`/productos/montura/qr/${codigo}/${idSede}`);
  return data;
};
