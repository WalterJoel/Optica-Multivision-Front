"use client";

import React, { useState, useEffect } from "react";
import { X, Edit3, User, Search, Loader2 } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { BaseInput } from "@/components/Common/Inputs";
import { IResponseSale } from "@/types/sales";
import { useSearchClient } from "@/hooks/clients";

interface EditarVentaModalProps {
  venta: IResponseSale;
  onClose: () => void;
  onSave: (id: number, payload: any) => Promise<any>;
  loading: boolean;
}

export const EditarVentaModal: React.FC<EditarVentaModalProps> = ({
  venta,
  onClose,
  onSave,
  loading,
}) => {
  const [observaciones, setObservaciones] = useState(venta.observaciones || "");
  const [montaje, setMontaje] = useState(venta.montaje ?? false);
  const [metodoPago, setMetodoPago] = useState(venta.metodoPago || "");
  const [diasCompromisoPago, setDiasCompromisoPago] = useState<number | null>(
    venta.diasCompromisoPago ?? null
  );
  const [clienteId, setClienteId] = useState<number | null>(venta.clienteId ?? null);
  const [clienteQuery, setClienteQuery] = useState(() => {
    if (!venta.cliente) return "";
    if (venta.cliente.tipoCliente === "EMPRESA") return venta.cliente.razonSocial || "";
    return `${venta.cliente.nombres || ""} ${venta.cliente.apellidos || ""}`.trim();
  });

  const { clients, loading: searchLoading, showList, searchClients, setShowList } = useSearchClient();
  const [clienteError, setClienteError] = useState(false);

  const handleClienteInput = (val: string) => {
    setClienteQuery(val);
    if (!val) {
      setClienteId(null);
    }
    searchClients(val);
  };

  const handleSelectCliente = (c: any) => {
    setClienteId(c.id);
    const display = c.tipoCliente === "EMPRESA"
      ? c.razonSocial
      : `${c.nombres || ""} ${c.apellidos || ""}`.trim();
    setClienteQuery(display);
    setShowList(false);
  };

  const handleSubmit = async () => {
    // Validar cliente obligatorio en ventas CRÉDITO
    if (venta.tipoVenta === "CREDITO" && !clienteId) {
      setClienteError(true);
      return;
    }
    setClienteError(false);
    const payload: any = {
      observaciones,
      montaje,
      metodoPago,
    };
    if (venta.tipoVenta === "CREDITO") {
      payload.diasCompromisoPago = diasCompromisoPago;
    }
    if (clienteId !== venta.clienteId) {
      payload.clienteId = clienteId;
    }
    await onSave(venta.id, payload);
  };

  return (
    <ModalFrameWrapper size="md" variant="yellow">
      <div className="pt-2 pb-2">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-yellow/10 border border-yellow-dark/20 flex items-center justify-center text-yellow-dark shadow-sm">
              <Edit3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                Editar Venta
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

        {/* CAMPOS */}
        <div className="flex flex-col gap-4">

          {/* CLIENTE */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              Cliente
              {venta.tipoVenta === "CREDITO" && (
                <span className="text-red font-bold ml-1">*</span>
              )}
              <span className="text-[10px] text-gray-4 ml-1">(busca por nombre o documento)</span>
            </label>
            <div className="relative flex items-center">
              <User size={14} className="absolute left-3.5 text-gray-4 pointer-events-none" />
              <input
                type="text"
                value={clienteQuery}
                onChange={(e) => {
                  handleClienteInput(e.target.value);
                  if (clienteError) setClienteError(false);
                }}
                placeholder="Buscar cliente..."
                className={`w-full pl-9 pr-4 rounded-2xl border bg-white p-4.5 outline-none focus:ring-4 transition-all duration-300 placeholder:text-gray-4 text-dark shadow-sm text-sm ${
                  clienteError
                    ? "border-red focus:border-red focus:ring-red/10"
                    : "border-gray-3 focus:border-blue focus:ring-blue/5"
                }`}
              />
              {searchLoading && (
                <Loader2 size={14} className="absolute right-3.5 animate-spin text-blue" />
              )}
            </div>
            {showList && clients.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-2 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {clients.map((c) => {
                  const name = c.tipoCliente === "EMPRESA"
                    ? c.razonSocial
                    : `${c.nombres || ""} ${c.apellidos || ""}`.trim();
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCliente(c)}
                      className="w-full px-4 py-2.5 text-left hover:bg-beige transition-colors flex justify-between items-center"
                    >
                      <span className="font-bold text-dark text-sm">{name}</span>
                      <span className="text-[10px] text-gray-4 font-mono">{c.numeroDoc}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {clienteError && venta.tipoVenta === "CREDITO" && (
              <p className="mt-1.5 text-[11px] font-bold text-red flex items-center gap-1">
                <span>✕</span> Debes seleccionar un cliente para ventas a crédito.
              </p>
            )}
          </div>

          {/* OBSERVACIONES */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Observaciones de la venta</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Notas de entrega, aclaraciones..."
              className="w-full rounded-2xl border border-gray-3 bg-white px-4 py-3 outline-none focus:border-blue focus:ring-4 focus:ring-blue/5 transition-all duration-300 placeholder:text-gray-4 text-dark shadow-sm text-sm resize-none"
            />
          </div>

          {/* MONTAJE */}
          <div className="flex items-center justify-between bg-beige/60 rounded-2xl px-4 py-3 border border-gray-2">
            <div>
              <p className="text-sm font-bold text-dark">Montaje en Laboratorio</p>
              <p className="text-[11px] text-gray-4">¿El lente requiere ensamblado?</p>
            </div>
            <button
              type="button"
              onClick={() => setMontaje((prev) => !prev)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${montaje ? "bg-blue" : "bg-gray-3"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${montaje ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* MÉTODO DE PAGO */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Método de Pago</label>
            <div className="grid grid-cols-2 gap-2">
              {["EFECTIVO", "YAPE", "PLIN", "TRANSFERENCIA"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetodoPago(m)}
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

          {/* DÍAS COMPROMISO (solo crédito) */}
          {venta.tipoVenta === "CREDITO" && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Días de Compromiso de Pago</label>
              <select
                value={diasCompromisoPago ?? ""}
                onChange={(e) =>
                  setDiasCompromisoPago(e.target.value === "" ? null : Number(e.target.value))
                }
                className="w-full rounded-2xl border border-gray-3 bg-white px-4 py-3 outline-none focus:border-blue focus:ring-4 focus:ring-blue/5 transition-all duration-300 text-dark shadow-sm text-sm"
              >
                <option value="">-- Sin compromiso --</option>
                <option value={1}>1 día</option>
                <option value={7}>7 días</option>
                <option value={15}>15 días</option>
                <option value={30}>30 días</option>
              </select>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">
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
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </div>
    </ModalFrameWrapper>
  );
};
