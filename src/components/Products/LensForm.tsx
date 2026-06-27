"use client";

import { useState, useEffect } from "react";
import { useCreateLens } from "@/hooks/products";
import { BaseInput } from "@/components/Common/Inputs";
import { PRODUCTOS, IMG_LENTE, STATUS_MODAL, ClasificacionLentes, PrioridadLentes } from "@/commons/constants";
import { CreateLens } from "@/types/products";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { BaseSelect } from "@/components/Common/Inputs/BaseSelect";
import { useSessionUser } from "@/hooks/session";

const initialForm: CreateLens = {
  marca: "",
  material: "",
  precio_serie1: 0,
  precio_serie2: 0,
  precio_serie3: 0,
  // imagenUrl: IMG_LENTE,
  tipo: PRODUCTOS.LENTE,
  clasificacion: "" as unknown as ClasificacionLentes,
  prioridad: null as PrioridadLentes | null,
  sedeId: 0,
};

export default function LensForm() {
  const [form, setForm] = useState<CreateLens>(initialForm);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<string>("");
  const [imagenUrl, setImagen] = useState<File | null>(null);
  const { sedeId } = useSessionUser();
  const { addLens, success, statusMessage, loading } = useCreateLens();

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
      prioridad: form.prioridad || null,
      sedeId: Number(sedeId),
    };

    await addLens(payload);
  };

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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="w-full max-w-4xl mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-md space-y-6">
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
        </div>

        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          <BaseSelect
            label="Clasificación"
            name="clasificacion"
            value={form.clasificacion}
            required
            options={[
              { label: "Seleccione una clasificación", value: "" },
              ...Object.values(ClasificacionLentes).map((val) => ({
                label: val,
                value: val,
              })),
            ]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                clasificacion: e.target.value as ClasificacionLentes,
              }))
            }
          />
          <BaseSelect
            label="Prioridad de Visualización"
            name="prioridad"
            value={form.prioridad ?? ""}
            options={[
              { label: "Sin prioridad (Orden por defecto)", value: "" },
              ...Object.values(PrioridadLentes)
                .filter((val) => typeof val === "number")
                .map((val) => {
                  const key = PrioridadLentes[val as number];
                  return {
                    label: key.replace("MOSTRAR_", "MOSTRAR ").replace("_", " "),
                    value: val,
                  };
                }),
            ]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                prioridad: e.target.value === "" ? null : (Number(e.target.value) as PrioridadLentes),
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

        <button
          type="submit"
          disabled={loading}
          className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md disabled:opacity-50 hover:bg-opacity-90 transition-all"
        >
          Guardar
        </button>
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
