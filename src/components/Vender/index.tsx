"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { TipoProducto } from "@/commons/constants";

import ListEyeGlasses from "../Listados/ListEyeGlasses";
import ListLens from "../Listados/ListLens";
import ListAccesories from "../Listados/ListAccesories";

import MonturaFilters from "./MonturasFilter";
import AccessoryFilters from "./AccesoriosFilter";

export default function Vender() {
  const [selectedCategory, setSelectedCategory] = useState(
    TipoProducto.LENTE,
  );

  /* FILTROS SEPARADOS */
  const [monturaFilters, setMonturaFilters] = useState({
    sexo: "",
    formaFacial: "",
    precioMin: 0,
    precioMax: 9999,
    search: "",
    codigo: "",
  });

  const [accessoryFilters, setAccessoryFilters] = useState({
    search: "",
    precioMin: 0,
    precioMax: 9999,
  });

  const categories = [
    TipoProducto.MONTURA,
    TipoProducto.LENTE,
    TipoProducto.ACCESORIO,
  ];

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* HEADER (INTOCABLE) */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
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

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark">
                Explora todos los{" "}
                <span className="text-blue-light font-semibold">productos</span>
              </h1>
            </div>
          </div>

          {/* CATEGORÍAS (IGUAL) */}
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative group"
                >
                  <div
                    className={`absolute inset-0 blur-xl rounded-xl transition ${isActive ? "bg-blue-light/20" : "bg-transparent"
                      }`}
                  />

                  <div
                    className={`relative px-4 py-2 rounded-xl text-sm font-bold border transition flex items-center gap-2
                    ${isActive
                        ? "bg-white border-blue-light text-blue-light shadow-testimonial"
                        : "bg-white border-gray-200 text-gray-500 hover:border-blue-light hover:text-blue-light"
                      }`}
                  >
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

        {/* ===================== */}
        {/* FILTROS */}
        {/* ===================== */}

        {selectedCategory === TipoProducto.MONTURA && (
          <div className="mb-10">
            <MonturaFilters
              filters={monturaFilters}
              setFilters={setMonturaFilters}
            />
          </div>
        )}

        {selectedCategory === TipoProducto.ACCESORIO && (
          <div className="mb-10">
            <AccessoryFilters
              filters={accessoryFilters}
              setFilters={setAccessoryFilters}
            />
          </div>
        )}

        {/* LISTAS */}
        {selectedCategory === TipoProducto.MONTURA && (
          <ListEyeGlasses filters={monturaFilters} />
        )}

        {selectedCategory === TipoProducto.LENTE && <ListLens />}

        {selectedCategory === TipoProducto.ACCESORIO && (
          <ListAccesories filters={accessoryFilters} />
        )}
      </div>
    </div>
  );
}
