"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { TipoProducto } from "@/commons/constants";

// Navegación rápida del flujo venta
export default function BarraFlujoVenta() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  const categorias = [
    {
      name: TipoProducto.MONTURA,
      path: "/vender?cat=MONTURA",
      isActive:
        pathname.startsWith("/vender") &&
        (catParam === TipoProducto.MONTURA || !catParam),
    },
    {
      name: TipoProducto.LENTE,
      path: "/lentes",
      isActive:
        pathname.startsWith("/lentes") ||
        pathname.startsWith("/matrix") ||
        (pathname.startsWith("/vender") && catParam === TipoProducto.LENTE),
    },
    {
      name: TipoProducto.ACCESORIO,
      path: "/vender?cat=ACCESORIO",
      isActive:
        pathname.startsWith("/vender") && catParam === TipoProducto.ACCESORIO,
    },
  ];

  return (
    <div className="flex gap-3 flex-wrap items-center">
      {categorias.map((cat) => {
        const isActive = cat.isActive;
        return (
          <Link key={cat.name} href={cat.path} className="relative group">
            <div
              className={`absolute inset-0 blur-xl rounded-xl transition ${
                isActive ? "bg-blue-light/20" : "bg-transparent"
              }`}
            />
            <div
              className={`relative px-4 py-2 rounded-xl text-sm font-bold border transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-white border-blue-light text-blue-light shadow-testimonial"
                  : "bg-white border-gray-200 text-gray-500 hover:border-blue-light hover:text-blue-light"
              }`}
            >
              <span className="flex gap-[2px]">
                <span className="w-[3px] h-3 bg-blue-light rounded-full" />
                <span className="w-[3px] h-3 bg-yellow-dark rounded-full" />
              </span>
              {cat.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
