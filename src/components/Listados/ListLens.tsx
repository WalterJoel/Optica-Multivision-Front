"use client";

import { useLenses } from "@/hooks/products";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageWithZoom } from "@/components/Common/ImageWithZoom";
import { useMemo } from "react";
import { PrioridadLentes } from "@/commons/constants";

function LensCardFrame({
  lens,
  children,
  variant = "blue",
}: {
  lens: any;
  children?: React.ReactNode;
  variant?: "blue" | "red" | "yellow";
}) {
  const borderPairs = {
    blue: { left: "bg-blue", right: "bg-yellow" },
    red: { left: "bg-red-600", right: "bg-red-400" },
    yellow: { left: "bg-yellow", right: "bg-blue" },
  };

  const colors = borderPairs[variant];

  return (
    <div className="relative w-full max-w-[380px] mx-auto overflow-hidden rounded-[1.6rem] p-[2px] shadow-md hover:shadow-lg transition">
      {/* BORDER */}
      <div className="absolute inset-0 flex">
        <div className={`w-1/2 h-full ${colors.left}`} />
        <div className={`w-1/2 h-full ${colors.right}`} />
      </div>

      {/* BODY */}
      <div className="relative bg-white rounded-[1.5rem] w-full">
        <div className="p-4 flex flex-col items-center text-center gap-2">
          {/* LOGO */}
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-blue rounded-full" />
            <div className="w-1 h-3 bg-yellow rounded-full" />
            <span className="text-[9px] font-black text-slate-300 uppercase">
              Multivision
            </span>
          </div>

          {/* FOTO / ICONO */}
          <div className="w-20 h-20 bg-yellow-light-4 rounded-xl flex items-center justify-center border border-yellow-light-2 overflow-hidden p-2">
            <ImageWithZoom
              src={lens.imagenUrl}
              alt={lens.marca}
              className="w-full h-full"
              imgClassName="w-full h-full object-contain"
              placeholderUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGnQPr3op1MGXxOFrwPtuxTYNQM_1H3ZLsGA&s"
              fallbackIcon={<span className="text-4xl">👁️</span>}
            />
          </div>

          {/* NOMBRE + MATERIAL */}
          <div className="leading-none">
            <h3 className="text-[17px] font-black text-slate-900 uppercase">
              {lens.marca}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {lens.material}
            </span>
          </div>

          {/* PRECIOS (más compactos horizontalmente) */}
          <div className="flex items-center gap-2 text-[11px] mt-1">
            <span className="font-black text-blue">
              S/ {lens.precio_serie1}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-600">
              S/ {lens.precio_serie2}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-600">
              S/ {lens.precio_serie3}
            </span>
          </div>

          {/* BOTÓN */}
          <div className="w-full mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ListLens() {
  const router = useRouter();
  const { lenses, loading } = useLenses();

  // Ordenar por prioridad: PrioridadLentes (1 a 5), luego el resto
  const sortedLenses = useMemo(() => {
    return [...lenses].sort((a, b) => {
      const aVal = a.prioridad !== null && a.prioridad !== undefined ? Number(a.prioridad) : 999;
      const bVal = b.prioridad !== null && b.prioridad !== undefined ? Number(b.prioridad) : 999;

      if (aVal !== bVal) {
        return aVal - bVal;
      }
      return (a.marca || "").localeCompare(b.marca || "");
    });
  }, [lenses]);

  // mode:Stock para que pueda editar la matriz
  const handleOpenMatrix = (id: number) => {
    router.push(`/matrix?lenteId=${id}&mode=stockS`);
  };

  return (
    <>
      <section className="py-12 bg-gray-2">
        <div className="max-w-[1740px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 justify-items-center gap-6">
            {loading ? (
              <div className="col-span-full text-center text-blue text-xs font-bold">
                Cargando...
              </div>
            ) : (
              sortedLenses.map((lens) => (
                <LensCardFrame key={lens.id} lens={lens}>
                  <Link
                    href={{
                      pathname: "/matrix",
                      query: { lenteId: lens.id, mode: "stock" },
                    }}
                    className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark shadow-md"
                  >
                    Abrir Matriz
                  </Link>
                </LensCardFrame>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
