"use client";

import React, { useState, useEffect } from "react";
import { ITraslado } from "@/types/traslados";
import { X, Send } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";


interface ModalEnviarMercaderiaProps {
  isOpen: boolean;
  traslado: ITraslado | null;
  onClose: () => void;
  onConfirm: (payload: {
    trasladoId: number;
    tipoProducto?: any;
    observaciones?: string;
    detalles: { detalleId: number; cantidadEnviada: number }[];
  }) => Promise<void>;
  loading?: boolean;
}

export function ModalEnviarMercaderia({
  isOpen,
  traslado,
  onClose,
  onConfirm,
  loading = false,
}: ModalEnviarMercaderiaProps) {
  const [detallesState, setDetallesState] = useState<
    { detalleId: number; cantidadEnviada: number | "" }[]
  >([]);
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (traslado && traslado.detalles) {
      setDetallesState(
        traslado.detalles.map((d) => ({
          detalleId: d.id,
          cantidadEnviada: d.cantidadEnviada > 0 ? d.cantidadEnviada : d.cantidadSolicitada,
        }))
      );
      setObservaciones("");
    }
  }, [traslado]);

  if (!isOpen || !traslado) return null;

  const handleCantidadChange = (detalleId: number, rawVal: string) => {
    if (rawVal === "") {
      setDetallesState((prev) =>
        prev.map((d) => (d.detalleId === detalleId ? { ...d, cantidadEnviada: "" } : d))
      );
      return;
    }

    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed)) {
      setDetallesState((prev) =>
        prev.map((d) =>
          d.detalleId === detalleId ? { ...d, cantidadEnviada: Math.max(0, parsed) } : d
        )
      );
    }
  };

  const handleBlurQuantity = (detalleId: number) => {
    setDetallesState((prev) =>
      prev.map((d) =>
        d.detalleId === detalleId && d.cantidadEnviada === ""
          ? { ...d, cantidadEnviada: 0 }
          : d
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm({
      trasladoId: traslado.id,
      observaciones,
      detalles: detallesState.map((d) => ({
        detalleId: d.detalleId,
        cantidadEnviada: typeof d.cantidadEnviada === "number" ? d.cantidadEnviada : 0,
      })),
    });
  };

  return (
    <ModalFrameWrapper size="lg" variant="blue" onClose={onClose}>
      <div className="flex flex-col space-y-6">
        {/* CABECERA */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center">
              <Send size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-dark uppercase tracking-tight">
                Despachar Mercadería — #{traslado.id}
              </h3>
              <p className="text-xs text-dark-5 font-semibold">
                Sede Solicitante: {traslado.sedeSolicitante?.nombre || `Sede ${traslado.sedeSolicitanteId}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-5 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-gray-3 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-beige text-dark-3 font-black uppercase text-[10px] tracking-wider border-b border-gray-3">
                  <th className="p-3.5">Producto / Ítem</th>
                  <th className="p-3.5 text-center">Solicitada 📥</th>
                  <th className="p-3.5 text-center">Cantidad a Enviar 🚚</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-2 text-dark font-medium">
                {traslado.detalles.map((det) => {
                  const stateItem = detallesState.find((s) => s.detalleId === det.id);
                  const nombreItem =
                    det.producto?.nombre ||
                    det.producto?.montura?.codigo ||
                    det.producto?.accesorio?.nombre ||
                    `Lente ${det.stock?.lente?.marca || ""} ${det.stock?.esf || ""}`;

                  return (
                    <tr key={det.id} className="hover:bg-beige/40">
                      <td className="p-3.5">
                        <span className="font-bold text-dark uppercase block">{nombreItem}</span>
                        <span className="text-[10px] text-dark-5 font-semibold">Ref Detalle: #{det.id}</span>
                      </td>
                      <td className="px-4 py-2 text-center font-bold text-dark-3 text-xs">
                        {det.cantidadSolicitada}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            min={0}
                            value={stateItem?.cantidadEnviada}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => handleCantidadChange(det.id, e.target.value)}
                            onBlur={() => handleBlurQuantity(det.id)}
                            className="w-16 h-9 px-2 text-center font-black text-xs text-dark border-2 border-blue-light/50 rounded-xl bg-white focus:border-blue-light focus:ring-2 focus:ring-blue-light/20 outline-none shadow-sm transition-all hover:border-blue-light cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-3 pt-2 max-w-md mx-auto">
            <BaseButton
              type="button"
              onClick={onClose}
              variant="cancel"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
            >
              Enviar Mercadería
            </BaseButton>
          </div>

        </form>
      </div>
    </ModalFrameWrapper>
  );
}
