"use client";

import { useState } from "react";
import { useLenses } from "@/hooks/products";
import { BaseInput } from "@/components/Inputs/BaseInput";
import { PRODUCTOS, IMG_LENTE } from "@/commons/constants";

import { CreateLens } from "@/types/products";

const initialForm: CreateLens = {
  marca: "",
  material: "",
  precio_serie1: 0,
  precio_serie2: 0,
  precio_serie3: 0,
  tipo: PRODUCTOS.LENTE,
};

export default function LensForm() {
  const { addLens, loading, error } = useLenses();

  const [form, setForm] = useState<CreateLens>(initialForm);
  const [imagenUrl, setImagen] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { marca, material, precio_serie1, precio_serie2, precio_serie3 } =
      form;

    const payload: CreateLens = {
      marca,
      material,
      imagenUrl: IMG_LENTE,
      precio_serie1: precio_serie1,
      precio_serie2: precio_serie2,
      precio_serie3: precio_serie3,
      tipo: PRODUCTOS.LENTE,
    };

    await addLens(payload);

    setForm(initialForm);
    setImagen(null);
  };

  return (
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

      <div className="flex flex-col lg:flex-row gap-5 mb-5">
        <BaseInput
          label="Precio Serie 1"
          name="precioSerie1"
          type="number"
          placeholder="0.00"
          value={form.precio_serie1}
          required
          onChange={handleChange}
        />

        <BaseInput
          label="Precio Serie 2"
          name="precioSerie2"
          type="number"
          placeholder="0.00"
          value={form.precio_serie2}
          required
          onChange={handleChange}
        />

        <BaseInput
          label="Precio Serie 3"
          name="precioSerie3"
          type="number"
          placeholder="0.00"
          value={form.precio_serie3}
          required
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>

      {error && <p className="text-red mt-3">{error}</p>}
    </form>
  );
}
