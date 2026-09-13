import Sales from "@/components/Ventas";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resumen de Ventas | Óptica Multivisión",
  description: "Resumen y Gestión de Ventas de Óptica Multivisión",
};

const VentasPage = () => {
  return (
    <main>
      <Sales />
    </main>
  );
};

export default VentasPage;
