"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import { useMovimientosCaja } from "@/hooks/caja-movimiento/useMovimientosCaja";
import { useSessionUser } from "@/hooks/session/useSessionUser";
import { getLocalDateString } from "@/utils/date";
import { SedeSelect } from "@/components/Common/SedeSelect";
import { MiniTable } from "./MiniTable";
import CajaResumenCard from "./CajaResumenCard";


export default function CajaPremiumFino() {
  const { movimientos, getMovimientosCaja } = useMovimientosCaja();
  const { sedeId: userSedeId } = useSessionUser();

  const today = getLocalDateString();
  const [sedeId, setSedeId] = useState<number>(1);
  const [fechaInicio, setFechaInicio] = useState<string>(today);
  const [fechaFin, setFechaFin] = useState<string>(today);

  useEffect(() => {
    if (userSedeId) {
      setSedeId(userSedeId);
    }
  }, [userSedeId]);

  useEffect(() => {
    if (sedeId) {
      getMovimientosCaja(sedeId, fechaInicio, fechaFin);
    }
  }, [sedeId, fechaInicio, fechaFin]);

  const ingresos = movimientos.filter((m) => m.tipo === "INGRESO");
  const egresos = movimientos.filter((m) => m.tipo === "EGRESO");

  const totalIngresos = ingresos.reduce((acc, m) => acc + Number(m.monto), 0);
  const totalEgresos = egresos.reduce((acc, m) => acc + Number(m.monto), 0);
  const balance = totalIngresos - totalEgresos;

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
                Flujo de <span className="text-blue-light italic">Caja</span>
              </h1>
            </div>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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

        {/* CARDS */}
        <div className="mb-10">
          <CajaResumenCard
            balance={balance}
            totalIngresos={totalIngresos}
            totalEgresos={totalEgresos}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </div>

        {/* TABLAS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <MiniTable
            titulo="Historial de Ingresos"
            data={ingresos}
            type="ingreso"
          />
          <MiniTable
            titulo="Historial de Egresos"
            data={egresos}
            type="egreso"
          />
        </div>
      </div>
    </div>
  );
}

