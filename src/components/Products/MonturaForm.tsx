"use client";

import { useState } from "react";
import { useMonturas } from "@/hooks/products";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { PRODUCTOS } from "@/commons/constants";
import { CreateMontura } from "@/types/products";

const initialForm: CreateMontura = {
  fecha: "",
  material: "",
  marca: "",
  sede: "",
  codigo_interno: "",
  codigo_montura: "",
  talla: "",
  color: "",
  precio_compra: 0,
  precio_venta: 0,
  stock: 0,
  tipo: PRODUCTOS.MONTURA,
};

export default function MonturaForm() {
  const { addMontura, loading, error } = useMonturas();
  const [form, setForm] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMontura(form);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <BaseInput
        label="Fecha"
        name="fecha"
        value={form.material}
        type="date"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Material"
        value={form.material}
        name="material"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Marca"
        value={form.material}
        name="marca"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Sede"
        value={form.material}
        name="sede"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Código Interno"
        value={form.material}
        name="codigo_interno"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Código Montura"
        value={form.material}
        name="codigo_montura"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Talla"
        value={form.material}
        name="talla"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Color"
        value={form.material}
        name="color"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Precio Compra"
        value={form.material}
        name="precio_compra"
        type="number"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Precio Venta"
        value={form.material}
        name="precio_venta"
        type="number"
        required
        onChange={handleChange}
      />
      <BaseInput
        label="Stock"
        value={form.material}
        name="stock"
        type="number"
        required
        onChange={handleChange}
      />

      <button disabled={loading} className="bg-blue text-white py-3 rounded">
        {loading ? "Guardando..." : "Guardar Montura"}
      </button>

      {error && <p className="text-red">{error}</p>}
    </form>
  );
}
