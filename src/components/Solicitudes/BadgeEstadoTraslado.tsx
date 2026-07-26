"use client";

import React from "react";
import { Clock, Truck, CheckCircle2 } from "lucide-react";

interface BadgeEstadoTrasladoProps {
  estado: string;
}

export function BadgeEstadoTraslado({ estado }: BadgeEstadoTrasladoProps) {
  switch (estado) {
    case "SOLICITADO":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
          <Clock size={12} /> Solicitado
        </span>
      );
    case "ENVIADO":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-light/10 text-blue-light border border-blue-light/30">
          <Truck size={12} /> Enviado
        </span>
      );
    case "TRASLADADO":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 size={12} /> Trasladado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700">
          {estado}
        </span>
      );
  }
}
