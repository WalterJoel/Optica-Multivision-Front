"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { IUser } from "@/types/users";
import { ROLE_OPTIONS } from "./CreateUser";

type Sede = { id: number; nombre: string; activo?: boolean };

export default function EditUserModal({
  isOpen,
  user,
  sedes,
  onClose,
  onSave,
  loading,
}: {
  isOpen: boolean;
  user: IUser | null;
  sedes: Sede[];
  onClose: () => void;
  onSave: (payload: { email?: string; role?: string; sedeId?: number; password?: string }) => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("vendedor");
  const [sedeId, setSedeId] = useState<number>(0);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
      setSedeId(user.sedeId ?? 0);
      setPassword("");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const activeSedes = sedes.filter((s) => s.activo !== false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      email,
      role,
      sedeId,
      ...(password ? { password } : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[720px] rounded-xl bg-white border border-gray-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-dark">Editar usuario #{user.id}</p>
          <button onClick={onClose} className="text-sm text-dark-4 hover:text-dark">✕</button>
        </div>

        <form onSubmit={submit} className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-dark">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-12 rounded-lg border border-gray-3 bg-white px-4 text-sm outline-none focus:border-primary"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-dark">Sede</label>
              <select
                value={String(sedeId || 0)}
                onChange={(e) => setSedeId(Number(e.target.value))}
                className="h-12 rounded-lg border border-gray-3 bg-white px-4 text-sm outline-none focus:border-primary"
              >
                {activeSedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} (ID: {s.id})
                  </option>
                ))}
              </select>
            </div>

            <BaseInput
              label="Nueva contraseña (opcional)"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar vacío para no cambiar"
              type="password"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-3 hover:bg-gray-1 text-sm font-semibold"
            >
              Cancelar
            </button>

            <BaseButton type="submit" loading={loading}>
              Guardar cambios
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
}