"use client";

import { useState } from "react";
import { useAccessories } from "@/hooks/products";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { PRODUCTOS, IMG_LENTE } from "@/commons/constants";
import { CreateAccessory } from "@/types/products";

const initialForm: CreateAccessory = {
  marca: "",
  material: "",
  precio_serie1: 0,
  precio_serie2: 0,
  precio_serie3: 0,
  tipo: PRODUCTOS.ACCESORIO,
};

export default function AccessoryForm() {
  const { addAccessory, loading, error } = useAccessories();
  const [form, setForm] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addAccessory({
      ...form,
      imagenUrl: IMG_LENTE,
    });

    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-5 mb-5">
        <BaseInput
          label="Marca"
          name="marca"
          value={form.marca}
          required
          onChange={handleChange}
        />
        <BaseInput
          label="Material"
          name="material"
          value={form.material}
          required
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-5 mb-5">
        <BaseInput
          label="Precio Serie 1"
          name="precio_serie1"
          type="number"
          value={form.precio_serie1}
          onChange={handleChange}
        />
        <BaseInput
          label="Precio Serie 2"
          name="precio_serie2"
          type="number"
          value={form.precio_serie2}
          onChange={handleChange}
        />
        <BaseInput
          label="Precio Serie 3"
          name="precio_serie3"
          type="number"
          value={form.precio_serie3}
          onChange={handleChange}
        />
      </div>

      <button className="bg-blue text-white px-6 py-3 rounded-md">
        {loading ? "Guardando..." : "Guardar"}
      </button>

      {error && <p className="text-red mt-3">{error}</p>}
    </form>
  );
}
