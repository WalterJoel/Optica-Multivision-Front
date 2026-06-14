"use client";

import React from "react";

interface CuotasSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function CuotasSelector({ value, onChange }: CuotasSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {[1, 2, 3].map((cuota) => {
        const isSelected = value === cuota;
        return (
          <button
            key={cuota}
            type="button"
            onClick={() => onChange(cuota)}
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
                flex flex-col items-center justify-center
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
                  text-lg font-black
                  transition-all duration-300
                  ${isSelected ? "text-yellow-700 scale-105" : "text-slate-500"}
                `}
              >
                {cuota}
              </span>
              <span
                className={`
                  text-[9px] font-black uppercase tracking-wider
                  transition-all duration-300
                  ${isSelected ? "text-yellow-600" : "text-slate-400"}
                `}
              >
                {cuota === 1 ? "Cuota" : "Cuotas"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
