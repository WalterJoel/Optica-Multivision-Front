"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setMetodoPago } from "@/redux/features/sale-slice";
import { MetodoPago } from "@/commons/constants";

const paymentMethods: {
  key: MetodoPago;
  label: string;
  icon: string;
}[] = [
  {
    key: MetodoPago.EFECTIVO,
    label: "Efectivo",
    icon: "/images/cart/efectivo.png",
  },
  {
    key: MetodoPago.TRANSFERENCIA,
    label: "Interbancario",
    icon: "/images/cart/int.png",
  },
  { key: MetodoPago.YAPE, label: "Yape", icon: "/images/cart/yape.webp" },
  { key: MetodoPago.PLIN, label: "Plin", icon: "/images/cart/plin.webp" },
];

export default function PaymentMethodSelector() {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<MetodoPago | null>(null);

  const handleSelect = (method: MetodoPago) => {
    setSelected(method);
    dispatch(setMetodoPago(method));
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {paymentMethods.map((method) => {
        const isSelected = selected === method.key;

        return (
          <button
            key={method.key}
            onClick={() => handleSelect(method.key)}
            className={`
              relative overflow-hidden
              rounded-2xl p-[2px]
              transition-all duration-300
              min-h-[110px]
              ${
                isSelected
                  ? "scale-[1.02] shadow-[0_10px_30px_-10px_rgba(234,179,8,0.45)]"
                  : "hover:scale-[1.01]"
              }
            `}
          >
            <div className="absolute inset-0 flex">
              <div className="h-full w-1/2 bg-blue" />
              <div className="h-full w-1/2 bg-yellow" />
            </div>

            <div
              className={`
                relative z-10
                flex flex-col items-center justify-center gap-3
                rounded-[15px]
                bg-white h-full w-full py-5 px-3
                transition-all duration-300
                ${
                  isSelected
                    ? "bg-gradient-to-br from-blue/5 to-yellow/10"
                    : "hover:bg-slate-50"
                }
              `}
            >
              <div
                className={`relative z-10 transition-transform duration-300 ${
                  isSelected ? "scale-110" : ""
                }`}
              >
                <Image
                  src={method.icon}
                  alt={method.label}
                  width={90}
                  height={90}
                  className="w-auto h-[62px] object-contain"
                  unoptimized
                />
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 size={20} className="text-yellow" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
