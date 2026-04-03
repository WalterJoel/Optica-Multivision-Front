"use client";

import React, { useEffect, useState } from "react";
import { useUpdateStockProductos } from "@/hooks/products/stock/useUpdateStockProductos";
import { IUpdateStockProductos } from "@/types/products";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productosModificados: any[];
  dictStocks: { [key: string]: string };
  onSuccess?: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  productosModificados,
  dictStocks,
  onSuccess,
}: ConfirmationModalProps) => {
  const [typeModal, setTypeModal] = useState<string>("");
  const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);

  const { loading, statusMessage, success, updateStockProductos } =
    useUpdateStockProductos();

  const handleGuardarInventario = async () => {
    const payload: IUpdateStockProductos = {
      items: productosModificados.map((p) => ({
        stockId: p.stock.id,
        cantidad: Number(dictStocks[String(p.stock.id)]),
      })),
    };

    await updateStockProductos(payload);
  };

  // --- Manejo de la respuesta del Backend ---
  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        if (onSuccess) onSuccess(); // Notificar al padre que limpie la tabla si deseas
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenStatusModal(true);
    }
  }, [loading, success, statusMessage, onSuccess]);

  return (
    <>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-8 border-blue">
              <div className="p-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  Finalizar
                </h3>

                <div className="bg-slate-50 rounded-xl p-4 my-6 max-h-60 overflow-y-auto shadow-inner">
                  {productosModificados.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="text-[9px] font-black text-blue uppercase border-b border-slate-200">
                          <th className="text-left pb-2">MODELO</th>
                          <th className="text-center pb-2">NUEVO STOCK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosModificados.map((p) => (
                          <tr key={p.stock.id}>
                            <td className="py-2 text-[11px] font-bold text-slate-700 uppercase">
                              {p.montura.marca} {p.montura.codigo}
                            </td>
                            <td className="py-2 text-center font-black text-blue">
                              {dictStocks[String(p.stock.id)]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-slate-400 font-bold text-xs uppercase py-4">
                      Sin cambios detectados
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="py-4 font-black text-[10px] uppercase text-slate-400 disabled:opacity-30"
                  >
                    Regresar
                  </button>
                  <button
                    onClick={handleGuardarInventario}
                    disabled={productosModificados.length === 0 || loading}
                    className="py-4 bg-blue text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue/20 disabled:bg-slate-200 disabled:shadow-none"
                  >
                    {loading ? "Guardando..." : "Confirmar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <LoadingModal isOpen={loading} />
          <StatusModal
            isOpen={openStatusModal}
            type={typeModal}
            message={statusMessage}
            onClose={() => {
              setOpenStatusModal(false);
              if (success) onClose();
            }}
          />
        </>
      )}
    </>
  );
};
