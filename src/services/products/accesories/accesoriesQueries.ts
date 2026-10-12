import { api } from "@/services/api";
import {
  ISearchAccesory,
  IResponseSearchAccesory,
  IAccessory,
  IObtenerAccesorioResponse,
} from "@/types/products/accessory";

export const searchAccesoryService = async (
  sedeId: number,
  nombre: string,
  limite: number = 50,
  desplazamiento: number = 0,
): Promise<ISearchAccesory[]> => {
  const { data } = await api.get<IResponseSearchAccesory>(
    `/productos/accesorios/buscarAccesorio/${sedeId}`,
    {
      params: {
        nombre,
        limite,
        desplazamiento,
      },
    },
  );

  return data.accesorios;
};

export const getAllBasicAccessoriesService = async (): Promise<
  IAccessory[]
> => {
  const { data } = await api.get("/productos/accesoriosBasicos");
  return data;
};

export const obtenerAccesorioService = async (
  codigoOId: string,
  idSede: number,
): Promise<IObtenerAccesorioResponse> => {
  const { data } = await api.get(
    `/productos/obtenerAccesorio/${codigoOId}/${idSede}`,
  );
  return data;
};
