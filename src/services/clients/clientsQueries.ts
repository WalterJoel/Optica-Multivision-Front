import { ISearchClient, IResponseSearchClient } from "@/types/clients";
import { api } from "../api";

export const searchClient = async (
  busqueda: string,
  limite: number = 50,
  desplazamiento: number = 0,
): Promise<ISearchClient[]> => {
  const { data } = await api.get<IResponseSearchClient>(
    "/clientes/buscarCliente",
    {
      params: {
        busqueda,
        limite,
        desplazamiento,
      },
    },
  );

  return data.clientes;
};
