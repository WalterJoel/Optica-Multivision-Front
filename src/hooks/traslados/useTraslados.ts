import { useState, useCallback } from "react";
import {
  ITraslado,
  ICrearTrasladoPayload,
  IEnviarMercaderiaPayload,
  IRecibirMercaderiaPayload,
} from "@/types/traslados";
import {
  crearTrasladoService,
  enviarMercaderiaService,
  recibirMercaderiaService,
  obtenerTrasladosService,
  eliminarTrasladoService,
} from "@/services/traslados";


export function useTraslados() {
  const [loading, setLoading] = useState<boolean>(false);
  const [traslados, setTraslados] = useState<ITraslado[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const getTraslados = useCallback(
    async (params: {
      sedeProveedoraId?: number;
      sedeSolicitanteId?: number;
      estado?: string;
      fechaInicio?: string;
      fechaFin?: string;
    }) => {
      setLoading(true);
      try {
        const data = await obtenerTrasladosService(params);
        setTraslados(data || []);
      } catch (err: any) {
        setTraslados([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const crearTraslado = async (payload: ICrearTrasladoPayload) => {
    setLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await crearTrasladoService(payload);
      setSuccess(true);
      setStatusMessage(`Solicitud de traslado #${res.id} creada correctamente.`);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al crear la solicitud de traslado";
      setStatusMessage(msg);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enviarMercaderia = async (payload: IEnviarMercaderiaPayload) => {
    setLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await enviarMercaderiaService(payload);
      setSuccess(true);
      setStatusMessage(`Mercadería del traslado #${res.id} despachada correctamente.`);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al despachar la mercadería";
      setStatusMessage(msg);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recibirMercaderia = async (payload: IRecibirMercaderiaPayload) => {
    setLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await recibirMercaderiaService(payload);
      setSuccess(true);
      setStatusMessage(`Mercadería del traslado #${res.id} recibida y procesada en inventario.`);

      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al recibir la mercadería";
      setStatusMessage(msg);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarTraslado = async (id: number) => {
    setLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await eliminarTrasladoService(id);
      setSuccess(true);
      setStatusMessage(res.message || `Solicitud #${id} eliminada correctamente.`);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al eliminar la solicitud de traslado";
      setStatusMessage(msg);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    traslados,
    loading,
    statusMessage,
    success,
    getTraslados,
    crearTraslado,
    enviarMercaderia,
    recibirMercaderia,
    eliminarTraslado,
    setStatusMessage,
  };
}

