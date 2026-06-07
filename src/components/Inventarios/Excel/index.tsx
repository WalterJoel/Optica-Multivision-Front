"use client";

import React, { useState } from "react";
import { FileSpreadsheet, ShoppingCart } from "lucide-react";
import { TipoProducto } from "@/commons/constants";
import { DropCrearMonturas } from "./Monturas/crear/DropCrearMonturas";
import { DropEditarMonturas } from "./Monturas/editar/DropEditarMonturas";
import { DropCrearAccesorios } from "./Accesorios/crear/DropCrearAccesorios";
import { DropEditarAccesorios } from "./Accesorios/editar/DropEditarAccesorios";

export const ExcelInventarios = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    TipoProducto.MONTURA,
  );

  const categories = [TipoProducto.MONTURA, TipoProducto.ACCESORIO];

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* HEADER (INTOCABLE) */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <FileSpreadsheet className="text-blue-light" size={24} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-[4px] bg-yellow-dark rounded-full" />
                <p className="text-[10px] sm:text-[11px] font-semibold text-blue-light uppercase tracking-[4px]">
                  PRODUCTOS MASIVOS
                </p>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark">
                CARGAR{" "}
                <span className="text-blue-light font-semibold">Datos</span>
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
                    className={`absolute inset-0 blur-xl rounded-xl transition ${
                      isActive ? "bg-blue-light/20" : "bg-transparent"
                    }`}
                  />

                  <div
                    className={`relative px-4 py-2 rounded-xl text-sm font-bold border transition flex items-center gap-2
                    ${
                      isActive
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

        {selectedCategory === TipoProducto.MONTURA && (
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 xl:col-span-6">
              <DropCrearMonturas />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <DropEditarMonturas />
            </div>
          </div>
        )}

        {selectedCategory === TipoProducto.ACCESORIO && (
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 xl:col-span-6">
              <DropCrearAccesorios />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <DropEditarAccesorios />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

