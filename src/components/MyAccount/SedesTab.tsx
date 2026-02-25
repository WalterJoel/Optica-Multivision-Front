"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { api } from "@/services/api";

type Sede = {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  activo: boolean;
  fechaCreacion: string;
};

const emptyForm = {
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
  logoUrl: "",
};

export default function SedesTab() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [msg, setMsg] = useState("");

  const loadSedes = async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get("/sedes");
      setSedes(data);
    } catch (e: any) {
      setMsg(e.response?.data?.message || "Error cargando sedes");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadSedes();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const createSede = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await api.post("/sedes", {
        ...form,
        ruc: form.ruc.trim(),
        logoUrl: form.logoUrl.trim() || null,
        activo: true,
      });

      setMsg("✅ Sede creada");
      setForm(emptyForm);
      await loadSedes();
    } catch (e: any) {
      setMsg(e.response?.data?.message || "Error creando sede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-9.5 px-4 sm:px-7.5 xl:px-10">
      <h2 className="text-xl font-semibold text-dark">Sedes</h2>
      <p className="text-custom-sm text-dark-4 mt-1">
        Administra las sedes del sistema
      </p>

      {/* FORM */}
      <form
        onSubmit={createSede}
        className="mt-6 rounded-xl border border-gray-3 bg-white p-4 sm:p-6"
      >
        <h3 className="font-medium text-dark mb-4">Crear sede</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BaseInput
            label="Nombre"
            name="nombre"
            value={form.nombre}
            placeholder="Sede Central"
            required
            onChange={onChange}
          />

          <BaseInput
            label="RUC"
            name="ruc"
            value={form.ruc}
            placeholder="20123456789"
            required
            onChange={onChange}
          />

          <BaseInput
            label="Dirección"
            name="direccion"
            value={form.direccion}
            placeholder="Av. ..."
            required
            onChange={onChange}
          />

          <BaseInput
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            placeholder="999888777"
            required
            onChange={onChange}
          />

          <BaseInput
            label="Logo URL (opcional)"
            name="logoUrl"
            value={form.logoUrl}
            placeholder="https://..."
            onChange={onChange}
          />
        </div>

        <div className="mt-4 max-w-[240px]">
          <BaseButton type="submit" loading={loading}>
            Crear sede
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
        <div className="px-4 sm:px-6 py-4 border-b border-gray-3">
          <p className="font-medium text-dark">Lista de sedes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-1">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">RUC</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Activo</th>
              </tr>
            </thead>

            <tbody>
              {loadingList ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    Cargando...
                  </td>
                </tr>
              ) : sedes.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    No hay sedes aún
                  </td>
                </tr>
              ) : (
                sedes.map((s) => (
                  <tr key={s.id} className="border-t border-gray-3">
                    <td className="px-4 py-3">{s.id}</td>
                    <td className="px-4 py-3">{s.nombre}</td>
                    <td className="px-4 py-3">{s.ruc}</td>
                    <td className="px-4 py-3">{s.telefono}</td>
                    <td className="px-4 py-3">
                      {s.activo ? "✅" : "❌"}
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