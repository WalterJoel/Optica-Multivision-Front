"use client";

import { ModalFrameWrapper } from "./ModalFrameWrapper";
import { AlertOctagon, HelpCircle, Info } from "lucide-react";
import { STATUS_MODAL } from "@/commons/constants";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";
  const isWarning = variant === "warning";

  const getPulseBgClass = () => {
    if (isDanger) return "bg-red/10 animate-pulse";
    if (isWarning) return "bg-yellow/10 animate-pulse";
    return "bg-blue/10 animate-pulse";
  };

  const getSolidBgClass = () => {
    if (isDanger) return "bg-red";
    if (isWarning) return "bg-yellow-dark";
    return "bg-blue";
  };

  const getTitleColorClass = () => {
    if (isDanger) return "text-red";
    if (isWarning) return "text-yellow-dark";
    return "text-blue";
  };

  const getConfirmButtonClass = () => {
    if (isDanger) return "bg-red hover:bg-red-dark shadow-red/20 text-white";
    if (isWarning) return "bg-yellow-dark hover:bg-yellow shadow-yellow-dark/20 text-dark";
    return "bg-blue hover:bg-blue-dark shadow-blue/20 text-white";
  };

  return (
    <ModalFrameWrapper variant={isDanger ? "blue" : "yellow"} size="xs">
      <div className="flex flex-col items-center text-center pb-6 pt-4 px-2">
        {/* ICONO VECTORIAL PREMIUM CON PULSO */}
        <div className="mb-8 relative mt-4">
          <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getPulseBgClass()}`}>
            <div className={`flex items-center justify-center w-16 h-16 rounded-full shadow-sm ${getSolidBgClass()}`}>
              {isDanger ? (
                <AlertOctagon size={32} className="text-white" strokeWidth={2.5} />
              ) : isWarning ? (
                <HelpCircle size={32} className="text-dark" strokeWidth={2.5} />
              ) : (
                <Info size={32} className="text-white" strokeWidth={2.5} />
              )}
            </div>
          </div>
        </div>

        {/* Título */}
        <h2 className={`font-[1000] text-3xl mb-3 tracking-tighter uppercase ${getTitleColorClass()}`}>
          {title}
        </h2>

        {/* Mensaje */}
        <p className="text-dark-3 font-medium text-sm leading-relaxed mb-10 px-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
          {message}
        </p>

        {/* Botones de Acción Estilo w-1/2 */}
        <div className="flex w-full gap-3 mb-3 px-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 py-4 rounded-2xl font-black text-dark-3 uppercase tracking-[0.2em] text-[11px] bg-gray-1 border border-gray-3 hover:bg-gray-2 shadow-sm transition-all active:scale-95"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-1/2 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all active:scale-95 ${getConfirmButtonClass()}`}
          >
            {loading ? "Cargando..." : confirmText}
          </button>
        </div>
      </div>
    </ModalFrameWrapper>
  );
}
