"use client";

import React, { useState, useEffect, useRef } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { useStores } from "@/hooks/stores/useStores";

interface SedeSelectProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const SedeSelect = ({ value, onChange, className }: SedeSelectProps) => {
  const { sedes, loading } = useStores();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cerrar el menú al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Buscar la sede seleccionada actualmente
  const currentSede = sedes.find((sede) => sede.id === value);

  return (
    <div
      ref={containerRef}
      className={`relative w-full sm:w-auto ${className || ""}`}
    >
      {/* Botón disparador del Dropdown */}
      <button
        type="button"
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center justify-between gap-3 bg-white border-2 border-blue-light-4 rounded-2xl px-4 py-3 shadow-md hover:shadow-lg hover:border-blue-light-3 transition-all w-full sm:w-[220px] text-left cursor-pointer disabled:opacity-50"
      >
        <div className="flex items-center gap-3 truncate">
          <Building2 size={18} className="text-blue-light flex-shrink-0" />
          <span className="text-[13px] font-bold text-dark truncate">
            {loading && sedes.length === 0
              ? "Cargando sedes..."
              : currentSede?.nombre || "Seleccionar Sede"}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-blue-light transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Contenedor de opciones con diseño Premium */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white border-2 border-blue-light-5 rounded-2xl shadow-testimonial overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1.5 max-h-[240px] overflow-y-auto divide-y divide-gray-1">
            {sedes.length === 0 ? (
              <div className="px-4 py-3 text-[12px] text-dark-5 font-semibold text-center uppercase">
                No hay sedes disponibles
              </div>
            ) : (
              sedes.map((sede) => {
                const isSelected = sede.id === value;
                return (
                  <button
                    key={sede.id}
                    type="button"
                    onClick={() => {
                      onChange(sede.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left text-[13px] font-bold rounded-xl transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-light/10 text-blue-light"
                        : "text-dark hover:bg-beige hover:text-dark-2"
                    }`}
                  >
                    <Building2
                      size={14}
                      className={isSelected ? "text-blue-light" : "text-dark-5"}
                    />
                    <span className="truncate">{sede.nombre}</span>
                    {isSelected && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-blue-light" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
