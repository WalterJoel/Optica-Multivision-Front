"use client";

import Image from "next/image";
import { ModalFrameWrapper } from "./";

export function LoadingModal({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <ModalFrameWrapper variant="blue" size="xs">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-40 h-40 animate-side-to-side mb-2">
          <Image
            src="/images/icons/loading-spiner.png"
            alt="Cargando..."
            fill
            className="object-contain"
          />
        </div>

        <h2 className="font-black text-xl text-blue tracking-tight animate-pulse">
          Cargando...
        </h2>

        <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest font-bold">
          Espera un momento
        </p>
      </div>

      <style jsx>{`
        .animate-side-to-side {
          animation: side-to-side 2.5s ease-in-out infinite;
        }
        @keyframes side-to-side {
          0%,
          100% {
            transform: translateX(-10px) rotate(-5deg);
          }
          50% {
            transform: translateX(10px) rotate(5deg);
          }
        }
      `}</style>
    </ModalFrameWrapper>
  );
}
