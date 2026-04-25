"use client";

import { useEffect, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { IStore, IUpdateStore } from "@/types/stores";

import { ModalFrameWrapper } from "@/components/Common/modal";
import { useUpdateStore } from "@/hooks/stores/useUpdateStore";

const emptyForm: IUpdateStore = {
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
};

export default function EditStoreModal({
  isOpen,
  store,
  onClose,
  onRefresh,
}: {
  isOpen: boolean;
  store: IStore | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState<IUpdateStore>(emptyForm);
  const { updateStore, loading } = useUpdateStore();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const edit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStore(store.id, form);

    onRefresh();
    onClose();
  };

  useEffect(() => {
    if (store) {
      const { nombre, ruc, direccion, telefono } = store;

      setForm({
        nombre,
        ruc,
        direccion,
        telefono,
      });
    }
  }, [store]);

  if (!isOpen || !store) return null;

  return (
    <ModalFrameWrapper>
      <div className="w-full">
        {/* HEADER MÁS LIMPIO */}
        <div className="mb-4 text-center">
          <p className="font-semibold text-dark text-sm tracking-wide">
            Editar sede <span className="text-yellow-dark">{store.nombre}</span>
          </p>
        </div>

        <form onSubmit={edit} className="space-y-6 pb-12">
          {/* GRID */}
          <div className="grid grid-cols-1 gap-4">
            <BaseInput
              label="Nombre"
              name="nombre"
              value={form.nombre ?? ""}
              onChange={onChange}
              required
            />

            <BaseInput
              label="RUC"
              name="ruc"
              value={form.ruc ?? ""}
              onChange={onChange}
              required
              pattern="^\d{11}$"
              title="El RUC debe tener 11 dígitos"
            />

            <BaseInput
              label="Dirección"
              name="direccion"
              value={form.direccion ?? ""}
              onChange={onChange}
              required
            />

            <BaseInput
              label="Teléfono"
              name="telefono"
              value={form.telefono ?? ""}
              onChange={onChange}
              required
              pattern="^\d{9}$"
              title="El teléfono debe tener 9 dígitos"
            />
          </div>

          {/* BOTONES CENTRADOS */}
          <div className="flex justify-center gap-3 pt-2 flex-col sm:flex-row mt-8">
            <BaseButton
              type="button"
              onClick={onClose}
              size="md"
              variant="cancel"
              className="w-full sm:w-auto"
            >
              Cancelar
            </BaseButton>

            <BaseButton
              loading={loading}
              type="submit"
              size="md"
              className="w- full sm:w-auto"
            >
              Guardar
            </BaseButton>
          </div>
        </form>
      </div>
    </ModalFrameWrapper>
  );
}
