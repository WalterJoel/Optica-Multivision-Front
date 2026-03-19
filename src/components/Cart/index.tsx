"use client";
import React from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import Link from "next/link";
import { AccessoryCards } from "./AccesoryCards";
import KitCarousel from "./KitCarousel";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  return (
    <>
      {cartItems.length > 0 ? (
        <section className="overflow-hidden pt-[200px] pb-20 bg-gray-2 min-h-screen">
          <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 xl:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10 items-start">
              {/* COLUMNA IZQUIERDA */}
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-bold text-dark">
                  Tu Carrito de compras
                </h3>

                {/* TABLA PRODUCTOS */}
                <div className="bg-white rounded-[10px] shadow-1 overflow-hidden border border-gray-3">
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[900px]">
                      {/* HEADER */}
                      <div className="flex items-center py-5.5 px-7.5 border-b border-gray-3 bg-white text-sm">
                        <div className="flex-[2]">
                          <p className="text-dark font-medium">Producto</p>
                        </div>

                        <div className="flex-1 text-center">
                          <p className="text-dark font-medium">Esf / Cyl</p>
                        </div>

                        <div className="flex-1 text-center">
                          <p className="text-dark font-medium">Precio</p>
                        </div>

                        <div className="flex-1 text-center">
                          <p className="text-dark font-medium">Descuento</p>
                        </div>

                        <div className="flex-1 text-center">
                          <p className="text-dark font-medium">Cantidad</p>
                        </div>

                        <div className="flex-1 text-center">
                          <p className="text-dark font-medium">Subtotal</p>
                        </div>

                        <div className="w-12 text-right">
                          <p className="text-dark font-medium">Acción</p>
                        </div>
                      </div>

                      {/* ITEMS */}
                      {cartItems.map((item, key) => (
                        <SingleItem item={item} key={key} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* KITS + DESCUENTO */}
                <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
                  {/* KITS */}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-xl font-bold text-dark mb-6">
                      ¡ Regala un Kit por su compra !
                    </h3>

                    <div className="bg-white rounded-[10px] shadow-1 border border-gray-3 h-[260px] relative overflow-hidden flex items-center">
                      <KitCarousel />
                    </div>
                  </div>

                  {/* DESCUENTO */}
                  <div className="w-full md:w-[380px] flex-shrink-0">
                    <h3 className="text-xl font-bold text-dark mb-6">
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
                <AccessoryCards />
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
