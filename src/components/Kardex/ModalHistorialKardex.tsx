"use client";

import { useEffect, useState, useCallback } from "react";
import { History, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal/ModalFrameWrapper";
import { obtenerHistorialKardex } from "@/services/kardex";
import { IKardexRegistro, OrigenEventoKardex } from "@/types/kardex";
import { TipoProducto } from "@/commons/constants";


interface ModalHistorialKardexProps {
  isOpen: boolean;
  onClose: () => void;
  productoId?: number;
  stockId?: number;
  sedeId?: number;
  tipoProducto?: TipoProducto | string;
  nombreProducto?: string;
}

export function ModalHistorialKardex({
  isOpen,
  onClose,
  productoId,
  stockId,
  sedeId,
  tipoProducto,
  nombreProducto,
}: ModalHistorialKardexProps) {
  const [loading, setLoading] = useState(false);
  const [registros, setRegistros] = useState<IKardexRegistro[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistorial = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const res = await obtenerHistorialKardex({
        sedeId,
        productoId,
        stockId,
        tipoProducto,
        page,
        limit: 20,
      });

      setRegistros(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (error) {
      console.error("Error al obtener el historial de Kardex:", error);
      setRegistros([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [isOpen, sedeId, productoId, stockId, tipoProducto, page]);



  useEffect(() => {
    if (isOpen) {
      setPage(1);
    }
  }, [isOpen, productoId, stockId]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  if (!isOpen) return null;

  const renderBadgeOrigen = (origen: OrigenEventoKardex | string) => {
    const labels: Record<string, string> = {
      [OrigenEventoKardex.VENTA_REALIZADA]: "VENTA",
      [OrigenEventoKardex.VENTA_KIT_ACCESORIO]: "VENTA KIT",
      [OrigenEventoKardex.VENTA_ANULADA]: "ANULACIÓN VENTA",
      [OrigenEventoKardex.ANULACION_KIT_ACCESORIO]: "ANULACIÓN KIT",
      [OrigenEventoKardex.TRASLADO_ENVIADO]: "TRASLADO ENVIADO",
      [OrigenEventoKardex.TRASLADO_RECIBIDO]: "TRASLADO RECIBIDO",
      [OrigenEventoKardex.CREACION_INICIAL]: "REGISTRO INICIAL",
      [OrigenEventoKardex.INICIALIZACION_MATRIZ]: "REGISTRO MATRIZ",
      [OrigenEventoKardex.AJUSTE_MANUAL]: "AJUSTE MANUAL",
      [OrigenEventoKardex.CARGA_EXCEL]: "CARGA EXCEL",
    };

    const text = labels[origen] || String(origen).replace(/_/g, " ");

    return (
      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-light-5 text-blue border border-blue/20 inline-block">
        {text}
      </span>
    );
  };



  return (
    <ModalFrameWrapper size="xl" onClose={onClose} variant="blue">
      <div className="space-y-4">
        {/* CABECERA MODAL */}
        <div className="flex items-center justify-between border-b border-gray-3 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue/10 text-blue flex items-center justify-center">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-dark uppercase tracking-tight">
                Historial de Movimientos (Kardex)
              </h3>
              <p className="text-[11px] text-dark-5 font-bold uppercase">
                {nombreProducto ? nombreProducto : `Producto ID: ${productoId || stockId || "-"}`}
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

        {/* TABLA HISTORIAL ACOTADA Y CON SCROLL */}
        <div className="max-h-[520px] overflow-y-auto border border-gray-3 rounded-2xl shadow-sm">

          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-beige z-10 shadow-xs">
              <tr className="bg-beige text-dark-3 font-black uppercase text-[10px] tracking-wider border-b border-gray-3">
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-3 text-center">Origen / Evento</th>
                <th className="py-2.5 px-3 text-center">Stock Ant.</th>
                <th className="py-2.5 px-3 text-center">Mov.</th>
                <th className="py-2.5 px-3 text-center">Stock Fin.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-2 text-dark font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-blue font-bold text-xs">
                    Cargando historial de movimientos...
                  </td>
                </tr>
              ) : registros.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-bold text-xs">
                    No se encontraron registros de movimientos para este producto.
                  </td>
                </tr>
              ) : (
                registros.map((reg) => {
                  const fechaFormatted = new Date(reg.createdAt).toLocaleString("es-PE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const mov = reg.cantidadMovimiento;

                  return (
                    <tr key={reg.id} className="hover:bg-beige/40">
                      <td className="py-1.5 px-3 font-bold text-dark-3 text-[11px]">
                        {fechaFormatted}
                      </td>
                      <td className="py-1.5 px-3 text-center">
                        {renderBadgeOrigen(reg.origenEvento)}
                      </td>
                      <td className="py-1.5 px-3 text-center font-bold text-dark-5 text-xs">
                        {reg.cantidadAnterior}
                      </td>
                      <td className="py-1.5 px-3 text-center text-xs font-black">
                        {mov > 0 ? (
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-light-6 text-green border border-green-light-4 min-w-[42px]">
                            +{mov}
                          </span>
                        ) : mov < 0 ? (
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-red-light-6 text-red border border-red-light-4 min-w-[42px]">
                            {mov}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-2 text-gray-5 border border-gray-3 min-w-[42px]">
                            0
                          </span>
                        )}
                      </td>


                      <td className="py-1.5 px-3 text-center font-black text-dark text-xs">
                        {reg.cantidadFinal}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* CONTROLES DE PAGINACIÓN */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center pt-1 text-xs font-bold text-dark-5">
            <span className="text-[11px]">Total registros: {total}</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-gray-3 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px]">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-gray-3 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}      </div>
    </ModalFrameWrapper>
  );
}

