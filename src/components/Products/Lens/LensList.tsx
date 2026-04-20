"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { BaseButton } from "@/components/Common/Buttons";
import { useLenses } from "@/hooks/products";
import { useRouter } from "next/navigation";

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
    <div className="relative w-full overflow-hidden rounded-[1.6rem] p-[2px] shadow-md hover:shadow-lg transition">
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

          {/* ICONO (un poco más grande para compensar card ancho) */}
          <div className="w-16 h-16 bg-yellow-light-4 rounded-xl flex items-center justify-center border border-yellow-light-2">
            <span className="text-4xl">👓</span>
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

  // mode:Stock para que pueda editar la matriz
  const handleOpenMatrix = (id: number) => {
    router.push(`/matrix?lenteId=${id}&mode=stockS`);
  };

  return (
    <>
      <Breadcrumb title="Lentes" pages={["productos", "nuevo"]} />

      <section className="py-12 bg-gray-2">
        <div className="max-w-[1740px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {loading ? (
              <div className="col-span-full text-center text-blue text-xs font-bold">
                Cargando...
              </div>
            ) : (
              lenses.map((lens) => (
                <LensCardFrame key={lens.id} lens={lens}>
                  <BaseButton
                    fullWidth={false}
                    onClick={() => handleOpenMatrix(lens.id)}
                  >
                    Abrir matriz
                  </BaseButton>
                </LensCardFrame>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
