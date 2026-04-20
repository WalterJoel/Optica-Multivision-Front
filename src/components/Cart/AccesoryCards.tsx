"use client";

import Image from "next/image";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { BaseButton } from "../Common/Buttons";
import { useBasicAccessories } from "@/hooks/products/accesories";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useEffect } from "react";
import { IAccessory } from "@/types/products";
import { CartItem } from "@/types/cart";
import { TipoProducto } from "@/commons/constants";

export function AccessoryCards() {
  const { basicAccessories, getAllBasicAccessories } = useBasicAccessories();
  const dispatch = useDispatch<AppDispatch>();

  // 1. Traemos los items del carrito para validar
  const cartItems = useSelector((state: RootState) => state.cartReducer.items);

  const handleAddToCart = (acc: IAccessory) => {
    // 2. Validamos si ya existe antes de despachar
    if (cartItems.some((item) => item.id === acc.id)) return;

    const itemToCart: CartItem = {
      id: acc.id,
      // productId: acc.productoId, //Ojo revisar
      productId: acc.id, //TODO:Ojo revisar se cambio a la mala por temas de COMPILACION
      price: acc.precio,
      productName: acc.nombre,
      productType: TipoProducto.ACCESORIO,
      quantity: 1,
      discount: 0,
      esf: null,
      cyl: null,
      isLens: false,
      imgs: {
        thumbnails: [acc.imagenUrl],
        previews: [acc.imagenUrl],
      },
    };

    dispatch(addItemToCart(itemToCart));
  };

  useEffect(() => {
    getAllBasicAccessories();
  }, []);

  return (
    <div className="w-[420px] flex flex-col h-full">
      <h3 className="text-xl font-bold text-dark mb-6">
        Añade un accesorio a tu compra
      </h3>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[420px] custom-scrollbar">
        {basicAccessories.map((acc) => {
          const alreadyAdded = cartItems.some((item) => item.id === acc.id);

          return (
            <div
              key={acc.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-blue bg-blue-light-6 shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-white flex items-center justify-center border border-blue-light-5">
                  <Image
                    src={acc.imagenUrl}
                    alt={acc.nombre}
                    width={72}
                    height={72}
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-blue leading-tight">
                    {acc.nombre}
                  </span>
                  <span className="text-slate-700 font-bold text-[15px] mt-1">
                    S/ {acc.precio}
                  </span>
                </div>
              </div>

              <BaseButton
                onClick={() => handleAddToCart(acc)}
                fullWidth={false}
                disabled={alreadyAdded}
                className={`group relative flex items-center justify-center rounded-xl  ${
                  alreadyAdded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue text-white hover:bg-blue-dark active:scale-95"
                }`}
              >
                {alreadyAdded ? (
                  <Check size={20} />
                ) : (
                  <ShoppingCart size={20} />
                )}

                {!alreadyAdded && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <Plus size={12} className="text-blue font-bold" />
                  </div>
                )}
              </BaseButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
