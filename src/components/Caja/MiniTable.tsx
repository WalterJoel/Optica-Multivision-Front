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
import { ITEMS_PER_PAGE, TipoVenta, TipoCliente } from "@/commons/constants";
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
  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return data;

    return data.filter((m) => {
      const clienteNombre = m.venta?.cliente
        ? m.venta.cliente.tipoCliente === TipoCliente.EMPRESA
          ? (m.venta.cliente.razonSocial).toLowerCase()
          : `${m.venta.cliente.nombres} ${m.venta.cliente.apellidos}`.toLowerCase()
        : "";

      return (
        (m.descripcion || "").toLowerCase().includes(term) ||
        (m.metodoPago || "").toLowerCase().includes(term) ||
        String(m.id || "").includes(term) ||
        clienteNombre.includes(term)
      );
    });
  }, [data, searchTerm]);

  const totalMontoFiltrado = useMemo(() => {
    return filteredData.reduce((acc, m) => acc + Number(m.monto || 0), 0);
  }, [filteredData]);

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
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-2 bg-white flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2 h-2 rounded-full ${type === "ingreso" ? "bg-emerald-500" : "bg-red"
                } animate-pulse`}
            />
            <h3 className="text-[11px] font-black text-dark-2 uppercase tracking-[1.5px]">
              {titulo} ({filteredData.length})
            </h3>

            {/* BADGE DE SUMA TOTAL COMPUTADA DE LAS VENTAS FILTRADAS */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-light/10 text-blue border border-blue-light/20 shadow-xs uppercase tracking-wider">
              Total: S/. {totalMontoFiltrado.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center bg-beige-dark/40 rounded-xl px-2.5 py-1 border border-transparent focus-within:border-blue-light-3 transition-all">
          <Search size={13} className="text-blue-light-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filtrar historial..."
            className="bg-transparent text-[10px] ml-1.5 outline-none w-32 text-dark-3 font-medium placeholder:text-gray-5"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-spacing-0">
          <thead>
            <tr className="bg-beige text-[9px] font-black text-dark-3 uppercase tracking-[0.15em] border-b border-gray-3">
              <th className="px-3 py-2">Concepto / Responsable</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2 text-center">Tipo Venta</th>
              <th className="px-3 py-2 text-center">Método</th>
              <th className="px-3 py-2 text-center">Fecha / Hora</th>
              <th className="px-3 py-2 text-right">Monto Recibido</th>
              <th className="px-3 py-2 text-right">Deuda</th>
              <th className="px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-2 bg-white">
            {paginatedData.map((m) => {
              const date = new Date(m.createdAt);
              const montoRecibido = Number(m.monto || 0);
              const deuda = m.venta ? Number(m.venta.deuda || 0) : 0;
              const esCredito = m.venta ? (m.venta.tipoVenta || "").toUpperCase() === TipoVenta.CREDITO : false;

              const clienteNombre = m.venta?.cliente
                ? m.venta.cliente.tipoCliente === TipoCliente.EMPRESA
                  ? m.venta.cliente.razonSocial
                  : `${m.venta.cliente.nombres} ${m.venta.cliente.apellidos}`.trim()
                : null;

              return (
                <tr
                  key={m.id}
                  className="hover:bg-beige/40 transition-colors group text-[11px]"
                >
                  {/* CONCEPTO */}
                  <td className="px-3 py-1.5">
                    <span className="font-bold text-dark text-[11px] uppercase group-hover:text-blue transition-colors">
                      {m.descripcion}
                    </span>
                  </td>

                  {/* CLIENTE */}
                  <td className="px-3 py-1.5">
                    {clienteNombre ? (
                      <span className="font-bold text-dark text-[11px] uppercase">
                        {clienteNombre}
                      </span>
                    ) : (
                      <span className="text-gray-4 font-semibold">—</span>
                    )}
                  </td>

                  {/* TIPO VENTA */}
                  <td className="px-3 py-1.5 text-center">
                    {m.venta ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-[0.08em] border shadow-xs ${esCredito
                          ? "bg-blue-light-6 text-blue border-blue-light-5"
                          : "bg-green-light-6 text-green-dark border-green-light-5"
                          }`}
                      >
                        {m.venta.tipoVenta}
                      </span>
                    ) : (
                      <span className="text-gray-4 font-semibold">—</span>
                    )}
                  </td>

                  {/* METODO */}
                  <td className="px-3 py-1.5 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-gray-3 shadow-xs">
                      {m.metodoPago === "EFECTIVO" ? (
                        <Wallet size={11} className="text-yellow-dark" />
                      ) : (
                        <CreditCard size={11} className="text-blue-light" />
                      )}
                      <span className="text-[9px] font-black text-dark-4 uppercase tracking-wider">
                        {m.metodoPago || "OTRO"}
                      </span>
                    </div>
                  </td>

                  {/* FECHA / HORA */}
                  <td className="px-3 py-1.5 text-center">
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-dark text-[11px]">
                        {formatToPeruDateString(date)}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono font-bold">
                        {formatToPeruTimeString(date)}
                      </span>
                    </div>
                  </td>

                  {/* MONTO RECIBIDO */}
                  <td className="px-3 py-1.5 text-right font-semibold text-dark-3 text-[11px]">
                    S/. {montoRecibido.toFixed(2)}
                  </td>

                  {/* DEUDA */}
                  <td className="px-3 py-1.5 text-right text-[11px]">
                    <span
                      className={`font-bold ${deuda > 0 ? "text-red-dark" : "text-gray-4"
                        }`}
                    >
                      {deuda > 0 ? `S/. ${deuda.toFixed(2)}` : "—"}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="px-3 py-1.5 text-center">
                    {m.ventaId ? (
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(m)}
                        className="p-1 rounded-md bg-blue/10 text-blue hover:bg-blue hover:text-white transition-all shadow-xs border border-blue/20 cursor-pointer inline-flex items-center justify-center"
                        title="Ver detalle de venta"
                      >
                        <Eye size={13} />
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
                  colSpan={8}
                  className="px-3 py-5 text-center text-xs font-bold text-gray-4 uppercase tracking-wider"
                >
                  No hay movimientos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-4 py-2.5 bg-beige border-t border-gray-2 flex justify-between items-center">
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
