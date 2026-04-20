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
  { key: MetodoPago.YAPE, label: "Yape", icon: "/images/cart/yape.png" },
  { key: MetodoPago.PLIN, label: "Plin", icon: "/images/cart/plin.png" },
];

export default function PaymentMethodSelector() {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<MetodoPago | null>(null);

  const handleSelect = (method: MetodoPago) => {
    setSelected(method);
    dispatch(setMetodoPago(method));
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {paymentMethods.map((method) => {
        const isSelected = selected === method.key;

        return (
          <button
            key={method.key}
            onClick={() => handleSelect(method.key)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 ${
              isSelected
                ? "border-blue bg-blue/10 ring-2 ring-blue shadow-inner"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            {/* ICONO */}
            <div
              className={`transition-transform ${
                isSelected ? "scale-110" : ""
              }`}
            >
              <Image
                src={method.icon}
                alt={method.label}
                width={36}
                height={36}
              />
            </div>

            {/* LABEL */}
            <span
              className={`text-xs font-bold uppercase ${
                isSelected ? "text-blue" : "text-gray-500"
              }`}
            >
              {method.label}
            </span>

            {/* CHECK */}
            {isSelected && <CheckCircle2 size={18} className="text-blue" />}
          </button>
        );
      })}
    </div>
  );
}
