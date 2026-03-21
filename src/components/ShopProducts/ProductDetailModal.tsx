"use client";

import React from "react";
import { ModalFrameWrapper } from "@/components/ui/ModalFrameWrapper";

interface StockItem {
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

  const totalStock = stockData.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);

  return (
    <ModalFrameWrapper size="md" variant="blue">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{product.producto?.nombre || "Producto"}</h2>

        <img
          src={product.imagenUrl}
          alt={product.producto?.nombre || "Producto"}
          className="w-full h-56 object-cover rounded-xl border"
        />

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Categoría:</span> {selectedCategory}
          </p>
          <p>
            <span className="font-semibold">Precio:</span> S/{" "}
            {product.producto?.precio || 0}
          </p>
          <p>
            <span className="font-semibold">Descripción:</span>{" "}
            {product.producto?.descripcion || "Sin descripción"}
          </p>
          <p>
            <span className="font-semibold">Stock total:</span> {totalStock}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Detalle por sede</h3>

          {loadingStock ? (
            <p className="text-sm text-gray-500">Cargando stock...</p>
          ) : stockData.length === 0 ? (
            <p className="text-sm text-gray-500">No hay stock registrado</p>
          ) : (
            <div className="space-y-3">
              {stockData.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border p-3 bg-gray-50"
                >
                  <p>
                    <span className="font-semibold">Sede:</span>{" "}
                    {item.sede?.nombre || `Sede ${item.sedeId}`}
                  </p>
                  <p>
                    <span className="font-semibold">Cantidad:</span>{" "}
                    {item.cantidad}
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