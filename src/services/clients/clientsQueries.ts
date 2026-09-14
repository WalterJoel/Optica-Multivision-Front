import { IClient } from "@/types/clients";
import { api } from "../api";

export const searchClient = async (
  busqueda = "",
  limite = 50,
  desplazamiento = 0,
): Promise<{ total: number; clientes: IClient[] }> => {
  const { data } = await api.get("/clientes/buscarCliente", {
    params: { busqueda, limite, desplazamiento },
  });
  return data;
};
