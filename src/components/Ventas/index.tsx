"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Calendar, Building2 } from "lucide-react";
import { MiniTable } from "./MiniTable";

import { useSales } from "@/hooks/sales";

export default function CajaPremiumFino() {
  const { getAllSales, sales, loading } = useSales();

  const [fecha, setFecha] = useState("");

  useEffect(() => {
    getAllSales();
  }, []);

  const ventasFiltradas = fecha
    ? sales.filter(
        (v) => new Date(v.createdAt).toISOString().slice(0, 10) === fecha,
      )
    : sales;

  if (loading) {
    return (
      <div className="p-6 text-[12px] font-bold text-gray-5 uppercase tracking-widest">
        Cargando ventas...
      </div>
    );
  }

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
          {/* <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-white border-2 border-blue-light-4 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
              <Building2 size={18} className="text-blue-light" />
              <select
                value={sedeId}
                onChange={(e) => setSedeId(Number(e.target.value))}
                className="bg-transparent outline-none text-[13px] font-bold text-dark w-full cursor-pointer"
              >
                <option value={1}>Sede Principal</option>
                <option value={2}>Sede Norte</option>
                <option value={3}>Sede Sur</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-white border-2 border-blue-light-4 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
              <Calendar size={18} className="text-blue-light" />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="bg-transparent outline-none text-[13px] font-bold text-dark w-full cursor-pointer"
              />
            </div>
          </div> */}
        </header>

        {/* TABLAS */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 sm:gap-8">
          <MiniTable titulo="Ventas" data={sales} />
        </div>
      </div>
    </div>
  );
}
