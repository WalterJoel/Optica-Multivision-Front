import { api } from "@/services/api";
import {
  ISearchAccesory,
  IResponseSearchAccesory,
  IAccessory,
  IAccesoryQrResponse,
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

export const searchAccesoriesByCodeService = async (
  codigo: string,
  idSede: number,
): Promise<IAccesoryQrResponse> => {
  const { data } = await api.get(
    `/productos/obtenerAccesorio/${codigo}/${idSede}`,
  );
  return data;
};
