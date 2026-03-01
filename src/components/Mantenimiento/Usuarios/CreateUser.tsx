"use client";

import { useEffect, useMemo, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import type { CreateUser } from "@/types/users";
import { useCreateUser } from "@/hooks/users";
import { api } from "@/services/api";

type Sede = {
  id: number;
  nombre: string;
  activo?: boolean;
};

export const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "vendedor", label: "Vendedor" },
  { value: "almacen", label: "Almacén" },
] as const;

const emptyForm: CreateUser = {
  email: "",
  password: "",
  role: "vendedor",
  sedeId: 0, // se setea automáticamente cuando carguen las sedes
};

export default function CreateUser() {
  const [form, setForm] = useState<CreateUser>(emptyForm);

  const { addUser, success, statusMessage, loading } = useCreateUser();
  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  // sedes
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loadingSedes, setLoadingSedes] = useState<boolean>(true);

  const activeSedes = useMemo(() => {
    // si tu backend no manda "activo", igual funciona
    return sedes.filter((s) => s.activo !== false);
  }, [sedes]);

  const loadSedes = async () => {
    setLoadingSedes(true);
    try {
      const { data } = await api.get("/sedes");
      setSedes(Array.isArray(data) ? data : []);
    } catch {
      setSedes([]);
    } finally {
      setLoadingSedes(false);
    }
  };

  useEffect(() => {
    loadSedes();
  }, []);

  // si aún no hay sedeId seleccionado, setear el primero que exista
  useEffect(() => {
    if (!loadingSedes && activeSedes.length > 0 && (!form.sedeId || form.sedeId === 0)) {
      setForm((p) => ({ ...p, sedeId: activeSedes[0].id }));
    }
  }, [loadingSedes, activeSedes, form.sedeId]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const onChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((p) => ({
      ...p,
      role: e.target.value,
    }));
  };

  const onChangeSede = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((p) => ({
      ...p,
      sedeId: Number(e.target.value),
    }));
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser(form);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        // reset pero conserva defaults (role) y si hay sedes, setea la primera
        setForm((p) => ({
          ...emptyForm,
          role: p.role || emptyForm.role,
          sedeId: activeSedes[0]?.id ?? 0,
        }));
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage, activeSedes]);

  return (
    <>
      <form
        onSubmit={createUser}
        className="w-full rounded-xl border border-gray-3 bg-white p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <BaseInput
            label="Email"
            name="email"
            value={form.email}
            placeholder="correo@ejemplo.com"
            required
            onChange={onChangeInput}
          />

          <BaseInput
            label="Password"
            name="password"
            value={form.password}
            placeholder="******"
            required
            onChange={onChangeInput}
            type="password"
          />

          {/* Rol (select) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-dark">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={onChangeRole}
              required
              className="h-12 rounded-lg border border-gray-3 bg-white px-4 text-sm outline-none focus:border-primary"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sede (select) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-dark">Sede</label>
            <select
              name="sedeId"
              value={String(form.sedeId || 0)}
              onChange={onChangeSede}
              required
              disabled={loadingSedes || activeSedes.length === 0}
              className="h-12 rounded-lg border border-gray-3 bg-white px-4 text-sm outline-none focus:border-primary disabled:opacity-60"
            >
              {loadingSedes ? (
                <option value="0">Cargando sedes...</option>
              ) : activeSedes.length === 0 ? (
                <option value="0">No hay sedes registradas</option>
              ) : (
                activeSedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} (ID: {s.id})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton
            type="submit"
            loading={loading}
            className="min-w-[240px]"
            disabled={loadingSedes || activeSedes.length === 0}
          >
            Crear usuario
          </BaseButton>
        </div>

        {!loadingSedes && activeSedes.length === 0 && (
          <p className="mt-4 text-center text-sm text-red-500">
            Primero crea una sede para poder registrar usuarios.
          </p>
        )}
      </form>

      <LoadingModal isOpen={loading || loadingSedes} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}