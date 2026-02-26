"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";

type Sede = {
  id: number;
  nombre: string;
};

type User = {
  id: number;
  email: string;
  role: string;
  avatarUrl?: string | null;
  createdAt?: string;

  // nuevos
  sedeId?: number;
  sede?: { id: number; nombre: string } | null;
};

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER",
    sedeId: "",
  });

  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingSedes, setLoadingSedes] = useState(false);

  const loadUsers = async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
    } catch (e: any) {
      setMsg(e.response?.data?.message || "Error cargando usuarios");
    } finally {
      setLoadingList(false);
    }
  };

  const loadSedes = async () => {
    setLoadingSedes(true);
    try {
      const { data } = await api.get<Sede[]>("/sedes");
      setSedes(data);

      // ✅ si no hay sede seleccionada, poner la primera por defecto
      if (data?.length && !form.sedeId) {
        setForm((p) => ({ ...p, sedeId: String(data[0].id) }));
      }
    } catch (e: any) {
      setMsg(e.response?.data?.message || "Error cargando sedes");
    } finally {
      setLoadingSedes(false);
    }
  };

  useEffect(() => {
    loadSedes();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange =
    (key: "email" | "password" | "role" | "sedeId") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!form.sedeId) {
      setMsg("Selecciona una sede");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users", {
        email: form.email,
        password: form.password,
        role: form.role,
        sedeId: Number(form.sedeId),
      });

      setMsg("✅ Usuario creado");
      setForm((p) => ({ email: "", password: "", role: "USER", sedeId: p.sedeId }));
      await loadUsers();
    } catch (e: any) {
      setMsg(e.response?.data?.message || "Error creando usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-9.5 px-4 sm:px-7.5 xl:px-10">
      <h2 className="text-xl font-semibold text-dark">Usuarios</h2>
      <p className="text-custom-sm text-dark-4 mt-1">
        Crea usuarios y asígnalos a una sede.
      </p>

      {/* FORM */}
      <form
        onSubmit={createUser}
        className="mt-6 rounded-xl border border-gray-3 bg-white p-4 sm:p-6"
      >
        <h3 className="font-medium text-dark mb-4">Crear usuario</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 items-end">
          <BaseInput
            label="Email"
            name="email"
            type="email"
            placeholder="correo@correo.com"
            value={form.email}
            required
            onChange={onChange("email") as any}
          />

          <BaseInput
            label="Password"
            name="password"
            type="password"
            placeholder="******"
            value={form.password}
            required
            onChange={onChange("password") as any}
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-600">
              Role <span className="text-red ml-1">*</span>
            </label>

            <select
              value={form.role}
              onChange={onChange("role")}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5
                         w-full py-2.5 px-5 outline-none duration-200
                         focus:border-transparent focus:shadow-input
                         focus:ring-2 focus:ring-blue/20"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-600">
              Sede <span className="text-red ml-1">*</span>
            </label>

            <select
              value={form.sedeId}
              onChange={onChange("sedeId")}
              disabled={loadingSedes || sedes.length === 0}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5
                         w-full py-2.5 px-5 outline-none duration-200
                         focus:border-transparent focus:shadow-input
                         focus:ring-2 focus:ring-blue/20 disabled:opacity-60"
            >
              {loadingSedes ? (
                <option value="">Cargando sedes...</option>
              ) : sedes.length === 0 ? (
                <option value="">No hay sedes</option>
              ) : (
                sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} (ID: {s.id})
                  </option>
                ))
              )}
            </select>
          </div>

          <BaseButton type="submit" loading={loading} variant="primary" fullWidth>
            Crear
          </BaseButton>
        </div>

        {msg && (
          <div className="mt-4 text-custom-sm rounded-md border border-gray-3 bg-gray-1 px-4 py-3">
            {msg}
          </div>
        )}
      </form>

      {/* LIST */}
      <div className="mt-6 rounded-xl border border-gray-3 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-3">
          <p className="font-medium text-dark">Lista de usuarios</p>

          <div className="w-[140px]">
            <BaseButton
              type="button"
              variant="cancel"
              fullWidth={true}
              loading={loadingList}
              onClick={() => loadUsers()}
            >
              Recargar
            </BaseButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-1">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-custom-sm font-semibold text-dark-4">
                  ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-custom-sm font-semibold text-dark-4">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-custom-sm font-semibold text-dark-4">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-custom-sm font-semibold text-dark-4">
                  Sede
                </th>
                <th className="px-4 sm:px-6 py-3 text-custom-sm font-semibold text-dark-4">
                  Creado
                </th>
              </tr>
            </thead>

            <tbody>
              {loadingList ? (
                <tr>
                  <td className="px-4 sm:px-6 py-4" colSpan={5}>
                    Cargando...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-4 sm:px-6 py-4" colSpan={5}>
                    No hay usuarios aún.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-3">
                    <td className="px-4 sm:px-6 py-4">{u.id}</td>
                    <td className="px-4 sm:px-6 py-4">{u.email}</td>
                    <td className="px-4 sm:px-6 py-4">{u.role}</td>
                    <td className="px-4 sm:px-6 py-4">
                      {u.sede?.nombre ?? (u.sedeId ? `Sede ID: ${u.sedeId}` : "-")}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}