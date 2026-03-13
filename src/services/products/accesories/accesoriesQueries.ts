import { api } from "@/services/api";
import {
  ISearchAccesory,
  IResponseSearchAccesory,
} from "@/types/products/accessory";

export const searchAccesory = async (
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
