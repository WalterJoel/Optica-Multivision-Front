"use client";

import React, { useState } from "react";
import { X, DollarSign, Loader2 } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { IResponseSale } from "@/types/sales";

interface RegistrarPagoModalProps {
  venta: IResponseSale;
  sedeId: number;
  onClose: () => void;
  onSave: (id: number, payload: { montoPagado: number; metodoPago: string; sedeId: number }) => Promise<any>;
  loading: boolean;
}

const METODOS = ["EFECTIVO", "YAPE", "PLIN", "TRANSFERENCIA"];

export const RegistrarPagoModal: React.FC<RegistrarPagoModalProps> = ({
  venta,
  sedeId,
  onClose,
  onSave,
  loading,
}) => {
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState("");

  const deudaActual = Number(venta.deuda);
  const total = Number(venta.total);
  const montoPagadoActual = Number(venta.montoPagado);
  const nroCuotas = venta.nroCuotas || 1;

  /*
   * REGLA DE NEGOCIO - REGISTRO DE PAGOS Y CUOTAS:
   * 1. Si la venta tiene varias cuotas (ej. 3 cuotas), el cliente puede liquidar (cancelar el 100% de la deuda)
   *    en cualquier cuota previa (1era o 2da).
   * 2. Si el cliente está en la ÚLTIMA cuota (ej: la 2da de 2, o la 3era de 3), es OBLIGATORIO
   *    cancelar la totalidad de la deuda restante (deudaActual) para saldar por completo la venta.
   */
  const montoCuota = nroCuotas > 0 ? total / nroCuotas : total;
  const cuotasPagadas = montoCuota > 0 ? Math.floor(montoPagadoActual / montoCuota) : 0;
  const cuotaActualNumero = Math.min(cuotasPagadas + 1, nroCuotas);
  const cuotasRestantes = Math.max(nroCuotas - cuotasPagadas, 1);
  const isUltimaCuota = cuotasRestantes <= 1;

  const handleSubmit = async () => {
    const montoNum = parseFloat(monto);

    if (deudaActual <= 0) {
      setError("La venta ya no tiene deuda pendiente.");
      return;
    }
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }
    // REGLA DE NEGOCIO: En la última cuota es obligatorio cancelar la totalidad de la deuda restante.
    if (isUltimaCuota && montoNum < deudaActual) {
      setError(`Es la última cuota: debes abonar el monto completo de S/ ${deudaActual.toFixed(2)}.`);
      return;
    }
    if (!metodoPago) {
      setError("Selecciona un método de pago.");
      return;
    }

    const montoFinal = Math.min(montoNum, deudaActual);
    setError("");
    await onSave(venta.id, { montoPagado: montoFinal, metodoPago, sedeId });
  };

  return (
    <ModalFrameWrapper size="md" variant="yellow">
      <div className="p-4 sm:p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-yellow/15 border border-yellow-dark/30 flex items-center justify-center text-yellow-dark shadow-sm">
              <DollarSign size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-dark uppercase tracking-tight leading-none">
                Registrar Pago
              </h3>
              <p className="text-xs font-bold text-gray-4 uppercase tracking-widest mt-1">
                Venta #{venta.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-dark hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* INDICADOR DE CUOTA A PAGAR */}
        <div className="mb-6 bg-yellow/10 border border-yellow-dark/30 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-dark animate-pulse" />
            <span className="text-xs font-black uppercase text-dark tracking-wider">
              Estado de Cuotas:
            </span>
          </div>
          <span className="text-xs font-black bg-yellow-dark text-white px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-sm">
            {isUltimaCuota
              ? `ÚLTIMA CUOTA (${cuotaActualNumero} de ${nroCuotas})`
              : `CUOTA ${cuotaActualNumero} DE ${nroCuotas}`}
          </span>
        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-beige rounded-2xl p-3.5 text-center border border-gray-3 shadow-sm">
            <p className="text-[10px] font-black text-gray-4 uppercase tracking-widest mb-1">Total</p>
            <p className="text-base font-black text-dark">S/ {total.toFixed(2)}</p>
          </div>
          <div className="bg-blue/5 rounded-2xl p-3.5 text-center border border-blue/20 shadow-sm">
            <p className="text-[10px] font-black text-blue/60 uppercase tracking-widest mb-1">Pagado</p>
            <p className="text-base font-black text-blue">S/ {montoPagadoActual.toFixed(2)}</p>
          </div>
          <div className="bg-red/5 rounded-2xl p-3.5 text-center border border-red/20 shadow-sm">
            <p className="text-[10px] font-black text-red/60 uppercase tracking-widest mb-1">Deuda</p>
            <p className="text-base font-black text-red">S/ {deudaActual.toFixed(2)}</p>
          </div>
        </div>

        {/* MONTO */}
        <div className="mb-5">
          <label className="text-xs font-bold text-dark-3 uppercase tracking-wider mb-1.5 block">
            Monto a Pagar <span className="text-[10px] text-gray-5 font-normal">(máx. S/ {deudaActual.toFixed(2)})</span>
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            max={deudaActual}
            value={monto}
            onChange={(e) => {
              setMonto(e.target.value);
              if (error) setError("");
            }}
            placeholder="0.00"
            className="w-full rounded-2xl border-2 border-gray-3 bg-white px-4 py-3.5 outline-none focus:border-yellow-dark focus:ring-4 focus:ring-yellow/10 transition-all text-dark shadow-sm text-base font-black"
          />
          {monto && parseFloat(monto) > deudaActual && (
            <p className="mt-1.5 text-xs text-yellow-dark font-bold">
              ⚠ El monto supera la deuda. Se registrará solo S/ {deudaActual.toFixed(2)}.
            </p>
          )}
        </div>

        {/* MÉTODO DE PAGO */}
        <div className="mb-6">
          <label className="text-xs font-bold text-dark-3 uppercase tracking-wider mb-2 block">
            Método de Pago
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {METODOS.map((m) => {
              const isSelected = metodoPago === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMetodoPago(m);
                    if (error) setError("");
                  }}
                  className={`py-3.5 px-3 rounded-2xl border text-xs font-black uppercase tracking-tight transition-all duration-100 cursor-pointer select-none active:scale-95 flex items-center justify-center text-center truncate ${
                    isSelected
                      ? "bg-yellow-dark border-yellow-dark text-white shadow-md shadow-yellow-dark/20 scale-[1.02]"
                      : "bg-white border-gray-3 text-dark-4 hover:border-yellow-dark/60 hover:bg-yellow/5"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mb-4 text-xs font-bold text-red flex items-center gap-1.5 bg-red-light-6 p-3 rounded-xl border border-red-light-3">
            <span>✕</span> {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border-2 border-gray-3 font-black text-xs uppercase tracking-wider text-dark hover:bg-beige transition-all cursor-pointer active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || deudaActual <= 0}
            className="flex-1 py-3.5 bg-yellow-dark hover:bg-yellow text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Procesando...
              </>
            ) : (
              "Registrar Pago"
            )}
          </button>
        </div>
      </div>
    </ModalFrameWrapper>
  );
};
