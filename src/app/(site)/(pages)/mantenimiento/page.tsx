import Mantenimiento from "@/components/Mantenimiento";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mantenimiento | Óptica Multivisión",
  description: "Página de Mantenimiento y Gestión de Óptica Multivisión",
};

const MantenimientoPage = () => {
  return (
    <main>
      <Mantenimiento />
    </main>
  );
};

export default MantenimientoPage;
