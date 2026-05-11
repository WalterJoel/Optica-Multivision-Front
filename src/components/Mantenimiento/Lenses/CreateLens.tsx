"use client";

import { useState, useEffect } from "react";
import { useCreateLens } from "@/hooks/products";
import { BaseInput } from "@/components/Common/Inputs";
import { PRODUCTOS, STATUS_MODAL } from "@/commons/constants";
import { CreateLens } from "@/types/products";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import {
  BaseSelect,
  IOptionSelect,
} from "@/components/Common/Inputs/BaseSelect";
import { BaseButton } from "@/components/Common/Buttons";
import { useKits } from "@/hooks/kits";

const initialForm: CreateLens = {
  marca: "",
  material: "",
  precio_serie1: 0,
  precio_serie2: 0,
  precio_serie3: 0,
  kitId: null,
  imagenUrl: null,
  tipo: PRODUCTOS.LENTE,
};

export default function LensForm() {
  const [form, setForm] = useState<CreateLens>(initialForm);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>("");
  const [imagenUrl, setImagen] = useState<File | null>(null);

  // Composables
  const { addLens, success, statusMessage, loading } = useCreateLens();
  const { kits, getAllLenses } = useKits();

  const resetForm = () => {
    setForm(initialForm);
    setImagen(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateLens = {
      ...form,
      precio_serie1: Number(form.precio_serie1),
      precio_serie2: Number(form.precio_serie2),
      precio_serie3: Number(form.precio_serie3),
    };

    await addLens(payload);
  };

  //Wrapper/Mapper para el BaseSelect
  const kitOptions: IOptionSelect[] = [
    {
      label: "Ninguno",
      value: "",
    },
    ...kits.map((kit) => ({
      label: kit.nombre,
      value: String(kit.id),
    })),
  ];

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        resetForm();
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  useEffect(() => {
    getAllLenses();
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl border border-gray-3 bg-beige p-6"
      >
        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <BaseInput
            label="Marca"
            name="marca"
            placeholder="Marca del lente"
            value={form.marca}
            required
            onChange={handleChange}
          />
          <BaseInput
            label="Material"
            name="material"
            placeholder="Material del lente"
            value={form.material}
            required
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <BaseInput
            label="Precio Serie 1"
            name="precio_serie1"
            type="number"
            step="0.01"
            value={form.precio_serie1}
            required
            onChange={handleChange}
          />
          <BaseInput
            label="Precio Serie 2"
            name="precio_serie2"
            type="number"
            step="0.01"
            value={form.precio_serie2}
            required
            onChange={handleChange}
          />
          <BaseInput
            label="Precio Serie 3"
            name="precio_serie3"
            type="number"
            step="0.01"
            value={form.precio_serie3}
            required
            onChange={handleChange}
          />
          <BaseSelect
            label="Seleccione un Kit"
            name="kitId"
            value={form.kitId ?? ""}
            options={kitOptions}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                kitId: e.target.value === "" ? null : Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2.5">
            Cargar imagen <span className="text-red">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setImagen(e.target.files[0])}
          />
        </div>

        <BaseButton className="min-w-[240px]" type="submit" disabled={loading}>
          Guardar
        </BaseButton>
        <p className="mt-4 text-center text-sm text-green-600">
          Puedes cambiar de KIT luego
        </p>
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
