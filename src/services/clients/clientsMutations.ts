import { api } from "../api";

export const createClientService = async (payload: any) => {
  const { data } = await api.post("/clientes/crearCliente", payload);
  return data;
};

export const updateClientService = async (id: number, payload: any) => {
  const { data } = await api.patch(`/clientes/${id}`, payload);
  return data;
};
