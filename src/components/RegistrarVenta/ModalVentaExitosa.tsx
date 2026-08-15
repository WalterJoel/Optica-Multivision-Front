"use client";

import React, { useEffect } from "react";
import { Printer } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal/ModalFrameWrapper";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";

interface ModalVentaExitosaProps {
  estaAbierto: boolean;
  mensaje: string;
  onCerrar: () => void;
  onImprimirTicket: () => void;
}

export function ModalVentaExitosa({
  estaAbierto,
  mensaje,
  onCerrar,
  onImprimirTicket,
}: ModalVentaExitosaProps) {
  useEffect(() => {
    if (estaAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [estaAbierto]);

  if (!estaAbierto) return null;

  return (
    <ModalFrameWrapper variant="yellow" size="xs">
      <div className="flex flex-col items-center text-center pb-6 pt-4 px-2">
        {/* ICONO ÉXITO */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-yellow/10 animate-pulse">
            <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-sm bg-yellow-dark">
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
            </div>
          </div>
        </div>

        {/* TÍTULO */}
        <h2 className="font-[1000] text-3xl mb-3 tracking-tighter uppercase text-yellow-dark">
          ¡Venta Registrada!
        </h2>

        {/* MENSAJE */}
        <p className="text-dark-3 font-medium text-sm leading-relaxed mb-8 px-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
          {mensaje}
        </p>

        {/* BOTONES ACCIÓN */}
        <div className="flex flex-col gap-2.5 w-full">
          <BaseButton onClick={onImprimirTicket}>
            <Printer size={16} />
            Imprimir Ticket
          </BaseButton>
          <BaseButton variant="cancel" onClick={onCerrar}>
            Continuar sin imprimir
          </BaseButton>
        </div>
      </div>
    </ModalFrameWrapper>
  );
}
