"use client";

import React from "react";
import { FileSpreadsheet, Printer } from "lucide-react";

interface ExportButtonsProps {
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  excelLabel?: string;
  pdfLabel?: string;
  disabled?: boolean;
  className?: string;
}

// Componente reutilizable para botones de exportación a Excel y PDF / Impresión (Estilo BaseButton gordito)
export default function ExportButtons({
  onExportExcel,
  onExportPdf,
  excelLabel = "Exportar Excel",
  pdfLabel = "Imprimir / PDF",
  disabled = false,
  className = "",
}: ExportButtonsProps) {
  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {onExportExcel && (
        <button
          type="button"
          onClick={onExportExcel}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-green-dark hover:opacity-90 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 border border-black/10"
          title={excelLabel}
        >
          <FileSpreadsheet size={17} />
          <span>{excelLabel}</span>
        </button>
      )}

      {onExportPdf && (
        <button
          type="button"
          onClick={onExportPdf}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-light hover:opacity-90 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 border border-black/10"
          title={pdfLabel}
        >
          <Printer size={17} />
          <span>{pdfLabel}</span>
        </button>
      )}
    </div>
  );
}
