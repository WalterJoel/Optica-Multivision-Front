"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import ListEyeGlasses from "../Shop/ListEyeGlasses";
import { TipoProducto } from "@/commons/constants";
import ListLens from "../Shop/ListLens";
// import { Lens } from "@/types/products";

const ShopProducts = () => {
  const [productSidebar, setProductSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(TipoProducto.LENTE);
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
    { name: TipoProducto.MONTURA },
    // { name: "Accesorios", products: accessories?.length || 0 },
    { name: TipoProducto.LENTE },
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
                  <p>
                    Mostrando{" "}
                    <span className="text-dark font-bold">
                      {/* {currentProducts.length} */}
                    </span>{" "}
                    {selectedCategory}
                  </p>
                </div>
              </div>
              {selectedCategory === TipoProducto.MONTURA && <ListEyeGlasses />}
              {selectedCategory === TipoProducto.LENTE && <ListLens />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopProducts;
