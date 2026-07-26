"use client";

import React, { useState, useEffect } from "react";
import { ITraslado } from "@/types/traslados";
import { useTraslados } from "@/hooks/traslados/useTraslados";
import { BadgeEstadoTraslado } from "../BadgeEstadoTraslado";
import { TablaSolicitanteHistorial } from "./TablaSolicitanteHistorial";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { LoadingModal, ConfirmModal } from "@/components/Common/modal";
import { Building2, Calendar, Trash2 } from "lucide-react";
import { EstadoTraslado } from "@/commons/constants";


interface SolicitanteCardProps {
  traslado: ITraslado;
  onRecibir: (payload: any) => Promise<void>;
  onEliminar?: (id: number) => Promise<void>;
  loading?: boolean;
}


function SolicitanteCard({ traslado, onRecibir, onEliminar, loading = false }: SolicitanteCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [detallesState, setDetallesState] = useState<
    { detalleId: number; cantidadRecibida: number | "" }[]
  >([]);

  useEffect(() => {
    if (traslado && traslado.detalles) {
      setDetallesState(
        traslado.detalles.map((d) => ({
          detalleId: d.id,
          cantidadRecibida:
            d.cantidadRecibida > 0
              ? d.cantidadRecibida
              : d.cantidadEnviada > 0
              ? d.cantidadEnviada
              : d.cantidadSolicitada,
        }))
      );
    }
  }, [traslado]);

  const handleCantidadChange = (detalleId: number, rawVal: string) => {
    if (rawVal === "") {
      setDetallesState((prev) =>
        prev.map((d) => (d.detalleId === detalleId ? { ...d, cantidadRecibida: "" } : d))
      );
      return;
    }

    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed)) {
      setDetallesState((prev) =>
        prev.map((d) =>
          d.detalleId === detalleId ? { ...d, cantidadRecibida: Math.max(0, parsed) } : d
        )
      );
    }
  };

  const handleBlurQuantity = (detalleId: number) => {
    setDetallesState((prev) =>
      prev.map((d) =>
        d.detalleId === detalleId && d.cantidadRecibida === ""
          ? { ...d, cantidadRecibida: 0 }
          : d
      )
    );
  };

  const isRecepcionEditable = traslado.estado === EstadoTraslado.ENVIADO;
  const isEliminarAllowed = traslado.estado === EstadoTraslado.SOLICITADO;


  const handleAction = async () => {
    await onRecibir({
      trasladoId: traslado.id,
      detalles: detallesState.map((d) => ({
        detalleId: d.detalleId,
        cantidadRecibida: typeof d.cantidadRecibida === "number" ? d.cantidadRecibida : 0,
      })),
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-3 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="px-6 py-4 bg-beige/60 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-black text-dark tracking-tight">
            Solicitud #{traslado.id}
          </span>
          <BadgeEstadoTraslado estado={traslado.estado} />
          <span className="inline-flex items-center gap-1.5 text-xs text-dark-3 font-bold">
            <Building2 size={14} className="text-yellow-dark" />
            Solicitado a: {traslado.sedeProveedora?.nombre || `Sede ${traslado.sedeProveedoraId}`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-dark-5">
          {isEliminarAllowed && (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="px-3 py-1.5 rounded-xl text-red hover:bg-red-light-6 transition duration-200 border border-red/30 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Eliminar Solicitud"
            >
              <Trash2 size={15} />
              <span>Eliminar Solicitud</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            {new Date(traslado.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>


      <div className="p-6">
        {(() => {
          const hasLente = traslado.detalles?.some(
            (d) => d.tipoProducto === "LENTE" || d.stockId != null
          );

          return (
            <div className="border border-gray-3 rounded-xl overflow-hidden mb-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-beige/40 text-dark-3 font-black uppercase text-[10px] tracking-wider border-b border-gray-3">
                    <th className="p-3.5">Código / Nombre</th>
                    <th className="p-3.5 text-center">Marca</th>
                    <th className="p-3.5 text-center">Material</th>
                    <th className="p-3.5 text-center">Tipo</th>
                    {hasLente && (
                      <>
                        <th className="p-3.5 text-center">SPH</th>
                        <th className="p-3.5 text-center">CYL</th>
                      </>
                    )}
                    <th className="p-3.5 text-center">📥 Cant. Solicitada</th>
                    <th className="p-3.5 text-center">🚚 Cant. Enviada</th>
                    <th className="p-3.5 text-center">✅ Cant. Recibida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-2 text-dark font-medium">
                  {traslado.detalles?.map((det) => {
                    const stateItem = detallesState.find((s) => s.detalleId === det.id);

                    const codigoVal =
                      det.producto?.montura?.codigo ||
                      det.producto?.accesorio?.codigoAccesorio ||
                      det.producto?.accesorio?.nombre ||
                      det.producto?.nombre ||
                      "-";

                    const marcaVal =
                      det.producto?.montura?.marca ||
                      det.producto?.accesorio?.marca ||
                      det.stock?.lente?.marca ||
                      "-";

                    const materialVal =
                      det.producto?.montura?.material ||
                      det.producto?.accesorio?.material ||
                      det.stock?.lente?.material ||
                      "-";

                    const isLente = det.tipoProducto === "LENTE";
                    const sphVal = isLente ? (det.stock?.esf ?? "-") : "-";
                    const cylVal = isLente ? (det.stock?.cyl ?? "-") : "-";

                    return (
                      <tr key={det.id} className="hover:bg-beige/20">
                        <td className="p-3.5 font-bold uppercase text-dark">
                          {codigoVal}
                        </td>
                        <td className="p-3.5 text-center uppercase font-bold text-dark-3">
                          {marcaVal}
                        </td>
                        <td className="p-3.5 text-center uppercase font-bold text-dark-3">
                          {materialVal}
                        </td>
                        <td className="p-3.5 text-center text-[10px] font-bold text-dark-5">
                          {det.tipoProducto}
                        </td>
                        {hasLente && (
                          <>
                            <td className="p-3.5 text-center font-bold text-dark text-xs">
                              {sphVal}
                            </td>
                            <td className="p-3.5 text-center font-bold text-dark text-xs">
                              {cylVal}
                            </td>
                          </>
                        )}
                        <td className="p-3.5 text-center font-bold text-dark-3 text-xs">
                          {det.cantidadSolicitada}
                        </td>
                        <td className="p-3.5 text-center font-bold text-dark-3 text-xs">
                          {det.cantidadEnviada}
                        </td>
                        <td className="p-3.5 text-center font-bold text-dark-3 text-xs">
                          {isRecepcionEditable ? (
                            <div className="flex items-center justify-center">
                              <input
                                type="number"
                                min={0}
                                value={stateItem?.cantidadRecibida ?? 0}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) =>
                                  handleCantidadChange(det.id, e.target.value)
                                }
                                onBlur={() => handleBlurQuantity(det.id)}
                                className="w-24 h-9 px-2.5 text-center font-black text-xs text-dark border-2 border-blue-light/50 rounded-xl bg-white focus:border-blue-light focus:ring-2 focus:ring-blue-light/20 outline-none shadow-sm transition-all hover:border-blue-light cursor-pointer"

                              />
                            </div>
                          ) : (
                            det.cantidadRecibida
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}



        {isRecepcionEditable && (
          <div className="flex justify-center w-full pt-4 pb-2 max-w-xs mx-auto">
            <BaseButton
              onClick={handleAction}
              disabled={loading}
              loading={loading}
              variant="primary"
            >
              Confirmar Recepción
            </BaseButton>
          </div>
        )}

        <ConfirmModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={async () => {
            setShowConfirmDelete(false);
            if (onEliminar) await onEliminar(traslado.id);
          }}
          title="Eliminar Solicitud"
          message={`¿Estás seguro de eliminar la solicitud de traslado #${traslado.id}? Esta acción no se puede deshacer.`}
          variant="danger"
        />
      </div>
    </div>
  );
}

interface SolicitanteProps {
  userSedeId: number;
  userId: number;
  onSuccessAction: () => void;
  onErrorAction: (err: any) => void;
}

export function Solicitante({
  userSedeId,
  onSuccessAction,
  onErrorAction,
}: SolicitanteProps) {
  const { traslados, loading, getTraslados, recibirMercaderia, eliminarTraslado } = useTraslados();
  const [estadoFilter, setEstadoFilter] = useState<EstadoTraslado>(EstadoTraslado.SOLICITADO);

  const fetchTraslados = () => {
    if (userSedeId) {
      getTraslados({
        sedeSolicitanteId: userSedeId,
        estado: estadoFilter,
      });
    }
  };

  useEffect(() => {
    fetchTraslados();
  }, [userSedeId, estadoFilter]);

  const handleRecibir = async (payload: any) => {
    try {
      await recibirMercaderia(payload);
      onSuccessAction();
      setEstadoFilter(EstadoTraslado.TRASLADADO);
    } catch (err) {
      onErrorAction(err);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarTraslado(id);
      onSuccessAction();
      fetchTraslados();
    } catch (err) {
      onErrorAction(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[EstadoTraslado.SOLICITADO, EstadoTraslado.ENVIADO, EstadoTraslado.TRASLADADO].map((st) => (
          <button
            key={st}
            onClick={() => setEstadoFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              estadoFilter === st
                ? "bg-white border-blue-light text-blue-light shadow-sm"
                : "bg-white/60 border-gray-3 text-dark-5 hover:bg-white"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {estadoFilter === EstadoTraslado.TRASLADADO ? (

        <TablaSolicitanteHistorial traslados={traslados} loading={loading} />
      ) : loading ? (
        <div className="w-full bg-white rounded-2xl border border-gray-3 p-12 text-center text-dark-5 font-bold uppercase text-xs tracking-wider">
          Cargando solicitudes...
        </div>
      ) : traslados.length === 0 ? (
        <div className="w-full bg-white rounded-2xl border border-gray-3 p-12 text-center text-dark-5 font-bold uppercase text-xs tracking-wider">
          No se encontraron solicitudes para esta vista
        </div>
      ) : (
        <div className="space-y-4">
          {traslados.map((t) => (
            <SolicitanteCard
              key={t.id}
              traslado={t}
              onRecibir={handleRecibir}
              onEliminar={handleEliminar}
              loading={loading}
            />
          ))}
        </div>
      )}

      <LoadingModal isOpen={loading} />
    </div>
  );
}

