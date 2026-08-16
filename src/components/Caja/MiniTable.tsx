"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Search,
  Wallet,
  Eye,
} from "lucide-react";
import { formatToPeruDateString, formatToPeruTimeString } from "@/utils/date";
import { ITEMS_PER_PAGE } from "@/commons/constants";
import DetalleVentaModal from "./DetalleVentaModal";

export const MiniTable = ({
  titulo,
  data = [],
  type,
}: {
  titulo: string;
  data: any[];
  type: "ingreso" | "egreso";
}) => {
  const [selectedMov, setSelectedMov] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenDetails = (m: any) => {
    setSelectedMov(m);
    setIsModalOpen(true);
  };

  // Filtrado y paginación
  const term = searchTerm.trim().toLowerCase();
  const filteredData = !term
    ? data
    : data.filter(
        (m) =>
          (m.descripcion || "").toLowerCase().includes(term) ||
          (m.metodoPago || "").toLowerCase().includes(term) ||
          String(m.id || "").includes(term)
      );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-3 shadow-sm overflow-hidden flex flex-col relative transition-all">
      {/* HEADER */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-2 bg-white flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${type === "ingreso" ? "bg-emerald-500" : "bg-red"
                } animate-pulse`}
            />
            <h3 className="text-[12px] font-black text-dark-2 uppercase tracking-[2px]">
              {titulo} ({filteredData.length})
            </h3>
          </div>
        </div>

        <div className="flex items-center bg-beige-dark/40 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-light-3 transition-all">
          <Search size={14} className="text-blue-light-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filtrar historial..."
            className="bg-transparent text-[11px] ml-2 outline-none w-36 text-dark-3 font-medium placeholder:text-gray-5"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-spacing-0">
          <thead>
            <tr className="bg-beige text-[10px] font-black text-dark-3 uppercase tracking-[0.2em] border-b border-gray-3">
              <th className="px-6 py-4">Concepto / Responsable</th>
              <th className="px-6 py-4 text-center">Método</th>
              <th className="px-6 py-4 text-center">Fecha / Hora</th>
              <th className="px-6 py-4 text-right">Monto Recibido</th>
              <th className="px-6 py-4 text-right">Deuda</th>
              <th className="px-6 py-4 text-right">Monto Neto</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-2 bg-white">
            {paginatedData.map((m) => {
              const date = new Date(m.createdAt);
              const montoRecibido = Number(m.monto || 0);
              const deuda = m.venta ? Number(m.venta.deuda || 0) : 0;
              const montoNeto = m.venta
                ? Number(m.venta.total || 0) - Number(m.venta.deuda || 0)
                : Number(m.monto || 0);

              return (
                <tr
                  key={m.id}
                  className="hover:bg-beige/40 transition-colors group text-xs"
                >
                  {/* CONCEPTO */}
                  <td className="px-6 py-3.5">
                    <span className="font-bold text-dark text-xs uppercase group-hover:text-blue transition-colors">
                      {m.descripcion}
                    </span>
                  </td>

                  {/* METODO */}
                  <td className="px-6 py-3.5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-3 shadow-xs">
                      {m.metodoPago === "EFECTIVO" ? (
                        <Wallet size={12} className="text-yellow-dark" />
                      ) : (
                        <CreditCard size={12} className="text-blue-light" />
                      )}
                      <span className="text-[10px] font-black text-dark-4 uppercase tracking-wider">
                        {m.metodoPago || "OTRO"}
                      </span>
                    </div>
                  </td>

                  {/* FECHA / HORA */}
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-dark text-xs">
                        {formatToPeruDateString(date)}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono font-bold mt-0.5">
                        {formatToPeruTimeString(date)}
                      </span>
                    </div>
                  </td>

                  {/* MONTO RECIBIDO */}
                  <td className="px-6 py-3.5 text-right font-semibold text-dark-3">
                    S/. {montoRecibido.toFixed(2)}
                  </td>

                  {/* DEUDA */}
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`font-bold ${deuda > 0 ? "text-red-dark" : "text-gray-4"
                        }`}
                    >
                      {deuda > 0 ? `S/. ${deuda.toFixed(2)}` : "—"}
                    </span>
                  </td>

                  {/* MONTO NETO */}
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`font-black text-[13px] tracking-tight ${type === "ingreso" ? "text-emerald-600" : "text-red"
                        }`}
                    >
                      S/. {montoNeto.toFixed(2)}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-3.5 text-center">
                    {m.ventaId ? (
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(m)}
                        className="p-1.5 rounded-xl bg-blue/10 text-blue hover:bg-blue hover:text-white transition-all shadow-xs border border-blue/20 cursor-pointer inline-flex items-center justify-center"
                        title="Ver detalle de venta"
                      >
                        <Eye size={15} />
                      </button>
                    ) : (
                      <span className="text-gray-4 font-semibold">—</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-xs font-bold text-gray-4 uppercase tracking-wider"
                >
                  No hay movimientos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-7 py-4 bg-beige border-t border-gray-2 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-4 uppercase tracking-[2px]">
          Página <span className="text-dark">{String(currentPage).padStart(2, "0")}</span> de{" "}
          {String(totalPages).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <DetalleVentaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movimiento={selectedMov}
      />
    </div>
  );
};
