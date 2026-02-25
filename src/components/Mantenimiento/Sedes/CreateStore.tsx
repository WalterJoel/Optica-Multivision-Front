"use client";

import { useState, useEffect } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ICreateStore } from "@/types/stores";
import { useCreateStore } from "@/hooks/stores";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

const emptyForm: ICreateStore = {
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
  logoUrl: "",
};

export default function CreateStore() {
  const [form, setForm] = useState<ICreateStore>(emptyForm);
  const { addStore, success, statusMessage, loading } = useCreateStore();
  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const createStore = async (e: React.FormEvent) => {
    e.preventDefault();

    await addStore(form);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        setForm(emptyForm);
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <>
      <form
        onSubmit={createStore}
        className="w-full rounded-xl border border-gray-3 bg-white p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
            pattern="^\d{11}$"
            title="El RUC debe tener 11 dígitos"
          />

          <BaseInput
            label="Dirección"
            name="direccion"
            value={form.direccion}
            placeholder="Av..."
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
            pattern="^\d{9}$"
            title="El teléfono debe tener 9 dígitos"
          />

          <BaseInput
            label="Logo URL"
            name="logoUrl"
            value={form.logoUrl}
            placeholder="https://..."
            onChange={onChange}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton type="submit" loading={loading} className="min-w-[240px]">
            Crear sede
          </BaseButton>
        </div>
      </form>
      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
