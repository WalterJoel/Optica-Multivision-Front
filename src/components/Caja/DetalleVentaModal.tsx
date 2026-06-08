"use client";

import React, { useEffect } from "react";
import { X, ShoppingBag, Hash, CreditCard, User, Users } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal/ModalFrameWrapper";

interface DetalleVentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  movimiento: any;
}

export default function DetalleVentaModal({
  isOpen,
  onClose,
  movimiento,
}: DetalleVentaModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !movimiento) return null;

  const { venta, monto, descripcion } = movimiento;

  return (
    <ModalFrameWrapper variant="blue" size="md">
      <div className="flex flex-col pb-4 pt-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-light/10 flex items-center justify-center text-blue-light">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="font-black text-lg text-dark uppercase tracking-tight leading-tight">
                Detalle de Venta
              </h2>
              <p className="text-[11px] font-black text-blue-light uppercase tracking-[2px] leading-tight">
                Productos Vendidos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-4 hover:bg-gray-1 hover:text-dark transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Resumen del Movimiento / Venta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-beige p-5 rounded-2xl mb-6 border border-blue-light-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-dark-3">
              <Hash size={14} className="text-blue-light-2" />
              <span>
                Concepto: <strong className="text-dark font-black">{descripcion}</strong>
              </span>
            </div>
            {venta && (
              <>
                <div className="flex items-center gap-2 text-xs font-semibold text-dark-3">
                  <CreditCard size={14} className="text-blue-light-2" />
                  <span>
                    Tipo de Venta:{" "}
                    <strong className="text-dark font-black uppercase">
                      {venta.tipoVenta}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-dark-3">
                  <span className="w-3.5 h-3.5 rounded-full border border-blue-light-2 flex items-center justify-center text-[9px] font-bold text-blue-light-2">
                    S
                  </span>
                  <span>
                    Estado de Pago:{" "}
                    <strong
                      className={`font-black uppercase ${
                        venta.estadoPago === "PAGADO"
                          ? "text-green"
                          : "text-yellow-dark"
                      }`}
                    >
                      {venta.estadoPago}
                    </strong>
                  </span>
                </div>
                {venta.user && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-dark-3">
                    <User size={14} className="text-blue-light-2" />
                    <span>
                      Vendedor:{" "}
                      <strong className="text-dark font-black uppercase">
                        {`${venta.user.nombre} ${venta.user.apellido}`.trim()}
                      </strong>
                    </span>
                  </div>
                )}
                {venta.cliente && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-dark-3">
                    <Users size={14} className="text-blue-light-2" />
                    <span>
                      Cliente:{" "}
                      <strong className="text-dark font-black uppercase">
                        {venta.cliente.tipoCliente === "EMPRESA"
                          ? venta.cliente.razonSocial || "Empresa"
                          : `${venta.cliente.nombres || ""} ${venta.cliente.apellidos || ""}`.trim() || "Cliente sin nombre"}
                      </strong>
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-2 pt-2 sm:pt-0 sm:pl-4 font-semibold text-dark-3">
            <div className="flex justify-between items-center text-xs">
              <span>Monto de este pago:</span>
              <span className="font-black text-dark text-[14px]">
                S/ {Number(monto).toFixed(2)}
              </span>
            </div>
            {venta && (
              <>
                <div className="flex justify-between items-center text-xs">
                  <span>Total de la Venta:</span>
                  <span className="font-bold text-dark text-[13px]">
                    S/ {Number(venta.total).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Monto Cobrado (Total):</span>
                  <span className="font-semibold text-green text-[13px]">
                    S/ {Number(venta.montoPagado).toFixed(2)}
                  </span>
                </div>
                {Number(venta.deuda) > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span>Deuda Restante:</span>
                    <span className="font-bold text-red text-[13px]">
                      S/ {Number(venta.deuda).toFixed(2)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="border border-blue-light-5 rounded-2xl overflow-hidden mb-8 shadow-sm">
          <div className="max-h-[220px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-beige text-[10px] font-black text-blue uppercase tracking-wider sticky top-0 border-b border-blue-light-5">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4 text-center">Tipo</th>
                  <th className="py-3 px-4 text-center">P. Unitario</th>
                  <th className="py-3 px-4 text-center">Cant.</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-1 bg-white">
                {!venta || !venta.productos || venta.productos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center font-bold text-dark-5 uppercase text-[10px] tracking-wider"
                    >
                      No hay productos registrados para este movimiento.
                    </td>
                  </tr>
                ) : (
                  venta.productos.map((prod: any) => (
                    <tr
                      key={prod.id}
                      className="hover:bg-blue-light-6/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-dark uppercase">
                        {prod.producto?.nombre || "Producto sin nombre"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-beige text-[9px] font-black text-dark-4 uppercase border border-gray-3">
                          {prod.tipoProducto}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-dark-2 font-medium">
                        S/ {Number(prod.precioUnitario).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center text-dark font-bold">
                        {prod.cantidad}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-dark-2">
                        S/ {Number(prod.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-black text-dark uppercase tracking-[0.2em] text-[11px] bg-yellow-dark hover:bg-yellow shadow-lg shadow-yellow-dark/15 hover:shadow-xl hover:shadow-yellow-dark/20 transition-all active:scale-[0.98]"
        >
          Cerrar Detalle
        </button>
      </div>
    </ModalFrameWrapper>
  );
}
