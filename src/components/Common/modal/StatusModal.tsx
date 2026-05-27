"use client";

import { useEffect } from "react";
import { STATUS_MODAL } from "@/commons/constants";
import { ModalFrameWrapper } from "./ModalFrameWrapper";

type StatusModalProps = {
  isOpen: boolean;
  type: string;
  message: string;
  onClose: () => void;
};

export function StatusModal({
  isOpen,
  type,
  message,
  onClose,
}: StatusModalProps) {
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

  if (!isOpen) return null;

  const isSuccess = type === STATUS_MODAL.SUCCESS_MODAL;

  return (
    <ModalFrameWrapper variant={isSuccess ? "yellow" : "blue"} size="xs">
      <div className="flex flex-col items-center text-center pb-6 pt-4 px-2">
        {/* ICONO VECTORIAL PREMIUM */}
        <div className="mb-8 relative">
          {/* Círculo de fondo con pulso */}
          <div
            className={`flex items-center justify-center w-24 h-24 rounded-full ${isSuccess ? "bg-yellow/10" : "bg-red-vino/10"} animate-pulse`}
          >
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-sm ${isSuccess ? "bg-yellow-dark" : "bg-red"}`}
            >
              {isSuccess ? (
                // Icono de Check (Éxito)
                <svg
                  className="w-8 h-8 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                // Icono de X (Error)
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Título  */}
        <h2
          className={`font-[1000] text-3xl mb-3 tracking-tighter uppercase text-yellow-dark`}
        >
          {isSuccess ? "¡Éxito!" : "Error !"}
        </h2>

        {/* Mensaje con Scroll */}
        <p className="text-dark-3 font-medium text-sm leading-relaxed mb-10 px-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
          {message}
        </p>
        {/* Botón Principal */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl font-black text-dark uppercase tracking-[0.2em] text-[11px] bg-yellow-dark hover:bg-yellow shadow-xl shadow-yellow-dark/20 transition-all active:scale-95 mb-3"
        >
          {isSuccess ? "Continuar" : "Entendido"}
        </button>
      </div>
    </ModalFrameWrapper>
  );
}
