"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

type Sede = {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  activo: boolean;
};

export default function ListStores() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSedes = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/sedes");

      setSedes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSedes();
  }, []);

  return (
    <div
      className="
      w-full
      rounded-xl
      border border-gray-3
      bg-white
      overflow-hidden
    "
    >
      <div
        className="
        px-6 py-4
        border-b border-gray-3
      "
      >
        <p className="font-medium text-dark">Lista de sedes</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-1">
            <tr>
              <th className="px-6 py-3">ID</th>

              <th className="px-6 py-3">Nombre</th>

              <th className="px-6 py-3">RUC</th>

              <th className="px-6 py-3">Teléfono</th>

              <th className="px-6 py-3">Activo</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-6">
                  Cargando...
                </td>
              </tr>
            ) : sedes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6">
                  No hay sedes aún
                </td>
              </tr>
            ) : (
              sedes.map((s) => (
                <tr key={s.id} className="border-t border-gray-3">
                  <td className="px-6 py-4">{s.id}</td>

                  <td className="px-6 py-4">{s.nombre}</td>

                  <td className="px-6 py-4">{s.ruc}</td>

                  <td className="px-6 py-4">{s.telefono}</td>

                  <td className="px-6 py-4">{s.activo ? "✅" : "❌"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
