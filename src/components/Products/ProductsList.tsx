"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useLenses } from "@/hooks/products/useLenses";
import CustomSelect from "@/components/ShopWithSidebar/CustomSelect";
import SingleGridItem from "@/components/Shop/SingleGridItem"; // podemos crear uno
import SingleListItem from "@/components/Shop/SingleListItem"; // podemos crear uno

export default function ProductList() {
  const { lenses, loading } = useLenses();
  const [productStyle, setProductStyle] = useState("grid");

  const options = [
    { label: "Últimos productos", value: "0" },
    { label: "Más vendidos", value: "1" },
    { label: "Antiguos", value: "2" },
  ];

  return (
    <>
      <Breadcrumb title="Lista de Productos" pages={["productos", "lista"]} />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            <div className="w-full">
              {/* Barra superior */}
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <CustomSelect options={options} />
                  <p>
                    Mostrando{" "}
                    <span className="text-dark">
                      {lenses.length} de {lenses.length} productos
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setProductStyle("grid")}
                    className={`${
                      productStyle === "grid"
                        ? "bg-blue border-blue text-white"
                        : "text-dark bg-gray-1 border-gray-3"
                    } flex items-center justify-center w-10.5 h-9 rounded-[5px] border`}
                  >
                    {/* ícono de grid */}▢
                  </button>
                  <button
                    onClick={() => setProductStyle("list")}
                    className={`${
                      productStyle === "list"
                        ? "bg-blue border-blue text-white"
                        : "text-dark bg-gray-1 border-gray-3"
                    } flex items-center justify-center w-10.5 h-9 rounded-[5px] border`}
                  >
                    {/* ícono de lista */}☰
                  </button>
                </div>
              </div>

              {/* Contenido Grid/List */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {loading && <p>Cargando lentes...</p>}
                {!loading && lenses.length === 0 && (
                  <p className="text-dark-5">No hay lentes registrados</p>
                )}
                {!loading &&
                  lenses.map((lens) =>
                    productStyle === "grid" ? (
                      <SingleGridItem key={lens.id} item={lens} />
                    ) : (
                      <SingleListItem key={lens.id} item={lens} />
                    ),
                  )}
              </div>

              {/* Paginación (opcional) */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    <li>
                      <button className="flex items-center justify-center w-8 h-9 rounded-[3px] disabled:text-gray-4">
                        {"<"}
                      </button>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex py-1.5 px-3.5 duration-200 rounded-[3px] bg-blue text-white"
                      >
                        1
                      </a>
                    </li>
                    <li>
                      <button className="flex items-center justify-center w-8 h-9 rounded-[3px] disabled:text-gray-4">
                        {">"}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
