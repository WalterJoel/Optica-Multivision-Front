"use client";

import React, { useMemo, useState } from "react";
import {
  IPedidoSeguimiento,
  IPedidoEtapa
} from "@/types/seguimiento-pedido";
type Props = {
  pedidos: IPedidoSeguimiento[];
  onSelect: (pedido: IPedidoSeguimiento) => void;
};

type FilterEstado = "ALL" | "DENTRO" | "RETRASADO" | "CRITICO";

export default function ListSeguimientoPedidos({ pedidos, onSelect }: Props) {
  const [filter, setFilter] = useState<FilterEstado>("ALL");

  const btnClass = (active: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium duration-200 ${
      active
        ? "bg-blue text-white"
        : "bg-gray-1 text-dark-2 hover:bg-blue hover:text-white"
    }`;

  const filtered = useMemo(() => {
    if (filter === "ALL") return pedidos;
    return pedidos.filter((p) => p.estadoGeneral === filter);
  }, [pedidos, filter]);

  const badge = (estado: IPedidoSeguimiento["estadoGeneral"]) => {
    const cls =
      estado === "DENTRO"
        ? "bg-green-50 text-green-700 border-green-200"
        : estado === "RETRASADO"
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : "bg-red-50 text-red-700 border-red-200";

    const txt =
      estado === "DENTRO" ? "Dentro" : estado === "RETRASADO" ? "Retrasado" : "Crítico";

    return (
      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
        {txt}
      </span>
    );
  };

  return (
    <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-medium text-dark">Seguimiento de pedidos</p>

        <div className="flex gap-2 flex-wrap">
          <button className={btnClass(filter === "ALL")} onClick={() => setFilter("ALL")}>
            Todos
          </button>
          <button className={btnClass(filter === "DENTRO")} onClick={() => setFilter("DENTRO")}>
            Dentro
          </button>
          <button className={btnClass(filter === "RETRASADO")} onClick={() => setFilter("RETRASADO")}>
            Retrasado
          </button>
          <button className={btnClass(filter === "CRITICO")} onClick={() => setFilter("CRITICO")}>
            Crítico
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-1">
            <tr>
              <th className="px-6 py-3">Pedido</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Fecha prometida</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6">
                  No hay pedidos para este filtro
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-3">
                  <td className="px-6 py-4 font-semibold text-dark">#{p.id}</td>
                  <td className="px-6 py-4">{p.cliente}</td>
                  <td className="px-6 py-4">{p.fechaPrometida}</td>
                  <td className="px-6 py-4">{badge(p.estadoGeneral)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md bg-gray-1 px-3 py-2 text-sm font-medium text-dark-2 hover:bg-blue hover:text-white duration-200"
                      onClick={() => onSelect(p)}
                    >
                      Ver seguimiento
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}