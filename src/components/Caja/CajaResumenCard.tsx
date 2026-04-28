"use client";

import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

type Props = {
  balance: number;
  totalIngresos: number;
  totalEgresos: number;
};

export default function CajaResumenCard({
  balance,
  totalIngresos,
  totalEgresos,
}: Props) {
  return (
    <div className="mb-10">
      <div className="bg-white rounded-[35px] p-10 border border-blue-light-5 shadow-testimonial relative overflow-hidden">
        {/* Glow sutil */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-dark/10 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[11px] font-black text-blue-light-2 uppercase tracking-[3px] mb-2">
              Balance Consolidado
            </p>

            <h2 className="text-5xl font-black text-dark tracking-tighter">
              <span className="text-blue-light-3 text-3xl font-medium mr-1">
                S/
              </span>
              {balance.toFixed(2)}
            </h2>
          </div>

          {/* Badge pequeño */}
          <div className="bg-white/70 backdrop-blur px-4 py-2 rounded-xl border border-blue-light-5 text-[10px] font-black text-blue-light uppercase tracking-widest">
            HOY
          </div>
        </div>

        {/* DETALLE INGRESOS / EGRESOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* INGRESOS */}
          <div className="flex items-center justify-between bg-beige rounded-[20px] p-5 border border-green-light-4/40 hover:border-green transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-light-6 flex items-center justify-center text-green">
                <ArrowUpRight size={22} />
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-4 uppercase tracking-[2px]">
                  Ingresos
                </p>
                <p className="text-[18px] font-black text-dark">
                  S/ {totalIngresos.toFixed(2)}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-black text-green bg-green-light-6 px-2 py-1 rounded-md">
              + Flujo
            </span>
          </div>

          {/* EGRESOS */}
          <div className="flex items-center justify-between bg-beige rounded-[20px] p-5 border border-red-light-4/40 hover:border-red transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-light-6 flex items-center justify-center text-red">
                <ArrowDownLeft size={22} />
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-4 uppercase tracking-[2px]">
                  Egresos
                </p>
                <p className="text-[18px] font-black text-dark">
                  S/ {totalEgresos.toFixed(2)}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-black text-red bg-red-light-6 px-2 py-1 rounded-md">
              - Flujo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
