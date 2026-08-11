import { api } from "../api";
import {
  ITraslado,
  ICrearTrasladoPayload,
  IEnviarMercaderiaPayload,
  IRecibirMercaderiaPayload,
} from "@/types/traslados";

export const crearTrasladoService = async (payload: ICrearTrasladoPayload): Promise<ITraslado> => {
  const { data } = await api.post<ITraslado>("/traslados", payload);
  return data;
};

export const enviarMercaderiaService = async (payload: IEnviarMercaderiaPayload): Promise<ITraslado> => {
  const { data } = await api.post<ITraslado>("/traslados/enviarMercaderia", payload);
  return data;
};

export const recibirMercaderiaService = async (payload: IRecibirMercaderiaPayload): Promise<ITraslado> => {
  const { data } = await api.post<ITraslado>("/traslados/recibirMercaderia", payload);
  return data;
};

export const obtenerTrasladosService = async (params: {
  sedeProveedoraId?: number;
  sedeSolicitanteId?: number;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
}): Promise<ITraslado[]> => {
  const { data } = await api.get<ITraslado[]>("/traslados", { params });
  return data;
};

export const obtenerTrasladoPorIdService = async (id: number): Promise<ITraslado> => {
  const { data } = await api.get<ITraslado>(`/traslados/${id}`);
  return data;
};

export const eliminarTrasladoService = async (id: number): Promise<{ message: string; id: number }> => {
  const { data } = await api.delete<{ message: string; id: number }>(`/traslados/${id}`);
  return data;
};

export const buscarProductoParaTrasladoService = async (
  sedeId: number,
  tipo: string,
  busqueda?: string,
) => {
  const { data } = await api.get("/productos/buscarProductoParaTraslado", {
    params: { sedeId, tipo, busqueda },
  });
  return data;
};


