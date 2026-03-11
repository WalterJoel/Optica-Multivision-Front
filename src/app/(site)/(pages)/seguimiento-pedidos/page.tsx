import SeguimientoPedidos from "@/components/SeguimientoPedidos";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Seguimiento de Pedidos | NextCommerce Nextjs E-commerce template",
  description: "This is Seguimiento de Pedidos page for NextCommerce Template",
  // other metadata
};

const SeguimientoPedidosPage = () => {
  return (
    <main>
      <SeguimientoPedidos />
    </main>
  );
};

export default SeguimientoPedidosPage;
