"use client";

import { Download, FileSpreadsheet } from "lucide-react";

import { BaseButton } from "@/components/Common/Buttons";

export const DescargarFormatoAccesorios = () => {
  const handleDownload = () => {
    window.open("/templates/monturas.xlsx", "_blank");
  };

  return (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-testimonial p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-light/10 flex items-center justify-center">
          <FileSpreadsheet className="text-blue-light" size={24} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[3px] text-blue-light font-semibold">
            Plantilla
          </p>

          <h2 className="text-lg font-bold text-dark">Descargar formato</h2>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-500 mb-8">
        <p>El archivo debe incluir:</p>

        <ul className="space-y-2">
          <li>• código</li>
          <li>• marca</li>
          <li>• color</li>
          <li>• precio compra</li>
          <li>• precio venta</li>
          <li>• stock</li>
        </ul>
      </div>

      <BaseButton
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2"
      >
        <Download size={18} />
        Descargar Excel
      </BaseButton>
    </div>
  );
};
