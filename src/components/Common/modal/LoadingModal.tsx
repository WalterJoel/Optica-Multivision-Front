"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type LoadingModalProps = {
  isOpen: boolean;
};

export function LoadingModal({ isOpen }: LoadingModalProps) {
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Overlay con blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Card con el BORDE y el RING recuperados */}
      <div className="relative z-10 w-full max-w-[280px] bg-white rounded-[40px] shadow-2xl ring-8 ring-blue-light ring-opacity-50 border-4 border-white px-4 py-10 text-center animate-in fade-in zoom-in duration-300">
        {/* Contenedor de la Imagen */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48 animate-side-to-side">
            <Image
              src="/images/icons/loading-spiner.png"
              alt="Cargando..."
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Texto de carga */}
        <h2 className="font-black text-2xl text-[#1976D2] tracking-tight animate-pulse">
          Cargando...
        </h2>

        <p className="text-gray-400 text-[11px] mt-2 uppercase tracking-[0.25em] font-bold">
          Espera un momento
        </p>

        {/* Animación */}
        <style jsx>{`
          .animate-side-to-side {
            animation: side-to-side 2.8s ease-in-out infinite;
          }

          @keyframes side-to-side {
            0%,
            100% {
              transform: translateX(-15px) rotate(-10deg) scale(0.9);
            }
            50% {
              transform: translateX(15px) rotate(10deg) scale(1.1);
            }
          }
        `}</style>
      </div>
    </div>,
    document.body,
  );
}
