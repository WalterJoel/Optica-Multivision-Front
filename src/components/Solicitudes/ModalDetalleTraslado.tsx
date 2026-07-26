"use client";

import React from "react";
import { ITraslado } from "@/types/traslados";
import { X, Building2, Calendar, FileText } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { BadgeEstadoTraslado } from "./BadgeEstadoTraslado";

interface ModalDetalleTrasladoProps {
  isOpen: boolean;
  traslado: ITraslado | null;
  onClose: () => void;
}

export function ModalDetalleTraslado({
  isOpen,
  traslado,
  onClose,
}: ModalDetalleTrasladoProps) {
  if (!isOpen || !traslado) return null;

  return (
    <ModalFrameWrapper size="xl" variant="blue" onClose={onClose}>
      <div className="flex flex-col space-y-6">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-light/10 text-blue-light flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-dark uppercase tracking-tight">
                  Detalle de Solicitud #{traslado.id}
                </h3>
                <BadgeEstadoTraslado estado={traslado.estado} />
              </div>
              <p className="text-xs text-dark-5 font-semibold mt-0.5">
                Origen: {traslado.origenSolicitud || "REPORTE_VENTAS"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-5 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Resumen de Sedes y Fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-beige/60 p-4 rounded-2xl border border-gray-3 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-dark-5">Sede Proveedora</span>
            <span className="font-bold text-dark uppercase mt-0.5 flex items-center gap-1">
              <Building2 size={13} className="text-yellow-dark" />
              {traslado.sedeProveedora?.nombre || `Sede #${traslado.sedeProveedoraId}`}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-dark-5">Sede Solicitante</span>
            <span className="font-bold text-dark uppercase mt-0.5 flex items-center gap-1">
              <Building2 size={13} className="text-emerald-700" />
              {traslado.sedeSolicitante?.nombre || `Sede #${traslado.sedeSolicitanteId}`}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-dark-5">Fecha Creación</span>
            <span className="font-bold text-dark uppercase mt-0.5 flex items-center gap-1">
              <Calendar size={13} className="text-blue-light" />
              {new Date(traslado.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tabla de Productos con SPH y CYL */}
        <div className="border border-gray-3 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-beige text-dark-3 font-black uppercase text-[10px] tracking-wider border-b border-gray-3">
                <th className="p-3.5">Producto / Descripción</th>
                <th className="p-3.5 text-center">Tipo</th>
                <th className="p-3.5 text-center">SPH</th>
                <th className="p-3.5 text-center">CYL</th>
                <th className="p-3.5 text-center">📥 Solicitada</th>
                <th className="p-3.5 text-center">🚚 Enviada</th>
                <th className="p-3.5 text-center">✅ Recibida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-2 text-dark font-medium">
              {traslado.detalles?.map((det) => {
                const nombreItem =
                  det.producto?.nombre ||
                  det.producto?.montura?.codigo ||
                  det.producto?.accesorio?.nombre ||
                  `Lente ${det.stock?.lente?.marca || ""}`;

                const sphVal = det.stock?.esf ?? "-";
                const cylVal = det.stock?.cyl ?? "-";

                return (
                  <tr key={det.id} className="hover:bg-beige/40">
                    <td className="p-3.5 font-bold uppercase text-dark">
                      {nombreItem}
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
                      {det.cantidadEnviada}
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

        {traslado.observaciones && (
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-2 text-xs text-dark-3">
            <span className="font-bold block text-[10px] uppercase text-dark-5 mb-0.5">Observaciones:</span>
            {traslado.observaciones}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-3 text-xs font-bold text-dark hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ModalFrameWrapper>
  );
}
