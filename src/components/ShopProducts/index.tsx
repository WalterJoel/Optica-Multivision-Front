"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import SingleGridItemProduct from "../Shop/SingleGridItemProduct";

import { useAccessories } from "@/hooks/products/accesories/useAccessories";
import { useEyeglasses } from "@/hooks/products/eyeglasses";
import { useLenses } from "@/hooks/products/useLenses";

import { IMG_PRODUCTOS, PRODUCTOS } from "@/commons/constants";

const ShopProducts = () => {
  const [productSidebar, setProductSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Monturas");

  // Hooks
  const { lenses, loading: loadingLenses } = useLenses();

  const {
    eyeglasses,
    loading: loadingFrames,
    getAllEyeglassesData,
  } = useEyeglasses();

  const {
    accessories,
    loading: loadingAcc,
    getAllAccessoriesData,
  } = useAccessories();

  // Mapa de productos
  const productMap = {
    Lentes: { data: lenses, loading: loadingLenses },
    Monturas: { data: eyeglasses, loading: loadingFrames },
    Accesorios: { data: accessories, loading: loadingAcc },
  };

  const current = productMap[selectedCategory] || {
    data: [],
    loading: false,
  };

  const currentProducts = current.data;
  const isLoading = current.loading;

  // 🔥 MAPEO SEGURO DE CATEGORÍA → TIPO
  const getTipoProducto = () => {
    switch (selectedCategory) {
      case "Lentes":
        return PRODUCTOS.LENTE;
      case "Monturas":
        return PRODUCTOS.MONTURA;
      case "Accesorios":
        return PRODUCTOS.ACCESORIO;
      default:
        return PRODUCTOS.ACCESORIO;
    }
  };

  // 🔥 NORMALIZADOR FINAL
 const normalizeProduct = (item: any) => {
  const tipo = getTipoProducto();

  let safeImage = IMG_PRODUCTOS[tipo];

  // Solo los lentes usan imagen dinámica si existe
  if (
    selectedCategory === "Lentes" &&
    item.imagenUrl &&
    item.imagenUrl.startsWith("http")
  ) {
    safeImage = item.imagenUrl;
  }

  return {
    id: item.id,
    producto: {
      nombre: item.nombre || item.marca || "Producto",
      precio: item.precio || 0,
      descripcion: item.descripcion || "",
    },
    imagenUrl: safeImage,
    imgs: {
      thumbnails: [safeImage],
      previews: [safeImage],
    },
  };
};

  // Categorías
  const categories = [
    { name: "Monturas", products: eyeglasses?.length || 0 },
    { name: "Lentes", products: lenses?.length || 0 },
    { name: "Accesorios", products: accessories?.length || 0 },
  ];

  useEffect(() => {
    getAllEyeglassesData();
    getAllAccessoriesData();
  }, []);

  return (
    <>
      <Breadcrumb
        title="Explora todos los productos"
        pages={["shop", "/", "productos"]}
      />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            
            {/* Sidebar */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                className="xl:hidden absolute -right-12.5 sm:-right-8 w-8 h-8 rounded-md bg-white shadow-1 flex items-center justify-center"
              >
                ✕
              </button>

              <form className="flex flex-col gap-6">
                <CategoryDropdown
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                <GenderDropdown genders={[]} />
                <SizeDropdown />
                <ColorsDropdwon />
                <PriceDropdown />
              </form>
            </div>

            {/* Main */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6 flex justify-between">
                <p>
                  Mostrando{" "}
                  <span className="font-bold">
                    {currentProducts.length}
                  </span>{" "}
                  {selectedCategory}
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-20">
                  Cargando {selectedCategory}...
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="bg-white p-10 text-center">
                  No hay productos en {selectedCategory}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {currentProducts.map((item) => (
                    <SingleGridItemProduct
                      key={item.id}
                      item={normalizeProduct(item)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ShopProducts;