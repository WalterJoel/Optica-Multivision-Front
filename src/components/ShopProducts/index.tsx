"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import SingleGridItemProduct from "../Shop/SingleGridItemProduct";
import ProductDetailModal from "./ProductDetailModal";

import { useAccessories } from "@/hooks/products/accesories/useAccessories";
import { useEyeglasses } from "@/hooks/products/eyeglasses";
import { useLenses } from "@/hooks/products/useLenses";

import { IMG_PRODUCTOS, PRODUCTOS } from "@/commons/constants";

const ShopProducts = () => {
  const [productSidebar, setProductSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Monturas");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);
  const [loadingStock, setLoadingStock] = useState(false);

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

  const productMap: Record<string, { data: any[]; loading: boolean }> = {
    Lentes: { data: lenses || [], loading: loadingLenses },
    Monturas: { data: eyeglasses || [], loading: loadingFrames },
    Accesorios: { data: accessories || [], loading: loadingAcc },
  };

  const current = productMap[selectedCategory] || {
    data: [],
    loading: false,
  };

  const currentProducts = current.data;
  const isLoading = current.loading;

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

const normalizeProduct = (item: any) => {
  const tipo = getTipoProducto();
  const isLente = selectedCategory === "Lentes";

  let safeImage = IMG_PRODUCTOS[tipo];

  if (item?.imagenUrl && String(item.imagenUrl).startsWith("http")) {
    safeImage = item.imagenUrl;
  }

  const precioSerie1 = Number(item?.precio_serie1 ?? item?.precioSerie1 ?? 0);
  const precioSerie2 = Number(item?.precio_serie2 ?? item?.precioSerie2 ?? 0);
  const precioSerie3 = Number(item?.precio_serie3 ?? item?.precioSerie3 ?? 0);

  const precioNormal = Number(item?.precio ?? 0);

  return {
    id: item?.id,
    tipo,
    categoria: selectedCategory,

    nombre: item?.nombre || item?.marca || "Producto",
    marca: item?.marca || "Sin marca",
    material: item?.material || "",
    descripcion: item?.descripcion || "Sin descripción disponible",

    imagenUrl: safeImage,
    imgs: {
      thumbnails: [safeImage],
      previews: [safeImage],
    },

    // precio principal que usa la card normal
    precio: isLente ? precioSerie1 : precioNormal,

    // solo lentes usan series
    precio_serie1: precioSerie1,
    precio_serie2: precioSerie2,
    precio_serie3: precioSerie3,

    // stock base local si existiera
    stock: Number(item?.stock ?? item?.cantidad ?? 0),

    producto: {
      nombre: item?.nombre || item?.marca || "Producto",
      precio: isLente ? precioSerie1 : precioNormal,
      descripcion: item?.descripcion || "Sin descripción disponible",
      stock: Number(item?.stock ?? item?.cantidad ?? 0),
      marca: item?.marca || "Sin marca",
      tipo,
    },

    rawData: item,
  };
};

  const handleOpenDetail = async (product: any) => {
    setSelectedProduct(product);
    setOpenDetailModal(true);
    setLoadingStock(true);
    setStockData([]);

    try {
      // CAMBIA ESTA URL SEGÚN TU BACKEND REAL
      const res = await fetch(`http://localhost:3001/stock/producto/${product.id}`);
      if (!res.ok) throw new Error("No se pudo obtener el stock");

      const data = await res.json();
      setStockData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando stock:", error);
      setStockData([]);
    } finally {
      setLoadingStock(false);
    }
  };

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

            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6 flex justify-between">
                <p>
                  Mostrando <span className="font-bold">{currentProducts.length}</span>{" "}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((item) => {
                    const normalized = normalizeProduct(item);

                    return (
                      <SingleGridItemProduct
                        key={item.id}
                        item={normalized}
                        onQuickView={handleOpenDetail}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductDetailModal
        open={openDetailModal}
        onClose={() => {
          setOpenDetailModal(false);
          setSelectedProduct(null);
          setStockData([]);
        }}
        product={selectedProduct}
        stockData={stockData}
        loadingStock={loadingStock}
        selectedCategory={selectedCategory}
      />
    </>
  );
};

export default ShopProducts;