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

  // Estimamos cuántas cuotas ya se pagaron y cuántas quedan
  const montoCuota = total / nroCuotas;
  const cuotasPagadas = montoCuota > 0 ? Math.round(montoPagadoActual / montoCuota) : 0;
  const cuotasRestantes = Math.max(nroCuotas - cuotasPagadas, 1);
  const isUltimaCuota = cuotasRestantes <= 1;

  const handleSubmit = async () => {
    const montoNum = parseFloat(monto);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }
    if (isUltimaCuota && montoNum < deudaActual) {
      setError(`Es la última cuota: debes abonar el monto completo de S/ ${deudaActual.toFixed(2)}.`);
      return;
    }
    if (!metodoPago) {
      setError("Selecciona un método de pago.");
      return;
    }
    setError("");
    await onSave(venta.id, { montoPagado: montoNum, metodoPago, sedeId });
  };

  return (
    <ModalFrameWrapper size="sm" variant="blue">
      <div className="pt-2 pb-2">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue shadow-sm">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                Registrar Pago
              </h3>
              <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                Venta #{venta.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-beige rounded-2xl p-3 text-center border border-gray-2">
            <p className="text-[9px] font-bold text-gray-4 uppercase tracking-widest mb-1">Total</p>
            <p className="text-sm font-black text-dark">S/ {total.toFixed(2)}</p>
          </div>
          <div className="bg-beige rounded-2xl p-3 text-center border border-gray-2">
            <p className="text-[9px] font-bold text-gray-4 uppercase tracking-widest mb-1">Pagado</p>
            <p className="text-sm font-black text-blue">S/ {montoPagadoActual.toFixed(2)}</p>
          </div>
          <div className="bg-red/5 rounded-2xl p-3 text-center border border-red/20">
            <p className="text-[9px] font-bold text-red/60 uppercase tracking-widest mb-1">Deuda</p>
            <p className="text-sm font-black text-red">S/ {deudaActual.toFixed(2)}</p>
          </div>
        </div>

        {/* MONTO */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 mb-1 block">
            Monto a Pagar <span className="text-[10px] text-gray-4">(máx. S/ {deudaActual.toFixed(2)})</span>
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
            className="w-full rounded-2xl border border-gray-3 bg-white px-4 py-3 outline-none focus:border-blue focus:ring-4 focus:ring-blue/5 transition-all text-dark shadow-sm text-sm"
          />
          {monto && parseFloat(monto) > deudaActual && (
            <p className="mt-1 text-[11px] text-yellow-dark font-bold">
              ⚠ El monto supera la deuda. Se registrará solo S/ {deudaActual.toFixed(2)}.
            </p>
          )}
        </div>

        {/* MÉTODO DE PAGO */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-500 mb-2 block">Método de Pago</label>
          <div className="grid grid-cols-2 gap-2">
            {METODOS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMetodoPago(m);
                  if (error) setError("");
                }}
                className={`py-2.5 rounded-2xl border text-sm font-black uppercase tracking-wide transition-all ${
                  metodoPago === m
                    ? "bg-blue border-blue text-white shadow-md"
                    : "bg-white border-gray-3 text-gray-4 hover:border-blue hover:text-blue"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mb-3 text-[11px] font-bold text-red flex items-center gap-1">
            <span>✕</span> {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-3 font-black text-[11px] uppercase tracking-wider text-dark hover:bg-beige transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-blue hover:bg-blue-dark text-white rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
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
