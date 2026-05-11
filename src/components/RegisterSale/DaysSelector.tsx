"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const paymentDays = ["1 Día", "7 Días", "15 Días", "30 Días"];

export default function PaymentDaysSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 gap-2">
      {paymentDays.map((day) => {
        const isSelected = selected === day;

        return (
          <button
            key={day}
            onClick={() => setSelected(day)}
            className={`
              relative overflow-hidden
              rounded-xl p-[2px]
              transition-all duration-300
              min-h-[65px]
              ${
                isSelected
                  ? "scale-[1.02] shadow-[0_8px_20px_-10px_rgba(234,179,8,0.45)]"
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
                flex items-center justify-center
                rounded-[11px]
                bg-white h-full w-full
                transition-all duration-300
                ${
                  isSelected
                    ? "bg-gradient-to-br from-blue/5 to-yellow/10"
                    : "hover:bg-slate-50"
                }
              `}
            >
              <span
                className={`
                  text-[11px] font-black tracking-wide uppercase
                  transition-all duration-300
                  ${isSelected ? "text-yellow-700 scale-105" : "text-slate-500"}
                `}
              >
                {day}
              </span>

              {isSelected && (
                <div className="absolute top-1.5 right-1.5">
                  <CheckCircle2 size={14} className="text-yellow" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
