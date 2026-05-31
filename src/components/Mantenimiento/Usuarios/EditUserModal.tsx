"use client";

import { useEffect, useState, useMemo } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { BaseSelect } from "@/components/Common/Inputs/BaseSelect";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { ROLE_OPTIONS } from "@/commons/constants";
import { IUser } from "@/types/users";
import { User as UserIcon, X } from "lucide-react";

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
  onSave: (payload: {
    email?: string;
    role?: string;
    sedeId?: number;
    password?: string;
  }) => void;
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
      setSedeId(user.sede?.id);
      setPassword("");
    }
  }, [user]);

  const activeSedes = useMemo(() => {
    return sedes.filter((s) => s.activo !== false);
  }, [sedes]);

  const roleOptions = useMemo(() => {
    return ROLE_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value,
    }));
  }, []);

  const sedeOptions = useMemo(() => {
    if (activeSedes.length === 0) return [{ label: "No hay sedes registradas", value: 0 }];
    return activeSedes.map((s) => ({
      label: `${s.nombre}`,
      value: s.id,
    }));
  }, [activeSedes]);

  if (!isOpen || !user) return null;

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
    <ModalFrameWrapper size="lg">
      <div className="pt-2 pb-14 w-full max-h-[82vh] overflow-y-auto pr-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
              <UserIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                Editar Usuario
              </h3>
              <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                Usuario #{user.id} • {user.nombre} {user.apellido}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit}>
          {/* Card Container */}
          <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
              <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                Información del Usuario
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <BaseSelect
                label="Rol"
                name="role"
                value={role}
                options={roleOptions}
                required
                onChange={(e) => setRole(e.target.value)}
              />

              <BaseSelect
                label="Sede"
                name="sedeId"
                value={sedeId}
                options={sedeOptions}
                required
                onChange={(e) => setSedeId(Number(e.target.value))}
              />

              <BaseInput
                label="Nueva contraseña (opcional)"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dejar vacío para no cambiar"
                type="password"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <BaseButton
              type="button"
              onClick={onClose}
              variant="cancel"
              fullWidth={false}
              className="px-6"
            >
              Cancelar
            </BaseButton>

            <BaseButton
              loading={loading}
              type="submit"
              fullWidth={false}
              className="px-6"
            >
              Guardar Cambios
            </BaseButton>
          </div>
        </form>
      </div>
    </ModalFrameWrapper>
  );
}
