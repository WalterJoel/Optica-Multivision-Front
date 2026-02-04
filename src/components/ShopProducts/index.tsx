"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import { useLenses } from "@/hooks/products/useLenses";
import SingleGridItemProduct from "../Shop/SingleGridItemProduct";
import SingleListItem from "../Shop/SingleListItem";

const ShopProducts = () => {
  const [productStyle, setProductStyle] = useState<"grid" | "list">("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { lenses, loading } = useLenses();

  useEffect(() => {
    const handleScroll = () => {
      setStickyMenu(window.scrollY >= 80);
    };

    const handleClickOutside = (event: MouseEvent) => {
      // casteamos el target a Element para poder usar closest
      const target = event.target as Element;
      if (!target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  return (
    <>
      <Breadcrumb
        title="Explora todos los productos"
        pages={["shop", "/", "shop with sidebar"]}
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
                className="xl:hidden absolute -right-12.5 sm:-right-8 w-8 h-8 rounded-md bg-white shadow-1"
              >
                {/* Icono toggle */}
              </button>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
              >
                <CategoryDropdown categories={[]} />
                <GenderDropdown genders={[]} />
                <SizeDropdown />
                <ColorsDropdwon />
                <PriceDropdown />
              </form>
            </div>

            {/* Content */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <CustomSelect options={options} />
                  <p>
                    Mostrando <span className="text-dark">{lenses.length}</span>{" "}
                    Productos
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setProductStyle("grid")}
                    className={`${
                      productStyle === "grid"
                        ? "bg-blue border-blue text-white"
                        : "text-dark bg-gray-1 border-gray-3"
                    } w-10.5 h-9 rounded-[5px] flex items-center justify-center`}
                  >
                    {/* Grid SVG */}
                  </button>
                  <button
                    onClick={() => setProductStyle("list")}
                    className={`${
                      productStyle === "list"
                        ? "bg-blue border-blue text-white"
                        : "text-dark bg-gray-1 border-gray-3"
                    } w-10.5 h-9 rounded-[5px] flex items-center justify-center`}
                  >
                    {/* List SVG */}
                  </button>
                </div>
              </div>

              {loading ? (
                <p>Cargando productos...</p>
              ) : lenses.length === 0 ? (
                <p>No hay productos disponibles.</p>
              ) : (
                <div
                  className={`${
                    productStyle === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                      : "flex flex-col gap-7.5"
                  }`}
                >
                  {lenses.map((lens) =>
                    productStyle === "grid" ? (
                      <SingleGridItemProduct item={lens} key={lens.id} />
                    ) : (
                      <SingleListItem item={lens} key={lens.id} />
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
