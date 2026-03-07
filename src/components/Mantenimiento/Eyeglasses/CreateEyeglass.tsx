"use client";

import { useState, useEffect } from "react";
import { BaseInput, BaseFile } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL, PRODUCTOS } from "@/commons/constants";
import { ICreateEyeglass } from "@/types/products";
import { useCreateEyeglass } from "@/hooks/products/eyeglasses";

const emptyForm: ICreateEyeglass = {
  marca: "",
  material: "",
  precio: 0,
  medida: "",
  color: "",
  formaFacial: "",
  sexo: "",
  imagenUrl: "",
  tipo: PRODUCTOS.MONTURA,
};

export default function CreateEyeglass() {
  const [form, setForm] = useState<ICreateEyeglass>(emptyForm);
  const { addEyeglass, loading, statusMessage, success } = useCreateEyeglass();
  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onChangeFile = async (file: File | null) => {
    if (!file) {
      setForm((p) => ({ ...p, imagenUrl: "" }));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-s3", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setForm((p) => ({ ...p, imagenUrl: data.url }));
  };

  const createEyeglass = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEyeglass(form);
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
      onSubmit={createEyeglass}
      className="w-full max-w-4xl mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700">Crear Montura</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          label="Marca"
          name="marca"
          value={form.marca}
          placeholder="Marca de la montura"
          type="string"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Material"
          name="material"
          value={form.material}
          placeholder="Material"
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

        <BaseInput
          label="Medida"
          name="medida"
          value={form.medida}
          placeholder="Ej. 54-18-145"
          type="string"
          required
          onChange={onChange}
        />

        <BaseInput
          label="Color"
          name="color"
          value={form.color}
          placeholder="Color"
          type="string"
          required
          onChange={onChange}
        />

        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Forma Facial
          </label>
          <select
            name="formaFacial"
            value={form.formaFacial}
            onChange={onChangeSelect}
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary"
            required
          >
            <option value="">Seleccionar</option>
            <option value="OVALADO">Ovalado</option>
            <option value="CUADRADO">Cuadrado</option>
            <option value="REDONDO">Redondo</option>
          </select>
        </div>

        <div>
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Sexo
          </label>
          <select
            name="sexo"
            value={form.sexo}
            onChange={onChangeSelect}
            className="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary"
            required
          >
            <option value="">Seleccionar</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="UNISEX">Unisex</option>
          </select>
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
          Crear Montura
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