"use client";

import { ClassificationBadge } from "@/components/Common/ClassificationBadge";
import { ImageWithZoom } from "@/components/Common/ImageWithZoom";
import { BaseButton } from "@/components/Common/Buttons";
import { useEyeglasses } from "@/hooks/products/eyeglasses";
import { IEyeglass } from "@/types/products";
import { useEffect, useState, useMemo } from "react";

import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { CartItem } from "@/types/cart";
import { TipoProducto } from "@/commons/constants";
import { useSessionUser } from "@/hooks/session";
import { Package } from "lucide-react";

/* 🆕 TIPADO DE FILTROS (no rompe nada) */
type Filters = {
  sexo?: string;
  formaFacial?: string;
  precioMin?: number;
  precioMax?: number;
  search?: string;
  clasificacion?: string;
};

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
    <div className="relative w-full min-h-[170px] overflow-hidden rounded-[1.6rem] p-[2px] shadow-md hover:shadow-lg transition flex">
      {/* BORDER */}
      <div className="absolute inset-0 flex">
        <div className={`w-1/2 h-full ${colors.left}`} />
        <div className={`w-1/2 h-full ${colors.right}`} />
      </div>

      {/* BODY */}
      <div className="relative bg-white rounded-[1.5rem] w-full flex items-stretch">
        {/* LEFT IMAGE */}
        <div className="w-[40%] bg-white flex items-center justify-center border-r border-yellow-light-2 rounded-[1.6rem] overflow-hidden p-2">
          <ImageWithZoom
            src={eyeglass.imagenUrl}
            alt={eyeglass.marca}
            className="w-full h-full"
            imgClassName="w-full h-full object-contain"
            placeholderUrl="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800"
            fallbackIcon={
              <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                <span className="text-4xl leading-none">👓</span>
              </div>
            }
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-[60%] p-4 flex flex-col justify-between">
          {/* TOP */}
          <div>
            <h3 className="text-sm font-black text-dark uppercase line-clamp-1">
              {eyeglass.marca}
            </h3>

            <h3 className="text-[11px] text-gray-400 font-semibold">
              {eyeglass.codigo}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-gray-400 font-semibold">
                {eyeglass.material} • {eyeglass.color}
              </span>
              <ClassificationBadge text={eyeglass.clasificacion} />
            </div>

            <p className="text-[10px] text-gray-500 mt-1">
              📐 {eyeglass.talla} • {eyeglass.formaFacial}
            </p>

            <p className="text-[10px] text-gray-500">👤 {eyeglass.sexo}</p>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <Package size={18} />
              {eyeglass.producto?.cantidad}
            </p>
          </div>

          {/* PRICE */}
          <div className="mt-2">
            <span className="font-black text-blue text-sm">
              S/ {eyeglass.precioVenta}
            </span>
          </div>

          {/* ACTION */}
          <div className="mt-2 flex justify-end">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* Filters es opcional */
export default function ListEyeglasses({ filters }: { filters?: Filters }) {
  const { sedeId } = useSessionUser();

  const dispatch = useDispatch<AppDispatch>();
  const { eyeglasses, loading, getAllEyeglassesData } = useEyeglasses(sedeId);

  const ITEMS_PER_PAGE = 20;
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllEyeglassesData();
  }, []);

  /* FILTRADO */
  const filteredEyeglasses = useMemo(() => {
    const sexo = filters?.sexo?.toUpperCase();
    const forma = filters?.formaFacial?.toUpperCase();
    const search = filters?.search?.toLowerCase() || "";
    const clasificacion = filters?.clasificacion?.toUpperCase() || "";

    const min = filters?.precioMin ?? 0;
    const max = filters?.precioMax ?? 999999;

    return eyeglasses.filter((p: IEyeglass) => {
      const precio = Number(p.precioVenta) || 0;

      const matchSexo = !sexo || p.sexo?.toUpperCase() === sexo;
      const matchForma = !forma || p.formaFacial?.toUpperCase() === forma;
      const matchClasificacion = !clasificacion || p.clasificacion?.toUpperCase() === clasificacion;

      const matchPrecio = precio >= min && precio <= max;

      const matchSearch =
        !search ||
        p.marca?.toLowerCase().includes(search) ||
        p.material?.toLowerCase().includes(search) ||
        p.color?.toLowerCase().includes(search) ||
        p.codigo?.toLowerCase().includes(search);

      return matchSexo && matchForma && matchPrecio && matchSearch && matchClasificacion;
    });
  }, [eyeglasses, filters]);

  /*  RESET PAGE CUANDO CAMBIA FILTRO */
  useEffect(() => {
    setPage(1);
  }, [filters]);

  /*  PAGINACIÓN SOBRE FILTRADOS */
  const paginatedEyeglasses = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredEyeglasses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEyeglasses, page]);

  const totalPages = Math.ceil(filteredEyeglasses.length / ITEMS_PER_PAGE);

  const handleAddToCart = (eyeGlass: IEyeglass) => {
    const itemToCart: CartItem = {
      id: eyeGlass.id,
      productName: (TipoProducto.MONTURA + " " + eyeGlass.marca).toUpperCase(),
      productId: eyeGlass.producto?.id,
      price: eyeGlass.precioVenta,
      quantity: 1,
      stock: eyeGlass.producto?.cantidad ?? 0,
      productType: TipoProducto.MONTURA,
      discount: 0,
      cyl: null,
      esf: null,
      isLens: false,
      imagenUrl: eyeGlass.imagenUrl,
      imgs: {
        thumbnails: [
          eyeGlass.imagenUrl || "",
        ],
        previews: [
          eyeGlass.imagenUrl || "",
        ],
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
          ) : paginatedEyeglasses.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 font-bold">
              Sin resultados
            </div>
          ) : (
            paginatedEyeglasses.map((eyeglass: IEyeglass) => {
              const cantidad = eyeglass.producto?.cantidad ?? eyeglass.cantidad ?? 0;
              return (
                <EyeglassCardFrame key={eyeglass.id} eyeglass={eyeglass}>
                  <BaseButton
                    onClick={() => handleAddToCart(eyeglass)}
                    disabled={cantidad <= 0}
                  >
                    Agregar
                  </BaseButton>
                </EyeglassCardFrame>
              );
            })
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
