"use client";

import { useEffect, useState } from "react";
import { useCreateLens } from "@/hooks/products";
import { BaseInput } from "@/components/Inputs/BaseInput";
import { PRODUCTOS, IMG_LENTE } from "@/commons/constants";
import { CreateLens } from "@/types/products";
import { ErrorModal } from "@/components/Common/modal";

const initialForm: CreateLens = {
  marca: "",
  material: "",
  precio_serie1: "",
  precio_serie2: "",
  precio_serie3: "",
  imagenUrl: IMG_LENTE,
  tipo: PRODUCTOS.LENTE,
};

export default function LensForm() {
  const { addLens, loading, error } = useCreateLens();
  const [showError, setShowError] = useState(false);

  const [form, setForm] = useState<CreateLens>(initialForm);
  const [imagenUrl, setImagen] = useState<File | null>(null);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (!error) {
      setForm(initialForm);
      setImagen(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
            min={0}
            step="0.01"
            placeholder="0.00"
            value={form.precio_serie1}
            required
            onChange={handleChange}
          />

          <BaseInput
            label="Precio Serie 2"
            name="precio_serie2"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={form.precio_serie2}
            required
            onChange={handleChange}
          />

          <BaseInput
            label="Precio Serie 3"
            name="precio_serie3"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={form.precio_serie3}
            required
            onChange={handleChange}
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
          className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>

      {showError && error && (
        <ErrorModal message={error} onClose={() => setShowError(false)} />
      )}
    </>
  );
}
