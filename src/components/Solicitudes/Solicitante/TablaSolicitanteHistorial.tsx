"use client";

import React, { useState, useMemo } from "react";
import { ITraslado } from "@/types/traslados";
import { Search, Eye, CheckCircle2, Building2, Calendar } from "lucide-react";
import { ModalDetalleTraslado } from "../ModalDetalleTraslado";

interface TablaSolicitanteHistorialProps {
  traslados: ITraslado[];
  loading?: boolean;
}

export function TablaSolicitanteHistorial({
  traslados,
  loading = false,
}: TablaSolicitanteHistorialProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTraslado, setSelectedTraslado] = useState<ITraslado | null>(null);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return traslados;
    const term = searchTerm.toLowerCase().trim();
    return traslados.filter((t) => {
      const idStr = `#${t.id}`.toLowerCase();
      const sede = (t.sedeProveedora?.nombre || "").toLowerCase();
      const fecha = new Date(t.createdAt).toLocaleDateString().toLowerCase();
      return idStr.includes(term) || sede.includes(term) || fecha.includes(term);
    });
  }, [traslados, searchTerm]);

  return (
    <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col my-4">
      {/* Barra superior */}
      <div className="px-5 py-4 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span className="text-xs font-black uppercase text-dark tracking-wider">
            Histórico de Traslados Completados ({filteredData.length})
          </span>
        </div>

        <div className="flex items-center bg-beige-dark/40 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
          <Search size={15} className="text-blue-light-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, sede proveedora o fecha..."
            className="bg-transparent text-xs ml-2 outline-none w-64 text-dark-3 font-semibold placeholder:text-gray-5"
          />
        </div>
      </div>

      {/* Tabla Compacta */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-spacing-0">
          <thead>
            <tr className="bg-beige text-dark-3 font-black uppercase text-[10px] tracking-wider border-b border-gray-3">
              <th className="px-4 py-3 text-center w-12">N°</th>
              <th className="px-4 py-3">ID Solicitud</th>
              <th className="px-4 py-3">Fecha de Creación</th>
              <th className="px-4 py-3">Solicitado a (Proveedora)</th>
              <th className="px-4 py-3 text-center">Ítems Solicitados</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-2 text-dark font-medium">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 font-bold uppercase text-xs">
                  Cargando historial...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 font-bold uppercase text-xs">
                  No hay traslados completados en el historial
                </td>
              </tr>
            ) : (
              filteredData.map((t, index) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTraslado(t)}
                  className="hover:bg-beige/40 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 text-center font-bold text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-black text-dark text-xs">
                    #{t.id}
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-dark-3 uppercase">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={13} className="text-yellow-dark" />
                      {t.sedeProveedora?.nombre || `Sede #${t.sedeProveedoraId}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-blue-light text-xs">
                    {t.detalles?.length || 0} producto(s)
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 size={12} /> Trasladado
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTraslado(t);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-light/10 text-blue-light hover:bg-blue-light hover:text-white font-bold text-[11px] transition-all shadow-sm cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>Ver Detalle</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalDetalleTraslado
        isOpen={!!selectedTraslado}
        traslado={selectedTraslado}
        onClose={() => setSelectedTraslado(null)}
      />
    </div>
  );
}
