"use client";

import { useState, useEffect } from "react";
import { BaseInput, BaseFile, BaseTarea } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { BaseCheckbox } from "@/components/Common/Inputs/BaseCheckbox";
import { ICreateAccessory } from "@/types/products";
import { useCreateAccessory } from "@/hooks/products/accesories/useCreateAccesory";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

const emptyForm: ICreateAccessory = {
  nombre: "",
  precio: 0,
  atributo: "",
  imagenUrl: "",
  basico: false,
};

export default function CreateAccessory() {
  const [form, setForm] = useState<ICreateAccessory>(emptyForm);
  const { addAccessory, loading, statusMessage, success } =
    useCreateAccessory();
  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "precio" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const onChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setForm((p) => ({
      ...p,
      [name]: checked,
    }));
  };

  const onChangeFile = async (file: File | null) => {
    if (!file) {
      setForm((p) => ({ ...p, imagenUrl: "" }));
      return;
    }

    // subir a S3
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-s3", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setForm((p) => ({
      ...p,
      imagenUrl: data.url,
    }));
  };

  const createAccessory = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAccessory(form);
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
    <form
      onSubmit={createAccessory}
      className="w-full max-w-4xl mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700">Crear Accesorio</h2>

      {/* GRID DE INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          label="Nombre"
          name="nombre"
          value={form.nombre}
          placeholder="Nombre del accesorio"
          type="string"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Precio"
          name="precio"
          type="number"
          value={form.precio}
          placeholder="0.00"
          step="0.01"
          required
          onChange={onChange}
        />

        <div className="col-span-1 md:col-span-2">
          <BaseTarea
            label="Descripción"
            name="atributo"
            value={form.atributo}
            placeholder="Descripción breve del accesorio"
            onChange={onChange}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <BaseCheckbox
            label="Mostrar al vender ?"
            name="basico"
            checked={form.basico}
            onChange={onChangeCheckbox}
          />
        </div>
      </div>

      <BaseFile
        label="Imagen"
        name="imagen"
        onChange={onChangeFile}
        currentUrl={form.imagenUrl || undefined}
      />

      <div className="flex justify-center">
        <BaseButton type="submit" loading={loading} className="min-w-[200px]">
          Crear Accesorio
        </BaseButton>
      </div>

      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </form>
  );
}
