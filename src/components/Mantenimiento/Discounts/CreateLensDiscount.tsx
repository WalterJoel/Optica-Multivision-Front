"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BaseInput } from "@/components/Common/Inputs";
import { BaseButton } from "@/components/Common/Buttons";

interface Series {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
  icono: string;
}

const SeriesDescuentos = () => {
  const [series, setSeries] = useState<Series[]>([
    {
      id: 1,
      nombre: "Serie 1",
      precio: 100,
      descuento: 0,
      icono: "/images/icons/serie1.png",
    },
    {
      id: 2,
      nombre: "Serie 2",
      precio: 150,
      descuento: 0,
      icono: "/images/icons/serie2.png",
    },
    {
      id: 3,
      nombre: "Serie 3",
      precio: 200,
      descuento: 0,
      icono: "/images/icons/serie3.png",
    },
  ]);

  const [selectedId, setSelectedId] = useState<number>(series[0].id);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleDescuentoChange = (valor: number) => {
    setSeries((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, descuento: valor } : s)),
    );
  };

  const filteredSeries = series.filter((s) =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedSerie = series.find((s) => s.id === selectedId)!;

  return (
    <div className="flex flex-col gap-8 p-6 w-full max-w-5xl mx-auto">
      {/* Buscador */}
      <div className="w-full">
        <BaseInput
          label="Buscar Cliente"
          name="customerSearch"
          type="text"
          placeholder="Buscar por DNI, nombre o apellido"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="w-full">
        <BaseInput
          label="Buscar Lente"
          name="customerSearch"
          type="text"
          placeholder="Buscar por DNI, nombre o apellido"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* Label Seleccione la serie */}
      <div className="w-full text-left">
        <label className="text-sm font-medium text-gray-600">
          Seleccione la Serie
        </label>
      </div>

      {/* Cuadros de series */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {filteredSeries.map((s) => {
          const isSelected = selectedId === s.id;

          return (
            <motion.div
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`flex flex-col items-center rounded-xl cursor-pointer border transition-all duration-200
                ${isSelected ? "border-4 border-blue-dark shadow-lg" : "border-gray-300"}
              `}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 15px rgba(0,0,0,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Reducimos padding para que el borde quede más pegado */}
              <div className="p-2 flex flex-col items-center">
                <Image
                  src={s.icono}
                  alt={s.nombre}
                  width={160}
                  height={160}
                  unoptimized
                  className="object-contain"
                />
                <h3 className="font-bold text-center text-xl mt-2">
                  {s.nombre}
                </h3>
                <p className="text-center text-lg">Precio: ${s.precio}</p>
              </div>
            </motion.div>
          );
        })}
        {filteredSeries.length === 0 && (
          <p className="text-gray-500 mt-4">No se encontraron lentes</p>
        )}
      </div>

      {/* Input de descuento con aviso a la derecha */}
      <div className="w-full mt-5 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xs">
          <BaseInput
            label="Monto de Descuento"
            type="number"
            min={0}
            max={selectedSerie.precio}
            value={selectedSerie.descuento}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDescuentoChange(Number(e.target.value))
            }
            placeholder="Descuento"
          />
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">
          *** Este descuento se aplicará para todas las sedes
        </span>
      </div>

      {/* Botón */}
      <div className="mt-8 flex justify-center">
        <BaseButton type="submit" className="min-w-[240px]">
          Crear descuento
        </BaseButton>
      </div>
    </div>
  );
};

export default SeriesDescuentos;
