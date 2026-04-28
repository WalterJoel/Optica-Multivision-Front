"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { TipoProducto } from "@/commons/constants";
import ListEyeGlasses from "../Shop/ListEyeGlasses";
import ListLens from "../Shop/ListLens";
import ListAccesories from "../Shop/ListAccesories";

export default function Vender() {
  const [selectedCategory, setSelectedCategory] = useState(
    TipoProducto.MONTURA,
  );

  const [filters, setFilters] = useState({
    sexo: "",
    formaFacial: "",
    precioMin: 0,
    precioMax: 9999,
    search: "",
  });

  const categories = [
    TipoProducto.MONTURA,
    TipoProducto.LENTE,
    TipoProducto.ACCESORIO,
  ];

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <ShoppingCart size={26} className="text-blue-light" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-[4px] bg-yellow-dark rounded-full" />
                <p className="text-[10px] sm:text-[11px] font-semibold text-blue-light uppercase tracking-[4px]">
                  Listado
                </p>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark tracking-normal leading-snug">
                Explora todos los{" "}
                <span className="text-blue-light font-semibold">productos</span>
              </h1>
            </div>
          </div>

          {/* 🔥 CATEGORÍAS ESTILIZADAS */}
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative group"
                >
                  {/* GLOW */}
                  <div
                    className={`absolute inset-0 blur-xl rounded-xl transition ${
                      isActive ? "bg-blue-light/20" : "bg-transparent"
                    }`}
                  />

                  {/* BUTTON */}
                  <div
                    className={`relative px-4 py-2 rounded-xl text-sm font-bold  border border-blue-light-5 shadow-testimonial transition flex items-center gap-2
                    ${
                      isActive
                        ? "bg-white border-blue-light text-blue-light shadow-testimonial"
                        : "bg-white border-gray-200 text-gray-500 hover:border-blue-light hover:text-blue-light"
                    }`}
                  >
                    {/* DECORACIÓN */}
                    <span className="flex gap-[2px]">
                      <span className="w-[3px] h-3 bg-blue-light rounded-full" />
                      <span className="w-[3px] h-3 bg-yellow-dark rounded-full" />
                    </span>

                    {cat}
                  </div>
                </button>
              );
            })}
          </div>
        </header>

        {/* FILTROS SOLO PARA MONTURA */}
        {selectedCategory === TipoProducto.MONTURA && (
          <div className="mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-5 rounded-3xl" />

              <div className="relative bg-white border border-blue-light-5 rounded-3xl shadow-testimonial p-4">
                {/*  UNA SOLA FILA */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* 🔍 SEARCH */}
                  <div className="relative flex-1 min-w-[220px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-light text-sm">
                      🔍
                    </div>

                    <input
                      type="text"
                      placeholder="Buscar marca, material..."
                      value={filters.search || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-blue-light-5 text-sm outline-none focus:ring-2 focus:ring-blue-light/40 transition"
                    />
                  </div>

                  {/* SEXO */}
                  <select
                    value={filters.sexo}
                    onChange={(e) =>
                      setFilters({ ...filters, sexo: e.target.value })
                    }
                    className="h-10 px-3 rounded-xl border border-blue-light-5 text-sm bg-white"
                  >
                    <option value="">Sexo</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="MUJER">Mujer</option>
                    <option value="UNISEX">Unisex</option>
                  </select>

                  {/* FORMA */}
                  <select
                    value={filters.formaFacial}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        formaFacial: e.target.value,
                      })
                    }
                    className="h-10 px-3 rounded-xl border border-blue-light-5 text-sm bg-white"
                  >
                    <option value="">Forma</option>
                    <option value="OVALADO">Ovalado</option>
                    <option value="REDONDO">Redondo</option>
                    <option value="CUADRADO">Cuadrado</option>
                  </select>

                  {/* 💰 PRECIOS BOTONES */}
                  {[
                    { label: "S/0-100", min: 0, max: 100 },
                    { label: "S/100-200", min: 100, max: 200 },
                    { label: "S/200+", min: 200, max: 9999 },
                  ].map((r) => {
                    const isActive =
                      filters.precioMin === r.min &&
                      filters.precioMax === r.max;

                    return (
                      <button
                        key={r.label}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            precioMin: r.min,
                            precioMax: r.max,
                          })
                        }
                        className={`h-10 px-3 rounded-xl text-xs font-bold border transition
                ${
                  isActive
                    ? "bg-blue-light text-white border-blue-light shadow"
                    : "bg-white border-blue-light-5 text-gray-500 hover:bg-blue-light/10"
                }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}

                  {/* 🧹 LIMPIAR */}
                  <button
                    onClick={() =>
                      setFilters({
                        sexo: "",
                        formaFacial: "",
                        precioMin: 0,
                        precioMax: 9999,
                        search: "",
                      })
                    }
                    className="h-10 px-4 rounded-xl text-xs font-bold text-gray-400 hover:text-yellow-dark transition ml-auto"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LISTADOS */}
        {selectedCategory === TipoProducto.MONTURA && (
          <ListEyeGlasses filters={filters} />
        )}
        {selectedCategory === TipoProducto.LENTE && <ListLens />}
        {selectedCategory === TipoProducto.ACCESORIO && <ListAccesories />}
      </div>
    </div>
  );
}
