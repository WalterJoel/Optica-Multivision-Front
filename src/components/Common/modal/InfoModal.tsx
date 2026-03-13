"use client";

import { ModalFrameWrapper } from "@/components/Common/modal";
import { AlertTriangle } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  message: string;
  code?: string | number;
}

export function InfoModal({
  isOpen,
  onClose,
  title = "Atención",
  message,
  code,
}: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <ModalFrameWrapper variant="yellow" size="xs">
      <div className="flex flex-col items-center text-center p-2">
        {/* Icono Lucide con tus colores yellow */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-light-4 mb-4">
          <AlertTriangle size={48} className="text-yellow" strokeWidth={2} />
        </div>

        {/* Título */}
        <h2 className="font-black text-xl text-yellow-dark-2 tracking-tight leading-tight">
          {title}
        </h2>

        {/* Mensaje Principal */}
        <p className="text-gray-600 text-sm mt-2 font-medium">{message}</p>

        {/* Código Opcional */}
        {code && (
          <span className="mt-3 px-3 py-1 bg-yellow-light-2 text-yellow-dark-2 text-[10px] rounded-full uppercase tracking-widest font-bold">
            Code Error: {code}
          </span>
        )}

        {/* Botón de acción con yellow dark */}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 w-full py-2 bg-yellow text-white font-bold rounded-lg hover:bg-yellow-dark transition-colors uppercase text-xs tracking-widest"
          >
            Entendido
          </button>
        )}
      </div>
    </ModalFrameWrapper>
  );
}
