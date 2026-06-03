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
import { useSessionUser } from "@/hooks/session";
import { Package } from "lucide-react";

/* FILTERS */
type Filters = {
  search?: string;
  precioMin?: number;
  precioMax?: number;
  color?: string;
};

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
    <div className="relative w-full h-[220px] overflow-hidden rounded-[1.6rem] p-[2px] shadow-md hover:shadow-lg transition flex">
      {/* BORDER */}
      <div className="absolute inset-0 flex">
        <div className={`w-1/2 h-full ${colors.left}`} />
        <div className={`w-1/2 h-full ${colors.right}`} />
      </div>

      {/* BODY */}
      <div className="relative bg-white rounded-[1.5rem] w-full flex items-stretch">
        {/* IMAGE */}
        <div className="w-[40%] bg-white flex items-center justify-center border-r border-yellow-light-2 rounded-[1.6rem] overflow-hidden p-2">
          {accessory.imagenUrl ? (
            <img
              src={accessory.imagenUrl}
              alt={accessory.nombre}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
              <span className="text-4xl leading-none">🧰</span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="w-[60%] p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-dark uppercase line-clamp-1">
              {accessory.nombre}
            </h3>

            <h3 className="text-[11px] text-gray-400 font-semibold">
              {accessory.codigoAccesorio || "Sin código"}
            </h3>

            <p className="text-[11px] text-gray-400 font-semibold">
              🎨 {accessory.color || "Sin color"}
            </p>




            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <Package size={18} />
              {accessory.producto?.cantidad ?? accessory.cantidad ?? 0}
            </p>
          </div>

          <div className="mt-2">
            <span className="font-black text-blue text-sm">
              S/ {accessory.precioVenta}
            </span>
          </div>

          <div className="mt-2 flex justify-end">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* LIST */
export default function ListAccessories({ filters }: { filters?: Filters }) {
  const dispatch = useDispatch<AppDispatch>();
  // Hooks
  const { sedeId } = useSessionUser()
  const { accessories, loading, getAllAccessoriesData } = useAccessories(sedeId);

  const ITEMS_PER_PAGE = 20;
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllAccessoriesData();
  }, []);

  /* 🔎 FILTRO COMPLETO */
  const filteredAccessories = useMemo(() => {
    const search = filters?.search?.toLowerCase() || "";
    const min = filters?.precioMin ?? 0;
    const max = filters?.precioMax ?? 999999;
    const color = filters?.color || "";

    return accessories.filter((item: IAccessory) => {
      const precio = Number(item.precioVenta) || 0;

      const matchSearch =
        !search ||
        item.nombre?.toLowerCase().includes(search) ||
        item.codigoAccesorio?.toLowerCase().includes(search);

      const matchPrecio = precio >= min && precio <= max;

      const matchColor =
        !color || item.color?.toLowerCase() === color.toLowerCase();

      return matchSearch && matchPrecio && matchColor;
    });
  }, [accessories, filters]);

  /* RESET PAGINATION */
  useEffect(() => {
    setPage(1);
  }, [filters]);

  /* PAGINACIÓN */
  const paginatedAccessories = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredAccessories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAccessories, page]);

  const totalPages = Math.ceil(filteredAccessories.length / ITEMS_PER_PAGE);

  const handleAddToCart = (item: IAccessory) => {
    const itemToCart: CartItem = {
      id: item.id,
      productName: (TipoProducto.ACCESORIO + " " + item.nombre).toUpperCase(),
      productId: item.producto?.id,
      price: item.precioVenta,
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

        {/* PAGINATION */}
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
