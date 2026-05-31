"use client";

import { useEffect, useMemo, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { BaseSelect } from "@/components/Common/Inputs/BaseSelect";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { ROLE_OPTIONS, STATUS_MODAL } from "@/commons/constants";
import type { CreateUser } from "@/types/users";
import { useCreateUser } from "@/hooks/users";
import { api } from "@/services/api";

type Sede = {
  id: number;
  nombre: string;
  activo?: boolean;
};

const emptyForm: CreateUser = {
  email: "",
  password: "",
  nombre: "",
  apellido: "",
  role: ROLE_OPTIONS[0].value,
  sedeId: 0,
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

  useEffect(() => {
    if (
      !loadingSedes &&
      activeSedes.length > 0 &&
      (!form.sedeId || form.sedeId === 0)
    ) {
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
          role: form.role || emptyForm.role,
          sedeId: activeSedes[0]?.id ?? 0,
        }));
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage, activeSedes]);

  const roleOptions = useMemo(() => {
    return ROLE_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value,
    }));
  }, []);

  const sedeOptions = useMemo(() => {
    if (loadingSedes) return [{ label: "Cargando sedes...", value: 0 }];
    if (activeSedes.length === 0) return [{ label: "No hay sedes registradas", value: 0 }];
    return activeSedes.map((s) => ({
      label: `${s.nombre}`,
      value: s.id,
    }));
  }, [loadingSedes, activeSedes]);

  return (
    <>
      <form
        onSubmit={createUser}
        className="w-full rounded-xl border border-gray-3 bg-beige p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <BaseInput
            label="Nombre"
            name="nombre"
            value={form.nombre}
            required
            onChange={onChangeInput}
          />
          <BaseInput
            label="Apellido"
            name="apellido"
            value={form.apellido}
            required
            onChange={onChangeInput}
          />
          <BaseInput
            label="Email"
            name="email"
            value={form.email}
            placeholder="correo@ejemplo.com"
            required
            type="email"
            onChange={onChangeInput}
          />

          <BaseInput
            label="Password"
            name="password"
            value={form.password}
            placeholder="******"
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
            onChange={onChangeInput}
            type="password"
            title="Mínimo 8 caracteres, incluyendo mayúscula, minúscula y número"
          />

          {/* Rol (BaseSelect) */}
          <BaseSelect
            label="Rol"
            name="role"
            value={form.role}
            options={roleOptions}
            required
            onChange={onChangeRole}
          />

          {/* Sede (BaseSelect) */}
          <BaseSelect
            label="Sede"
            name="sedeId"
            value={form.sedeId}
            options={sedeOptions}
            required
            disabled={loadingSedes || activeSedes.length === 0}
            onChange={onChangeSede}
          />
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
