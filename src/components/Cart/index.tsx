"use client";
import React from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Link from "next/link";
import AccessoryCards from "./AccesoryCards";
import KitCarousel from "./KitCarousel";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const mKits = [
    {
      id: 1,
      nombre: "Kit Premium Plus",
      descripcion:
        "Incluye cristales con filtro azul, estuche rígido y líquido de limpieza profesional.",
      imagen: "/kit-1.jpg",
    },
    {
      id: 2,
      nombre: "Kit Esencial",
      descripcion:
        "Lo básico para el cuidado de tus lentes: paño de microfibra y estuche de viaje.",
      imagen: "/images/icons/kit.webp",
    },
    {
      id: 3,
      nombre: "Kit Deportivo",
      descripcion:
        "Sujetadores de silicona y protección extra para actividades de alto impacto.",
      imagen: "/kit-3.jpg",
    },
  ];

  return (
    <>
      {cartItems.length > 0 ? (
        <section className="overflow-hidden pt-[200px] pb-20 bg-gray-2 min-h-screen">
          <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 xl:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10 items-start">
              {/* COLUMNA IZQUIERDA */}
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-semibold text-slate-800">
                  Tu Carrito de compras
                </h3>

                {/* TABLA PRODUCTOS */}
                <div className="bg-white rounded-[10px] shadow-1 overflow-hidden border border-gray-3">
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[900px]">
                      <div className="flex items-center py-5.5 px-7.5 border-b border-gray-3 bg-white">
                        <div className="min-w-[300px]">
                          <p className="text-dark font-medium">Producto</p>
                        </div>
                        <div className="min-w-[160px]">
                          <p className="text-dark font-medium">Cilindro</p>
                        </div>
                        <div className="min-w-[140px]">
                          <p className="text-dark font-medium">Precio</p>
                        </div>
                        <div className="min-w-[200px]">
                          <p className="text-dark font-medium">Cantidad</p>
                        </div>
                        <div className="min-w-[160px]">
                          <p className="text-dark font-medium">Subtotal</p>
                        </div>
                        <div className="min-w-[80px]">
                          <p className="text-dark text-right font-medium">
                            Acción
                          </p>
                        </div>
                      </div>
                      {cartItems.map((item, key) => (
                        <SingleItem item={item} key={key} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECCIÓN KITS + DESCUENTO: ALINEACIÓN PERFECTA */}
                <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
                  {/* BLOQUE IZQUIERDO: KITS */}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-xl font-semibold text-slate-800 mb-6">
                      ¡ Regala un Kit por su compra !
                    </h3>
                    <div className="bg-white rounded-[10px] shadow-1 border border-gray-3 h-[260px] relative overflow-hidden flex items-center">
                      <KitCarousel kits={mKits} />
                    </div>
                  </div>

                  {/* BLOQUE DERECHO: DESCUENTO */}
                  <div className="w-full md:w-[380px] flex-shrink-0">
                    <h3 className="text-xl font-semibold text-slate-800 mb-6">
                      ¿ Tienes algún descuento ?
                    </h3>
                    <div className="bg-white rounded-[10px] shadow-1 border border-gray-3 h-[260px] overflow-hidden">
                      <Discount />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA */}
              <div className="flex flex-col gap-10">
                <OrderSummary />
                <AccessoryCards
                  accesorios={[
                    {
                      id: 1,
                      nombre: "Spray limpiador 50 ml",
                      precio: 10,
                      imagen: "/images/products/product-01.jpg",
                    },
                    {
                      id: 2,
                      nombre: "Optipack",
                      precio: 25,
                      imagen: "/images/products/product-02.jpg",
                    },
                    {
                      id: 3,
                      nombre: "Pack de 3 Sprays",
                      precio: 30,
                      imagen: "/images/products/product-03.jpg",
                    },
                  ]}
                  onAdd={(id) => console.log(id)}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center pt-[200px] pb-20">
          <p className="pb-6 text-xl">Tu carrito está vacío</p>
          <Link
            href="/"
            className="inline-block bg-blue text-white px-10 py-3 rounded-md font-bold hover:bg-blue-dark transition"
          >
            Volver a la tienda
          </Link>
        </div>
      )}
    </>
  );
};

export default Cart;
