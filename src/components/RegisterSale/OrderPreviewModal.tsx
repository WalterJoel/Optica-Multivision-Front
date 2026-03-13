"use client";

import React from "react";
import OrderPrint from "./OrderPrint";

type EyeData = {
  esf: string;
  cil: string;
  eje: string;
  dip: string;
};

type OrderForm = {
  orderId: string;
  optica: string;
  orderDate: string;
  customerName: string;
  celular: string;
  direccion: string;
  add: string;
  marca: string;
  precio: string;
  observaciones: string;
  biselBrillante: "SI" | "NO" | "";

  od: EyeData;
  oi: EyeData;

  lenteMateriales: string[];
  monturaMateriales: string[];
  tipoMontura: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onDownloadPdf: () => void;
  form: OrderForm;
}

export default function OrderPreviewModal({
  open,
  onClose,
  onDownloadPdf,
  form,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Vista previa del PDF</h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onDownloadPdf}
              className="rounded-lg bg-blue px-4 py-2 font-medium text-white"
            >
              Imprimir / Guardar PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-200 p-6">
          <div className="mx-auto w-fit bg-white shadow-2xl">
            <OrderPrint form={form} />
          </div>
        </div>
      </div>
    </div>
  );
}