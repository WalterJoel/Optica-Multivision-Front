"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { SUCCESS_ICON, STATUS_MODAL } from "@/commons/constants";

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

  const config = {
    title: isSuccess ? "¡Éxito!" : "Ocurrió un error",
    textColor: isSuccess ? "text-blue" : "text-red-vino",
    buttonBg: isSuccess ? "bg-blue" : "bg-red-vino",
    ringClass: isSuccess ? "ring-blue-light" : "ring-red-vinolight",
    icon: isSuccess ? SUCCESS_ICON : "/images/icons/error-modal.png",
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={`relative z-10 w-full max-w-[360px] bg-white rounded-xl shadow-2xl ring-8 ring-opacity-50 ${config.ringClass} px-6 py-8 text-center animate-in fade-in zoom-in duration-300`}
      >
        {/* Icono PNG */}
        <div className="w-44 h-44 mx-auto relative -mt-6 mb-2">
          <Image
            src={config.icon}
            alt={type}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Título*/}
        <h2
          className={`font-extrabold text-3xl mb-3 tracking-tight ${config.textColor}`}
        >
          {config.title}
        </h2>

        {/* Mensaje  */}
        <p className="text-gray-600 text-base leading-relaxed mb-8 px-2">
          {message}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-4 px-5 rounded-xl font-bold text-white text-lg transition-all active:scale-95 shadow-md hover:brightness-110 ${config.buttonBg}`}
        >
          {isSuccess ? "Continuar" : "Entendido"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
