import { api } from "@/services/api";
import { ISearchLensResponse, ILens } from "@/types/products";

export const searchLens = async (
  busqueda: string,
  limite: number = 50,
  desplazamiento: number = 0,
): Promise<ILens[]> => {
  const { data } = await api.get<ISearchLensResponse>(
    "/productos/buscarLente",
    {
      params: {
        busqueda,
        limite,
        desplazamiento,
      },
    },
  );

  return data.lentes;
};
