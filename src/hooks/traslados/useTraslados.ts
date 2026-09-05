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
  const [actionLoading, setActionLoading] = useState<boolean>(false);
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
    setActionLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await crearTrasladoService(payload);
      const msg = `Solicitud de traslado #${res.id} creada correctamente.`;
      setSuccess(true);
      setStatusMessage(msg);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al crear la solicitud de traslado";
      setStatusMessage(msg);
      setSuccess(false);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const enviarMercaderia = async (payload: IEnviarMercaderiaPayload) => {
    setActionLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await enviarMercaderiaService(payload);
      const msg = `Mercadería del traslado #${res.id} despachada correctamente.`;
      setSuccess(true);
      setStatusMessage(msg);
      return { success: true, data: res, message: msg };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al despachar la mercadería";
      const detallesSinStock = err.response?.data?.detalles || [];
      // Obtener IDs de detalles que fallaron por stock
      const invalidDetalleIds = detallesSinStock
        .filter((d: any) => !d.suficiente)
        .map((d: any) => Number(d.detalleId ?? d.id));

      setStatusMessage(msg);
      setSuccess(false);
      return { success: false, error: msg, invalidDetalleIds };
    } finally {
      setActionLoading(false);
    }
  };

  const recibirMercaderia = async (payload: IRecibirMercaderiaPayload) => {
    setActionLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await recibirMercaderiaService(payload);
      const msg = `Mercadería del traslado #${res.id} recibida y procesada en inventario.`;
      setSuccess(true);
      setStatusMessage(msg);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al recibir la mercadería";
      setStatusMessage(msg);
      setSuccess(false);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const eliminarTraslado = async (id: number) => {
    setActionLoading(true);
    setSuccess(false);
    setStatusMessage("");
    try {
      const res = await eliminarTrasladoService(id);
      const msg = res.message || `Solicitud #${id} eliminada correctamente.`;
      setSuccess(true);
      setStatusMessage(msg);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al eliminar la solicitud de traslado";
      setStatusMessage(msg);
      setSuccess(false);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    traslados,
    loading,
    actionLoading,
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
