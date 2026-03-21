"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import SingleGridItemProduct from "../Shop/SingleGridItemProduct";
import SingleListItem from "../Shop/SingleListItem";
//import { Lens } from "@/types/products";
import { useAccessories } from "@/hooks/products/accesories/useAccessories";

import { useEyeglasses } from "@/hooks/products/eyeglasses";

// Importación de tus 3 hooks
import { useLenses } from "@/hooks/products/useLenses";

// import { useFrames } from "@/hooks/products/useFrames";
// import { useAccessories } from "@/hooks/products/useAccessories";

const ShopProducts = () => {
  const [productSidebar, setProductSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Monturas");

  // Llamada a los hooks
  const { lenses, loading: loadingLenses } = useLenses();
  const {
  eyeglasses,
  loading: loadingFrames,
  getAllEyeglassesData,
} = useEyeglasses();
  // const { frames, loading: loadingFrames } = useFrames();
  // const { accessories, loading: loadingAcc } = useAccessories();
  const {
  accessories,
  loading: loadingAcc,
  getAllAccessoriesData,
} = useAccessories();
  // Lógica para decidir qué productos mostrar
  const productMap = {
  Lentes: {
    data: lenses,
    loading: loadingLenses,
  },
  Monturas: {
    data: eyeglasses,
    loading: loadingFrames,
  },
  Accesorios: {
    data: accessories,
    loading: loadingAcc,
  },
};

const current = productMap[selectedCategory] || {
  data: [],
  loading: false,
};

const currentProducts = current.data;
const isLoading = current.loading;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    };
    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);
  const normalizeProduct = (item: any) => {
  const safeImage =
    item.imagenUrl && item.imagenUrl.startsWith("http")
      ? item.imagenUrl
      : "https://via.placeholder.com/300x300?text=Sin+imagen";

  return {
    id: item.id,

    producto: {
      nombre: item.nombre || item.marca || "Accesorio",
      precio: item.precio || 0,
      descripcion: item.descripcion || "",
    },

    imagenUrl: safeImage, // 🔥 aquí

    imgs: {
      thumbnails: [safeImage],
      previews: [safeImage],
    },
  };
};

  const categories = [
  { name: "Monturas", products: eyeglasses?.length || 0 },
    // { name: "Accesorios", products: accessories?.length || 0 },
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

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
              >
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

            {/* Main Content */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <p>
                    Mostrando{" "}
                    <span className="text-dark font-bold">
                      {currentProducts.length}
                    </span>{" "}
                    {selectedCategory}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <p className="text-xl">Cargando {selectedCategory}...</p>
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="bg-white p-10 rounded-lg text-center shadow-1">
                  <p>
                    No se encontraron productos en la categoría{" "}
                    {selectedCategory}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9">
                  {currentProducts.map((item) => (
  <SingleGridItemProduct
    item={normalizeProduct(item)}
    key={item.id}
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
