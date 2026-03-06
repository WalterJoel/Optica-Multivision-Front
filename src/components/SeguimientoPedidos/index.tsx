"use client";

import React, { useMemo, useState } from "react";
import ListSeguimientoPedidos from "./ListSeguimientoPedidos";
import SeguimientoPedidoDetalle from "./SeguimientoPedidoDetalle";
import { pedidosMock } from "./mock";
import { IPedidoSeguimiento } from "@/types/seguimiento-pedido";

export default function SeguimientoPedidos() {
  const pedidos = useMemo(() => pedidosMock, []);
  const [selected, setSelected] = useState<IPedidoSeguimiento | null>(null);

  return (
    <section className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 py-10">
      {selected ? (
        <SeguimientoPedidoDetalle
          pedido={selected}
          onBack={() => setSelected(null)}
        />
      ) : (
        <ListSeguimientoPedidos pedidos={pedidos} onSelect={setSelected} />
      )}
    </section>
  );
}