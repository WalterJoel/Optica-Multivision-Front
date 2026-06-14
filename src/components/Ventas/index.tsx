"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Calendar, FileSpreadsheet, Loader2 } from "lucide-react";
import { MiniTable } from "./MiniTable";

import { useSales, useAnularVenta, useProductosVendidos } from "@/hooks/sales";
import { useSessionUser } from "@/hooks/session";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { getLocalDateString } from "@/utils/date";
import { SedeSelect } from "@/components/Common/SedeSelect";

export default function CajaPremiumFino() {
  // Hooks
  const { sedeId: userSedeId } = useSessionUser();
  const [sedeId, setSedeId] = useState<number>(1);

  const today = getLocalDateString();
  const [fechaInicio, setFechaInicio] = useState<string>(today);
  const [fechaFin, setFechaFin] = useState<string>(today);

  const { getAllSales, sales, loading } = useSales(sedeId);
  const {
    anularVenta,
    loading: isAnnulling,
    success: annulOk,
    statusMessage: annulMsg,
  } = useAnularVenta();

  const { descargarReporteProductosVendidos, loading: isGeneratingReport } =
    useProductosVendidos();

  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  // Sincronizar la sede inicial del usuario
  useEffect(() => {
    if (userSedeId) {
      setSedeId(userSedeId);
    }
  }, [userSedeId]);

  // Ejecutar búsqueda cuando cambien los filtros
  useEffect(() => {
    if (sedeId) {
      getAllSales(fechaInicio, fechaFin);
    }
  }, [sedeId, fechaInicio, fechaFin]);

  useEffect(() => {
    if (!isAnnulling && (annulOk || annulMsg)) {
      setTypeModal(
         annulOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setModalMsg(annulMsg);
      setOpenModal(true);
      if (annulOk && sedeId) {
        getAllSales(fechaInicio, fechaFin);
      }
    }
  }, [isAnnulling, annulOk, annulMsg]);

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <TrendingUp size={26} className="text-blue-light" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-[5px] bg-yellow-dark" />
                <p className="text-[10px] sm:text-[11px] font-black text-blue-light uppercase tracking-[3px]">
                  Resumen
                </p>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark tracking-tighter uppercase leading-none">
                Resumen de{" "}
                <span className="text-blue-light italic">Ventas</span>
              </h1>
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
            {/* BOTÓN DESCARGAR REPORTE EXCEL */}
            <button
              onClick={() => descargarReporteProductosVendidos(sedeId, fechaInicio, fechaFin)}
              disabled={isGeneratingReport}
              className="flex items-center justify-center gap-3 bg-white border-2 border-blue-light-4 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all font-bold text-[13px] text-dark w-full sm:w-auto shrink-0 cursor-pointer disabled:opacity-60"
              title="Descargar reporte de productos vendidos en Excel"
            >
              {isGeneratingReport ? (
                <Loader2 size={16} className="animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet size={16} className="text-emerald-600" />
              )}
              <span className="uppercase tracking-wide">
                {isGeneratingReport ? "Generando..." : "Reporte Excel"}
              </span>
            </button>

            {/* SEDE */}
            <SedeSelect value={sedeId} onChange={setSedeId} />

            {/* FECHA INICIO */}
            <div className="flex items-center gap-3 bg-white border-2 border-blue-light-4 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
              <Calendar size={18} className="text-blue-light" />
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="bg-transparent outline-none text-[13px] font-bold text-dark w-full cursor-pointer"
              />
            </div>

            {/* FECHA FIN */}
            <div className="flex items-center gap-3 bg-white border-2 border-blue-light-4 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
              <Calendar size={18} className="text-blue-light" />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="bg-transparent outline-none text-[13px] font-bold text-dark w-full cursor-pointer"
              />
            </div>
          </div>
        </header>

        {/* TABLAS */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 sm:gap-8">
          <MiniTable titulo="Ventas" data={sales} onDelete={anularVenta} />
        </div>
      </div>

      {/* MODALS */}
      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={modalMsg}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
