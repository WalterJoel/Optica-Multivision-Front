"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { BaseButton } from "../Common/Buttons";
import { useKits } from "@/hooks/kits";

interface Kit {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

export default function KitCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedKitId, setSelectedKitId] = useState<number | null>(null);

  const { Kits, getAllLenses } = useKits();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    getAllLenses();
  }, []);

  return (
    <div className="w-full relative h-full">
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory w-full h-full"
      >
        {Kits.map((kit, index) => {
          const isSelected = selectedKitId === kit.id;

          return (
            <div
              key={`${kit.id}-${index}`}
              className="min-w-full w-full flex-none snap-center h-full p-4"
            >
              <div
                className={`grid grid-cols-[140px_1fr_140px] sm:grid-cols-[180px_1fr_180px] h-full items-center gap-4 transition-all duration-300 rounded-2xl border border-blue ${
                  isSelected
                    ? "bg-blue-light-6 shadow-md scale-[1.01]"
                    : "bg-white shadow-sm"
                }`}
              >
                {/* IMAGEN */}
                <div className="relative flex justify-center items-center h-full pl-6">
                  <div
                    className={`relative w-32 h-32 sm:w-40 sm:h-40 transition-transform duration-300 ${
                      isSelected ? "scale-105" : "scale-100"
                    }`}
                  >
                    <Image
                      src="/images/icons/kit.webp"
                      alt={kit.nombre}
                      fill
                      className="object-contain"
                      priority={index === 0}
                      sizes="(max-width: 768px) 130px, 180px"
                    />
                  </div>
                </div>

                {/* DETALLES */}
                <div className="flex flex-col justify-center items-center text-center h-full min-w-0 px-2">
                  <div className="w-full">
                    <h3 className="text-slate-900 font-bold text-xl sm:text-2xl mb-1 truncate">
                      {kit.nombre}
                    </h3>

                    <div className="min-h-[4rem] flex items-center justify-center mb-4">
                      <p className="text-slate-500 text-sm sm:text-base leading-tight line-clamp-3 max-w-[300px] mx-auto">
                        {kit.descripcion}
                      </p>
                    </div>

                    <div className="flex justify-center w-full">
                      <BaseButton
                        onClick={() => setSelectedKitId(kit.id)}
                        className={`!h-11 !w-full !max-w-[190px] !p-0 transition-all duration-300 ${
                          isSelected
                            ? "!bg-blue !border-blue"
                            : "!bg-blue hover:!bg-blue-dark"
                        }`}
                      >
                        <div className="flex items-center justify-center w-full h-full gap-2 px-4">
                          {isSelected && (
                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-white"
                            />
                          )}

                          <span className="text-[14px] font-bold text-white leading-none flex items-center justify-center">
                            {isSelected ? "Seleccionado" : "Seleccionar Kit"}
                          </span>
                        </div>
                      </BaseButton>
                    </div>
                  </div>
                </div>

                {/* PRECIO */}
                <div className="flex items-center justify-center h-full pr-8">
                  <div
                    className={`flex items-start leading-none select-none transition-colors ${
                      isSelected ? "text-blue" : "text-slate-800"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-bold mt-2 mr-1">
                      S/
                    </span>
                    <span className="text-5xl sm:text-4xl font-black tracking-tighter">
                      {kit.precio}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NAVEGACIÓN */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-md rounded-full p-2 border border-blue-light-5 text-slate-400 hover:text-blue transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-md rounded-full p-2 border border-blue-light-5 text-slate-400 hover:text-blue transition-all"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
