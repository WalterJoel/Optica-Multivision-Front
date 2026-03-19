import { api } from "@/services/api";
import {
  ISearchAccesory,
  IResponseSearchAccesory,
  IAccessory,
} from "@/types/products/accessory";

export const searchAccesoryService = async (
  nombre: string,
  limite: number = 50,
  desplazamiento: number = 0,
): Promise<ISearchAccesory[]> => {
  const { data } = await api.get<IResponseSearchAccesory>(
    "/productos/buscarAccesorio",
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
