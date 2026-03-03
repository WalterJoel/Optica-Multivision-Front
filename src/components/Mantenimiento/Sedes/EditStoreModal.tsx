"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { IStore } from "@/types/stores";

export default function EditStoreModal({
  isOpen,
  store,
  onClose,
  onSave,
  loading,
}: {
  isOpen: boolean;
  store: IStore | null;
  onClose: () => void;
  onSave: (payload: Partial<IStore>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<Partial<IStore>>({});

  useEffect(() => {
    if (store) {
      setForm({
        nombre: store.nombre,
        ruc: store.ruc,
        direccion: store.direccion,
        telefono: store.telefono,
        logoUrl: store.logoUrl,
      });
    }
  }, [store]);

  if (!isOpen || !store) return null;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[720px] rounded-xl bg-white border border-gray-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-dark">Editar sede #{store.id}</p>
          <button onClick={onClose} className="text-sm text-dark-4 hover:text-dark">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BaseInput label="Nombre" name="nombre" value={form.nombre ?? ""} onChange={onChange} required />
            <BaseInput
              label="RUC"
              name="ruc"
              value={form.ruc ?? ""}
              onChange={onChange}
              required
              pattern="^\d{11}$"
              title="El RUC debe tener 11 dígitos"
            />
            <BaseInput label="Dirección" name="direccion" value={form.direccion ?? ""} onChange={onChange} required />
            <BaseInput
              label="Teléfono"
              name="telefono"
              value={form.telefono ?? ""}
              onChange={onChange}
              required
              pattern="^\d{9}$"
              title="El teléfono debe tener 9 dígitos"
            />
            <BaseInput label="Logo URL" name="logoUrl" value={form.logoUrl ?? ""} onChange={onChange} />
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