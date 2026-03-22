"use client";

import React from "react";
import Image from "next/image";
import { ModalFrameWrapper } from "@/components/Common/modal/ModalFrameWrapper";interface StockItem {
  id: number;
  sedeId: number;
  productoId: number;
  cantidad: number;
  ubicacion: string;
  sede?: {
    id: number;
    nombre: string;
  };
}

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
  stockData: StockItem[];
  loadingStock: boolean;
  selectedCategory: string;
}

const ProductDetailModal = ({
  open,
  onClose,
  product,
  stockData,
  loadingStock,
  selectedCategory,
}: ProductDetailModalProps) => {
  if (!open || !product) return null;

  const totalStock = stockData.reduce(
    (acc, item) => acc + Number(item.cantidad || 0),
    0
  );

  return (
    <ModalFrameWrapper size="md" variant="blue">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl border bg-gray-50 p-4 h-[280px] flex items-center justify-center">
              <Image
                src={product.imagenUrl}
                alt={product.nombre || "Producto"}
                width={260}
                height={260}
                className="object-contain max-h-[240px]"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-3">
            <h2 className="text-2xl font-bold text-slate-800">
              {product.nombre || "Producto"}
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Categoría:</span> {selectedCategory}
              </p>
              <p>
                <span className="font-semibold">Marca:</span> {product.marca || "Sin marca"}
              </p>
              <p>
                <span className="font-semibold">Precio:</span> S/ {product.precio || 0}
              </p>
              <p>
                <span className="font-semibold">Stock total:</span> {totalStock}
              </p>
              <p>
                <span className="font-semibold">Descripción:</span>{" "}
                {product.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-base">Detalle por sede</h3>

          {loadingStock ? (
            <p className="text-sm text-gray-500">Cargando stock...</p>
          ) : stockData.length === 0 ? (
            <p className="text-sm text-gray-500">No hay stock registrado</p>
          ) : (
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {stockData.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-4 bg-gray-50"
                >
                  <p>
                    <span className="font-semibold">Sede:</span>{" "}
                    {item.sede?.nombre || `Sede ${item.sedeId}`}
                  </p>
                  <p>
                    <span className="font-semibold">Cantidad:</span> {item.cantidad}
                  </p>
                  <p>
                    <span className="font-semibold">Ubicación:</span>{" "}
                    {item.ubicacion || "Sin ubicación"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalFrameWrapper>
  );
};

export default ProductDetailModal;