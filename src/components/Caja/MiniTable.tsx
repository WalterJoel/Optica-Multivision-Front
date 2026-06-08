"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Search,
  Wallet,
  Eye,
} from "lucide-react";
import { formatToPeruDateString, formatToPeruTimeString } from "@/utils/date";
import DetalleVentaModal from "./DetalleVentaModal";

export const MiniTable = ({
  titulo,
  data,
  type,
}: {
  titulo: string;
  data: any[];
  type: "ingreso" | "egreso";
}) => {
  const [selectedMov, setSelectedMov] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (m: any) => {
    setSelectedMov(m);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-[24px] border border-blue-light-5 shadow-testimonial overflow-hidden flex flex-col transition-all hover:shadow-2">
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-2 bg-white">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              type === "ingreso" ? "bg-green" : "bg-red"
            } animate-pulse`}
          />
          <h3 className="text-[12px] font-black text-dark-2 uppercase tracking-[2px]">
            {titulo}
          </h3>
        </div>

        <div className="flex items-center bg-beige-dark/40 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-light-3 transition-all">
          <Search size={14} className="text-blue-light-2" />
          <input
            type="text"
            placeholder="Filtrar historial..."
            className="bg-transparent text-[11px] ml-2 outline-none w-28 text-dark-3 font-medium placeholder:text-gray-5"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-beige text-[10px] font-black text-blue uppercase tracking-widest">
              <th className="py-4 px-7">Concepto / Responsable</th>
              <th className="py-4 px-6 text-center">Metodo</th>
              <th className="py-4 px-6 text-center">Fecha / Hora</th>
              <th className="py-4 px-7 text-right">Monto Neto</th>
            </tr>
          </thead>

          <tbody className="divide-y-8 divide-beige">
            {data.map((m) => {
              const date = new Date(m.createdAt);

              return (
                <tr
                  key={m.id}
                  className="hover:bg-blue-ligh-6/30 transition-colors group"
                >
                  {/* CONCEPTO */}
                  <td className="py-5 px-7">
                    <div className="flex flex-col ">
                      <span className="text-[15px] uppercase font-bold text-dark group-hover:text-blue transition-colors">
                        {m.descripcion}
                      </span>
                    </div>
                  </td>

                  {/* METODO */}
                  <td className="py-5 px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-light-5 shadow-sm">
                      {m.metodoPago === "EFECTIVO" ? (
                        <Wallet size={12} className="text-yellow-dark" />
                      ) : (
                        <CreditCard size={12} className="text-blue-light" />
                      )}
                      <span className="text-[10px] font-black text-dark-4 uppercase">
                        {m.metodoPago || "OTRO"}
                      </span>
                    </div>
                  </td>

                  {/* FECHA / HORA */}
                  <td className="py-5 px-6 text-center">
                    <div className="flex flex-col leading-tight">
                      <span className="text-[15px] font-bold text-dark">
                        {formatToPeruDateString(date)}
                      </span>
                      <span className="text-[13px] text-blue-light font-black">
                        {formatToPeruTimeString(date)}
                      </span>
                    </div>
                  </td>

                  {/* MONTO */}
                  <td className="py-5 px-7 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-[15px] font-black tracking-tighter ${
                            type === "ingreso" ? "text-green" : "text-red"
                          }`}
                        >
                          S/ {Number(m.monto).toFixed(2)}
                        </span>
                      </div>

                      {m.ventaId && (
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(m)}
                          className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark cursor-pointer flex items-center justify-center"
                          title="Ver detalle de productos"
                        >
                          <Eye size={16} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-7 py-4 bg-beige border-t border-gray-2 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-4 uppercase tracking-[2px]">
          Página <span className="text-dark">01</span> de 12
        </span>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 transition-all">
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
