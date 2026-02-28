"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { IClient } from "@/types/clients";

type FilterDoc = "ALL" | "DNI" | "RUC";

export default function ListClients() {
  const [clientes, setClientes] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterDoc>("ALL");

  const loadClientes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const getNombre = (c: IClient) => {
    if (c.tipoCliente === "PERSONA") {
      return `${c.nombres ?? ""} ${c.apellidos ?? ""}`.trim() || "-";
    }
    return c.razonSocial ?? "-";
  };

  const filteredClientes = useMemo(() => {
    if (filter === "ALL") return clientes;
    if (filter === "DNI") return clientes.filter((c) => c.tipoDoc === "DNI");
    return clientes.filter((c) => c.tipoDoc === "RUC");
  }, [clientes, filter]);

  const btnClass = (active: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium duration-200 ${
      active ? "bg-blue text-white" : "bg-gray-1 text-dark-2 hover:bg-blue hover:text-white"
    }`;

  return (
    <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-medium text-dark">Lista de clientes</p>

        {/* Filtros */}
        <div className="flex gap-2">
          <button
            type="button"
            className={btnClass(filter === "ALL")}
            onClick={() => setFilter("ALL")}
          >
            Todos
          </button>
          <button
            type="button"
            className={btnClass(filter === "DNI")}
            onClick={() => setFilter("DNI")}
          >
            DNI
          </button>
          <button
            type="button"
            className={btnClass(filter === "RUC")}
            onClick={() => setFilter("RUC")}
          >
            RUC
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-1">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Documento</th>
              <th className="px-6 py-3">Nombre / Razón Social</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">Activo</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">
                  Cargando...
                </td>
              </tr>
            ) : filteredClientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">
                  No hay clientes para este filtro
                </td>
              </tr>
            ) : (
              filteredClientes.map((c) => (
                <tr key={c.id} className="border-t border-gray-3">
                  <td className="px-6 py-4">{c.id}</td>
                  <td className="px-6 py-4">{c.tipoCliente}</td>
                  <td className="px-6 py-4">
                    {c.tipoDoc}: {c.numeroDoc}
                  </td>
                  <td className="px-6 py-4">{getNombre(c)}</td>
                  <td className="px-6 py-4">{c.telefono ?? "-"}</td>
                  <td className="px-6 py-4">{c.activo ? "✅" : "❌"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}