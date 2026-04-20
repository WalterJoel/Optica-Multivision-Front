"use client";

import { BaseButton } from "@/components/Common/Buttons";
import { useRouter } from "next/navigation";
import { useEyeglasses } from "@/hooks/products/eyeglasses";
import { IEyeglass } from "@/types/products";
import { useEffect, useState, useMemo } from "react";

import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { CartItem } from "@/types/cart";
import { TipoProducto } from "@/commons/constants";

function EyeglassCardFrame({
  eyeglass,
  children,
  variant = "blue",
}: {
  eyeglass: IEyeglass;
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
    <div className="relative w-full h-full min-h-[260px] overflow-hidden rounded-[1.6rem] p-[2px] shadow-md hover:shadow-lg transition flex">
      {/* BORDER */}
      <div className="absolute inset-0 flex">
        <div className={`w-1/2 h-full ${colors.left}`} />
        <div className={`w-1/2 h-full ${colors.right}`} />
      </div>

      {/* BODY */}
      <div className="relative bg-white rounded-[1.5rem] w-full flex flex-col">
        {/* CONTENT */}
        <div className="p-4 flex flex-col items-center text-center gap-2">
          {/* LOGO */}
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-blue rounded-full" />
            <div className="w-1 h-3 bg-yellow rounded-full" />
            <span className="text-[9px] font-black text-slate-300 uppercase">
              Multivision
            </span>
          </div>

          {/* ICON */}
          <div className="w-16 h-16 bg-yellow-light-4 rounded-xl flex items-center justify-center border border-yellow-light-2">
            <span className="text-4xl">👓</span>
          </div>

          {/* BRAND */}
          <div className="leading-none">
            <h3 className="text-[17px] font-black text-slate-900 uppercase line-clamp-2 min-h-[42px]">
              {eyeglass.marca}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {eyeglass.material}
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-1">
            <span className="font-black text-blue text-[13px]">
              S/ {eyeglass.precio}
            </span>
          </div>
        </div>

        {/* FOOTER (SIN ESPACIO EXTRA) */}
        <div className="px-4 pb-4 pt-0 flex justify-center">
          <div className="w-fit">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ListEyeglasses() {
  const dispatch = useDispatch<AppDispatch>();

  const { eyeglasses, loading, getAllEyeglassesData } = useEyeglasses();

  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);

  const handleAddToCart = (eyeGlass: IEyeglass) => {
    const itemToCart: CartItem = {
      id: eyeGlass.id,
      productName: (TipoProducto.MONTURA + " " + eyeGlass.marca).toUpperCase(),
      productId: eyeGlass?.producto?.id,
      price: eyeGlass.precio,
      quantity: 1,
      productType: TipoProducto.LENTE,
      discount: 0,
      cyl: null,
      esf: null,
      isLens: false,
      imgs: {
        thumbnails: [
          "https://www.flaticon.es/icono-gratis/anteojos-con-media-montura_27114",
        ],
        previews: [
          "https://www.flaticon.es/icono-gratis/anteojos-con-media-montura_27114",
        ],
      },
    };

    dispatch(addItemToCart(itemToCart));
  };

  /* PAGINACIÓN */
  const paginatedEyeglasses = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return eyeglasses.slice(start, start + ITEMS_PER_PAGE);
  }, [eyeglasses, page]);

  const totalPages = Math.ceil(eyeglasses.length / ITEMS_PER_PAGE);

  useEffect(() => {
    getAllEyeglassesData();
  }, []);

  return (
    <section className="py-12 bg-gray-2">
      <div className="max-w-[1740px] mx-auto px-4 sm:px-8">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {loading ? (
            <div className="col-span-full text-center text-blue text-xs font-bold">
              Cargando...
            </div>
          ) : (
            paginatedEyeglasses.map((eyeglass: IEyeglass) => (
              <EyeglassCardFrame key={eyeglass.id} eyeglass={eyeglass}>
                <BaseButton
                  fullWidth={false}
                  onClick={() => handleAddToCart(eyeglass)}
                >
                  Agregar
                </BaseButton>
              </EyeglassCardFrame>
            ))
          )}
        </div>

        {/* PAGINACIÓN */}
        {!loading && eyeglasses.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-white shadow rounded"
            >
              Anterior
            </button>

            <span className="text-sm font-bold">
              Página {page} de {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              className="px-3 py-1 bg-white shadow rounded"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
