"use client";

import React, { useState, useEffect } from "react";
import { ITraslado } from "@/types/traslados";
import { useTraslados } from "@/hooks/traslados/useTraslados";
import { BadgeEstadoTraslado } from "../BadgeEstadoTraslado";
import { TablaProveedorHistorial } from "./TablaProveedorHistorial";
import { Building2, Calendar } from "lucide-react";

interface ProveedorCardProps {
  traslado: ITraslado;
  onEnviar: (payload: any) => Promise<void>;
}

function ProveedorCard({ traslado, onEnviar }: ProveedorCardProps) {
  const [detallesState, setDetallesState] = useState<
    { detalleId: number; cantidadEnviada: number | "" }[]
  >([]);

  useEffect(() => {
    if (traslado && traslado.detalles) {
      setDetallesState(
        traslado.detalles.map((d) => ({
          detalleId: d.id,
          cantidadEnviada: d.cantidadEnviada > 0 ? d.cantidadEnviada : d.cantidadSolicitada,
        }))
      );
    }
  }, [traslado]);

  const handleCantidadChange = (detalleId: number, rawVal: string) => {
    if (rawVal === "") {
      setDetallesState((prev) =>
        prev.map((d) => (d.detalleId === detalleId ? { ...d, cantidadEnviada: "" } : d))
      );
      return;
    }

    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed)) {
      setDetallesState((prev) =>
        prev.map((d) =>
          d.detalleId === detalleId ? { ...d, cantidadEnviada: Math.max(0, parsed) } : d
        )
      );
    }
  };

  const handleBlurQuantity = (detalleId: number) => {
    setDetallesState((prev) =>
      prev.map((d) =>
        d.detalleId === detalleId && d.cantidadEnviada === ""
          ? { ...d, cantidadEnviada: 0 }
          : d
      )
    );
  };

  const isDespachoEditable = traslado.estado === "SOLICITADO";

  const handleAction = async () => {
    await onEnviar({
      trasladoId: traslado.id,
      detalles: detallesState.map((d) => ({
        detalleId: d.detalleId,
        cantidadEnviada: typeof d.cantidadEnviada === "number" ? d.cantidadEnviada : 0,
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
            <Building2 size={14} className="text-emerald-700" />
            Solicitado por Sede Destino: {traslado.sedeSolicitante?.nombre || `Sede ${traslado.sedeSolicitanteId}`}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-dark-5">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            {new Date(traslado.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="border border-gray-3 rounded-xl overflow-hidden mb-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-beige/40 text-dark-3 font-black uppercase text-[10px] tracking-wider border-b border-gray-3">
                <th className="p-3.5">Producto / Descripción</th>
                <th className="p-3.5 text-center">Tipo</th>
                <th className="p-3.5 text-center">SPH</th>
                <th className="p-3.5 text-center">CYL</th>
                <th className="p-3.5 text-center">📥 Cant. Solicitada</th>
                <th className="p-3.5 text-center">🚚 Cant. Enviada</th>
                <th className="p-3.5 text-center">✅ Cant. Recibida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-2 text-dark font-medium">
              {traslado.detalles?.map((det) => {
                const stateItem = detallesState.find((s) => s.detalleId === det.id);
                const nombre =
                  det.producto?.nombre ||
                  det.producto?.montura?.codigo ||
                  det.producto?.accesorio?.nombre ||
                  `Lente ${det.stock?.lente?.marca || ""}`;

                const sphVal = det.stock?.esf ?? "-";
                const cylVal = det.stock?.cyl ?? "-";

                return (
                  <tr key={det.id} className="hover:bg-beige/20">
                    <td className="p-3.5 font-bold uppercase text-dark">
                      {nombre}
                    </td>
                    <td className="p-3.5 text-center text-[10px] font-bold text-dark-5">
                      {det.tipoProducto}
                    </td>
                    <td className="p-3.5 text-center font-bold text-dark text-xs">
                      {sphVal}
                    </td>
                    <td className="p-3.5 text-center font-bold text-dark text-xs">
                      {cylVal}
                    </td>
                    <td className="p-3.5 text-center font-bold text-dark-3 text-xs">
                      {det.cantidadSolicitada}
                    </td>
                    <td className="p-3.5 text-center font-bold text-dark-3 text-xs">
                      {isDespachoEditable ? (
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min={0}
                            value={stateItem?.cantidadEnviada ?? 0}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) =>
                              handleCantidadChange(det.id, e.target.value)
                            }
                            onBlur={() => handleBlurQuantity(det.id)}
                            className="w-16 h-9 px-2 text-center font-black text-xs text-dark border-2 border-blue-light/50 rounded-xl bg-white focus:border-blue-light focus:ring-2 focus:ring-blue-light/20 outline-none shadow-sm transition-all hover:border-blue-light cursor-pointer"
                          />
                        </div>
                      ) : (
                        det.cantidadEnviada
                      )}
                    </td>
                    <td className="p-3.5 text-center font-bold text-dark-3 text-xs">
                      {det.cantidadRecibida}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isDespachoEditable && (
          <div className="flex justify-center w-full pt-4 pb-2">
            <button
              onClick={handleAction}
              className="bg-yellow hover:bg-yellow-dark text-dark font-black px-10 py-3.5 rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
            >
              Enviar Mercadería
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProveedorProps {
  userSedeId: number;
  onSuccessAction: () => void;
  onErrorAction: (err: any) => void;
}

export function Proveedor({
  userSedeId,
  onSuccessAction,
  onErrorAction,
}: ProveedorProps) {
  const { traslados, loading, getTraslados, enviarMercaderia } = useTraslados();
  const [estadoFilter, setEstadoFilter] = useState<string>("SOLICITADO");

  const fetchTraslados = () => {
    if (userSedeId) {
      getTraslados({
        sedeProveedoraId: userSedeId,
        estado: estadoFilter as any,
      });
    }
  };

  useEffect(() => {
    fetchTraslados();
  }, [userSedeId, estadoFilter]);

  const handleEnviar = async (payload: any) => {
    try {
      await enviarMercaderia(payload);
      onSuccessAction();
      fetchTraslados();
    } catch (err) {
      onErrorAction(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros por estado */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {["SOLICITADO", "ENVIADO", "TRASLADADO"].map((st) => (
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

      {/* Si el filtro es TRASLADADO -> renderizar Tabla Compacta */}
      {estadoFilter === "TRASLADADO" ? (
        <TablaProveedorHistorial traslados={traslados} loading={loading} />
      ) : loading ? (
        <div className="w-full bg-white rounded-2xl border border-gray-3 p-12 text-center text-dark-5 font-bold uppercase text-xs tracking-wider">
          Cargando despachos...
        </div>
      ) : traslados.length === 0 ? (
        <div className="w-full bg-white rounded-2xl border border-gray-3 p-12 text-center text-dark-5 font-bold uppercase text-xs tracking-wider">
          No se encontraron solicitudes para esta vista
        </div>
      ) : (
        <div className="space-y-4">
          {traslados.map((t) => (
            <ProveedorCard
              key={t.id}
              traslado={t}
              onEnviar={handleEnviar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
