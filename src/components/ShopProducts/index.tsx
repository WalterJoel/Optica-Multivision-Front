"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import SingleGridItemProduct from "../Shop/SingleGridItemProduct";
import SingleListItem from "../Shop/SingleListItem";

// Importación de tus 3 hooks
import { useLenses } from "@/hooks/products/useLenses";
// import { useFrames } from "@/hooks/products/useFrames";
// import { useAccessories } from "@/hooks/products/useAccessories";

const ShopProducts = () => {
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Monturas");

  // Llamada a los hooks
  const { lenses, loading: loadingLenses } = useLenses();
  // const { frames, loading: loadingFrames } = useFrames();
  // const { accessories, loading: loadingAcc } = useAccessories();
  const frames = [
    {
      id: 1,
      marca: "Ray-Ban",
      material: "Acetato",
      medida: "52-18-145",
      color: "Negro Brillante",
      formaFacial: "Ovalado",
      sexo: "Unisex",
      // Imagen de montura negra clásica
      imagenUrl:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop",
      createdAt: Date.now(),
      producto: {
        id: 101,
        nombre: "Wayfarer Classic",
        precio: 150.0,
        descripcion: "Diseño icónico y atemporal.",
      },
    },
    {
      id: 2,
      marca: "Oakley",
      material: "O-Matter",
      medida: "55-17-140",
      color: "Azul Mate",
      formaFacial: "Cuadrado",
      sexo: "M",
      // Imagen de lentes deportivos de sol/montura
      imagenUrl:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
      createdAt: Date.now(),
      producto: {
        id: 102,
        nombre: "Holbrook Sport",
        precio: 130.0,
        descripcion: "Montura ligera para alto rendimiento.",
      },
    },
    {
      id: 3,
      marca: "Vogue",
      material: "Metal",
      medida: "50-19-135",
      color: "Dorado Rosa",
      formaFacial: "Redondo",
      sexo: "F",
      // Imagen de montura de metal elegante
      imagenUrl:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGVudGVzfGVufDB8fDB8fHww",
      createdAt: Date.now(),
      producto: {
        id: 103,
        nombre: "Light Metal Round",
        precio: 110.0,
        descripcion: "Elegancia minimalista para dama.",
      },
    },
    {
      id: 4,
      marca: "Carrera",
      material: "Inyectado",
      medida: "54-16-145",
      color: "Habana",
      formaFacial: "Cuadrado",
      sexo: "Unisex",
      // Imagen de lentes con estilo vintage/habana
      imagenUrl:
        "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdhZmFzJTIwZGUlMjBzb2x8ZW58MHx8MHx8fDA%3D",
      createdAt: Date.now(),
      producto: {
        id: 104,
        nombre: "Carrera 8822",
        precio: 145.0,
        descripcion: "Estilo vintage con materiales modernos.",
      },
    },
    {
      id: 5,
      marca: "Prada",
      material: "Pasta",
      medida: "53-18-140",
      color: "Transparente",
      formaFacial: "Gato",
      sexo: "F",
      // Imagen de montura moderna transparente
      imagenUrl:
        "https://images.unsplash.com/photo-1769414123505-d53607809609?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2FmYXMlMjBkZSUyMG1vZGF8ZW58MHx8MHx8fDA%3D",
      createdAt: Date.now(),
      producto: {
        id: 105,
        nombre: "Prada Cinema",
        precio: 210.0,
        descripcion: "Lujo y sofisticación italiana.",
      },
    },
    {
      id: 6,
      marca: "Gucci",
      material: "Metal",
      medida: "56-15-145",
      color: "Dorado/Verde",
      formaFacial: "Aviador",
      sexo: "Unisex",
      // Imagen de estilo aviador
      imagenUrl:
        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop",
      createdAt: Date.now(),
      producto: {
        id: 106,
        nombre: "Gucci Aviator Elite",
        precio: 280.0,
        descripcion: "El clásico aviador con el toque de Gucci.",
      },
    },
  ];
  // Lógica para decidir qué productos mostrar
  let currentProducts = [];
  let isLoading = false;

  if (selectedCategory === "Monturas") {
    currentProducts = frames || [];
    // isLoading = loadingFrames;
  } else if (selectedCategory === "Lentes") {
    currentProducts = lenses || [];
    // isLoading = loadingLenses;
  }
  // else if (selectedCategory === "Accesorios") {
  //   currentProducts = accessories || [];
  //   isLoading = loadingAcc;
  // }

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

  const categories = [
    { name: "Monturas", products: frames?.length || 0 },
    // { name: "Accesorios", products: accessories?.length || 0 },
    { name: "Lentes", products: lenses?.length || 0 },
  ];

  const sortOptions = [
    { label: "Últimos productos", value: "0" },
    { label: "Más vendidos", value: "1" },
  ];

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
                  <CustomSelect options={sortOptions} />
                  <p>
                    Mostrando{" "}
                    <span className="text-dark font-bold">
                      {currentProducts.length}
                    </span>{" "}
                    {selectedCategory}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setProductStyle("grid")}
                    className={`${productStyle === "grid" ? "bg-blue text-white" : "bg-gray-1 text-dark"} w-10.5 h-9 rounded-[5px] flex items-center justify-center`}
                  >
                    G
                  </button>
                  <button
                    onClick={() => setProductStyle("list")}
                    className={`${productStyle === "list" ? "bg-blue text-white" : "bg-gray-1 text-dark"} w-10.5 h-9 rounded-[5px] flex items-center justify-center`}
                  >
                    L
                  </button>
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
                <div
                  className={
                    productStyle === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                      : "flex flex-col gap-7.5"
                  }
                >
                  {currentProducts.map((item) =>
                    productStyle === "grid" ? (
                      <SingleGridItemProduct item={item} key={item.id} />
                    ) : (
                      <SingleListItem item={item} key={item.id} />
                    ),
                  )}
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
