"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";

type User = {
  id: number;
  email: string;
  role: string;
  sedeId: number;
};

type Sede = {
  id: number;
  nombre: string;
};

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSede, setSelectedSede] = useState<number | "ALL">("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: usersData } = await api.get("/users");
      const { data: sedesData } = await api.get("/sedes");

      setUsers(usersData);
      setSedes(sedesData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 FILTRO
  const filteredUsers = useMemo(() => {
    if (selectedSede === "ALL") return users;
    return users.filter((u) => u.sedeId === selectedSede);
  }, [users, selectedSede]);

  return (
    <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-medium text-dark">Lista de usuarios</p>

        {/* SELECT FILTRO */}
        <select
          value={selectedSede}
          onChange={(e) =>
            setSelectedSede(
              e.target.value === "ALL" ? "ALL" : Number(e.target.value)
            )
          }
          className="h-11 rounded-lg border border-gray-3 bg-white px-4 text-sm outline-none focus:border-primary"
        >
          <option value="ALL">Todas las sedes</option>
          {sedes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-1">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3">Sede</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-6">
                  Cargando...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-6">
                  No hay usuarios en esta sede
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-gray-3">
                  <td className="px-6 py-4">{u.id}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">{u.sedeId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}