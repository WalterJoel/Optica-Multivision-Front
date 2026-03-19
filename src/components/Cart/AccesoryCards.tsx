"use client";

import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";
import { BaseButton } from "../Common/Buttons";
import { useBasicAccessories } from "@/hooks/products/accesories";
import { useEffect } from "react";

export function AccessoryCards() {
  const { basicAccessories, getAllBasicAccessories } = useBasicAccessories();

  useEffect(() => {
    getAllBasicAccessories();
  }, []);

  return (
    <div className="w-[420px] flex flex-col h-full">
      {/* TITLE */}
      <h3 className="text-xl font-bold text-dark mb-6">
        Añade un accesorio a tu compra
      </h3>

      {/* LIST */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[420px] custom-scrollbar">
        {basicAccessories.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between p-4 rounded-2xl border border-blue bg-blue-light-6 shadow-md transition-all duration-300"
          >
            {/* INFO */}
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
              onClick={() => console.log("n")}
              fullWidth={false}
              className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-blue text-white shadow-sm hover:bg-blue-dark transition-all duration-300 active:scale-95"
            >
              <ShoppingCart size={20} />
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <Plus size={12} className="text-blue font-bold" />
              </div>
            </BaseButton>
          </div>
        ))}
      </div>
    </div>
  );
}
