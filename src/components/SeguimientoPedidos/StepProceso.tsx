"use client";

import React from "react";
import {
  IPedidoSeguimiento,
  IPedidoEtapa
} from "@/types/seguimiento-pedido";

type Props = {
  etapa: IPedidoEtapa;
  active?: boolean;
};

export default function StepProceso({ etapa, active }: Props) {
  const ring = etapa.completado
    ? "border-green-500"
    : active
    ? "border-blue"
    : "border-gray-3";

  const bg = etapa.completado
    ? "bg-green-50"
    : active
    ? "bg-blue/10"
    : "bg-gray-1";

  return (
    <div className="flex flex-col items-center text-center gap-2 min-w-[110px]">
      <div
        className={`h-16 w-16 rounded-full border-2 ${ring} ${bg} flex items-center justify-center`}
        title={etapa.label}
      >
        {etapa.completado ? (
          <span className="text-green-600 text-xl">✓</span>
        ) : (
          <span className="text-dark-4 text-lg">•</span>
        )}
      </div>

      <p className="text-sm font-medium text-dark">{etapa.label}</p>
      <p className="text-xs text-dark-5">{etapa.tiempo}</p>
    </div>
  );
}