"use client";

import { useEffect } from "react";
import { Store, X } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal/ModalFrameWrapper";
import { useStockOtrasSedes } from "@/hooks/products/useStockOtrasSedes";

interface ModalStockOtrasSedesProps {
  isOpen: boolean;
  onClose: () => void;
  productoId?: number;
  nombreProducto?: string;
}

export function ModalStockOtrasSedes({
  isOpen,
  onClose,
  productoId,
  nombreProducto,
}: ModalStockOtrasSedesProps) {
  const { loading, stockSedes, fetchStockOtrasSedes } = useStockOtrasSedes();

  useEffect(() => {
    if (isOpen && productoId) {
      fetchStockOtrasSedes(productoId);
    }
  }, [isOpen, productoId, fetchStockOtrasSedes]);

  if (!isOpen) return null;

  return (
    <ModalFrameWrapper size="md" onClose={onClose} variant="blue">
      <div className="space-y-4">
        {/* CABECERA MODAL */}
        <div className="flex items-center justify-between border-b border-gray-3 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue/10 text-blue flex items-center justify-center">
              <Store size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-dark uppercase tracking-tight">
                Stock en Otras Sedes
              </h3>
              <p className="text-[11px] text-dark-5 font-bold uppercase">
                {nombreProducto ? nombreProducto : `Producto ID: ${productoId || "-"}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-5 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* TABLA DE STOCK EN OTRAS SEDES */}
        <div className="max-h-[400px] overflow-y-auto border border-gray-3 rounded-2xl shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-beige z-10 shadow-xs">
              <tr className="bg-beige text-dark-3 font-black uppercase text-[10px] tracking-wider border-b border-gray-3">
                <th className="py-2.5 px-4">Sede</th>
                <th className="py-2.5 px-4 text-center">Stock Disponible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-2 text-dark font-medium">
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-blue font-bold text-xs">
                    Consultando stock en otras sedes...
                  </td>
                </tr>
              ) : stockSedes.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-400 font-bold text-xs">
                    No hay existencias registradas en otras sedes para este producto.
                  </td>
                </tr>
              ) : (
                stockSedes.map((item) => (
                  <tr key={item.sedeId} className="hover:bg-beige/40">
                    <td className="py-2.5 px-4 font-bold text-dark text-xs uppercase">
                      <div className="flex items-center gap-2">
                        <Store size={14} className="text-blue shrink-0" />
                        <span>{item.nombreSede}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {item.cantidad > 0 ? (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black bg-green-light-6 text-green border border-green-light-4 min-w-[50px]">
                          {item.cantidad} unds.
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-gray-2 text-gray-5 border border-gray-3 min-w-[50px]">
                          Agotado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ModalFrameWrapper>
  );
}
