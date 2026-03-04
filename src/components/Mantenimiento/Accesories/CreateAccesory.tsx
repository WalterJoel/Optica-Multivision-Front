"use client";

import { useState } from "react";
import { BaseInput, BaseFile, BaseTarea } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { ICreateAccessory } from "@/types/products";
import { useCreateClient } from "@/hooks/clients/useCreateClient";

const emptyForm: ICreateAccessory = {
  nombre: "",
  precio: 0,
  atributo: "",
  imagenUrl: "",
};

export default function CreateAccessory() {
  const [form, setForm] = useState<ICreateAccessory>(emptyForm);
  const { addClient, success, statusMessage, loading } = useCreateClient();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
    setForm((p) => ({ ...p, imagenUrl: data.url }));
  };

  const createAccessory = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClient(form);
  };

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
    </form>
  );
}
