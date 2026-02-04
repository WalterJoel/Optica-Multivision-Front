"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import TabsProducto from "./TabsProducto";
import LensForm from "./LensForm";

export default function RegisterProduct() {
  const [tipo, setTipo] = useState<"montura" | "luna" | "accesorio">("luna");

  return (
    <>
      <Breadcrumb title="Registrar Producto" pages={["productos", "nuevo"]} />

      <section className="py-20 bg-gray-2">
        <div className="max-w-[1170px] mx-auto px-4">
          <div className="bg-white rounded-xl shadow-1 p-6 sm:p-8">
            <TabsProducto tipo={tipo} setTipo={setTipo} />

            <p className="text-sm text-red mb-4">* Campo requerido</p>

            {tipo === "luna" && <LensForm />}
          </div>
        </div>
      </section>
    </>
  );
}
