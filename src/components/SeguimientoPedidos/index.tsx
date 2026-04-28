"use client";

import React, { useMemo, useState } from "react";
import ListSeguimientoPedidos from "./ListSeguimientoPedidos";
import SeguimientoPedidoDetalle from "./SeguimientoPedidoDetalle";
import { pedidosMock } from "./mock";
import { IPedidoSeguimiento } from "@/types/seguimiento-pedido";
import { TrendingUp } from "lucide-react";

export default function SeguimientoPedidos() {
  const pedidos = useMemo(() => pedidosMock, []);
  const [selected, setSelected] = useState<IPedidoSeguimiento | null>(null);

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <TrendingUp size={26} className="text-blue-light" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-[5px] bg-yellow-dark" />
                <p className="text-[10px] sm:text-[11px] font-black text-blue-light uppercase tracking-[3px]">
                  Resumen
                </p>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark tracking-tighter uppercase leading-none">
                Seguimiento de{" "}
                <span className="text-blue-light italic">Pedido</span>
              </h1>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div>
          {selected ? (
            <SeguimientoPedidoDetalle
              pedido={selected}
              onBack={() => setSelected(null)}
            />
          ) : (
            <ListSeguimientoPedidos pedidos={pedidos} onSelect={setSelected} />
          )}
        </div>
      </div>
    </div>
  );
}
