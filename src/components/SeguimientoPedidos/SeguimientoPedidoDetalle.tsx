"use client";

import React from "react";
import StepProceso from "./StepProceso";import {
  IPedidoSeguimiento,
  IPedidoEtapa
} from "@/types/seguimiento-pedido";
type Props = {
  pedido: IPedidoSeguimiento;
  onBack: () => void;
};

export default function SeguimientoPedidoDetalle({ pedido, onBack }: Props) {
  const estadoTxt =
    pedido.estadoGeneral === "DENTRO"
      ? "Dentro del tiempo"
      : pedido.estadoGeneral === "RETRASADO"
      ? "Retrasado"
      : "Crítico";

  const estadoClass =
    pedido.estadoGeneral === "DENTRO"
      ? "text-green-600"
      : pedido.estadoGeneral === "RETRASADO"
      ? "text-yellow-600"
      : "text-red-600";

  const activeIndex = pedido.etapas.findIndex((e) => !e.completado);
  const activeKey =
    activeIndex === -1 ? pedido.etapas[pedido.etapas.length - 1]?.key : pedido.etapas[activeIndex]?.key;

  return (
    <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-dark-5">Métricas de Producción</p>
          <h2 className="text-lg font-semibold text-dark">Seguimiento de Pedido</h2>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="rounded-md bg-gray-1 px-4 py-2 text-sm font-medium text-dark-2 hover:bg-gray-2"
        >
          ← Volver
        </button>
      </div>

      <div className="p-6">
        <p className="text-sm text-dark-5">#{pedido.id}</p>
        <h3 className="mt-1 text-xl font-semibold text-dark">{pedido.cliente}</h3>
        <p className="text-sm text-dark-5">Fecha Prometida: {pedido.fechaPrometida}</p>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-green-500 bg-green-50 flex items-center justify-center">
            <span className="text-green-600 font-bold">✓</span>
          </div>
          <div>
            <p className="text-sm font-medium text-dark">
              Total del Proceso: {pedido.totalProceso}
            </p>
            <p className={`text-sm font-semibold ${estadoClass}`}>{estadoTxt}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 items-start">
          {pedido.etapas.map((et) => (
            <StepProceso
              key={et.key}
              etapa={et}
              active={et.key === activeKey}
            />
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-gray-3 bg-gray-1 p-5">
          <p className="text-sm font-semibold text-dark">Detalles técnicos</p>
          <p className="mt-1 text-sm text-dark-5">
            (Mock) Aquí luego puedes mostrar: lente, medida, montura, observaciones, etc.
          </p>

          <div className="mt-4 h-24 rounded-lg bg-white border border-gray-3 flex items-center justify-center text-dark-5 text-sm">
            Gráfico / historial (solo front por ahora)
          </div>
        </div>
      </div>
    </div>
  );
}