"use client";

import { BaseButton } from "@/components/Common/Buttons";
import { useAccessories } from "@/hooks/products/accesories/useAccessories";
import { IAccessory } from "@/types/products";
import { useEffect, useState, useMemo } from "react";

import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { CartItem } from "@/types/cart";
import { TipoProducto } from "@/commons/constants";

/* CARD */
function AccessoryCardFrame({
  accessory,
  children,
  variant = "blue",
}: {
  accessory: IAccessory;
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
    <div className="relative w-full min-h-[170px] overflow-hidden rounded-[1.6rem] p-[2px] shadow-md hover:shadow-lg transition flex">
      {/* BORDER */}
      <div className="absolute inset-0 flex">
        <div className={`w-1/2 h-full ${colors.left}`} />
        <div className={`w-1/2 h-full ${colors.right}`} />
      </div>

      {/* BODY */}
      <div className="relative bg-white rounded-[1.5rem] w-full flex items-stretch">
        {/* IMAGE */}
        <div className="w-[40%] bg-yellow-light-4 flex items-center justify-center border-r border-yellow-light-2 rounded-[1.6rem]">
          <span className="text-4xl">🧰</span>
        </div>

        {/* CONTENT */}
        <div className="w-[60%] p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-dark uppercase line-clamp-1">
              {accessory.nombre}
            </h3>

            <p className="text-[11px] text-gray-400 font-semibold">
              {accessory.atributo || "Sin descripción"}
            </p>
          </div>

          <div className="mt-2">
            <span className="font-black text-blue text-sm">
              S/ {accessory.precio}
            </span>
          </div>

          <div className="mt-2 flex justify-end">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* LIST */
export default function ListAccessories() {
  const dispatch = useDispatch<AppDispatch>();
  const { accessories, loading, getAllAccessoriesData } = useAccessories();

  const ITEMS_PER_PAGE = 20;
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllAccessoriesData();
  }, []);

  const paginatedAccessories = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return accessories.slice(start, start + ITEMS_PER_PAGE);
  }, [accessories, page]);

  const totalPages = Math.ceil(accessories.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [accessories]);

  const handleAddToCart = (item: IAccessory) => {
    const itemToCart: CartItem = {
      id: item.id,
      productName: (TipoProducto.ACCESORIO + " " + item.nombre).toUpperCase(),
      productId: item.productoId,
      price: item.precio,
      quantity: 1,
      productType: TipoProducto.ACCESORIO,
      discount: 0,
      cyl: null,
      esf: null,
      isLens: false,
      imgs: {
        thumbnails: [item.imagenUrl || ""],
        previews: [item.imagenUrl || ""],
      },
    };

    dispatch(addItemToCart(itemToCart));
  };

  return (
    <section className="py-12 bg-gray-2">
      <div className="max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {loading ? (
            <div className="col-span-full text-center text-blue text-xs font-bold">
              Cargando...
            </div>
          ) : paginatedAccessories.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 font-bold">
              Sin resultados
            </div>
          ) : (
            paginatedAccessories.map((item: IAccessory) => (
              <AccessoryCardFrame key={item.id} accessory={item}>
                <BaseButton onClick={() => handleAddToCart(item)}>
                  Agregar
                </BaseButton>
              </AccessoryCardFrame>
            ))
          )}
        </div>

        {!loading && totalPages > 1 && (
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
