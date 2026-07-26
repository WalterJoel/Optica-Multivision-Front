"use client";

import React, { useState } from "react";
import { useSessionUser } from "@/hooks/session";
import { useTraslados } from "@/hooks/traslados/useTraslados";
import { StatusModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { Solicitante } from "./Solicitante";
import { Proveedor } from "./Proveedor";
import { Inbox, Truck } from "lucide-react";

export default function Solicitudes() {
  const { sedeId: userSedeId, userId } = useSessionUser();
  const { statusMessage } = useTraslados();

  const [activeTab, setActiveTab] = useState<"RECEPCIONES" | "DESPACHOS">("RECEPCIONES");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");

  const handleSuccessAction = () => {
    setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
    setOpenStatusModal(true);
  };

  const handleErrorAction = (err: any) => {
    setTypeModal(STATUS_MODAL.ERROR_MODAL);
    setOpenStatusModal(true);
  };

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* Cabecera Principal */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <Inbox size={26} className="text-blue-light" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-[4px] bg-yellow-dark rounded-full" />
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-dark tracking-tight">
                Mis <span className="text-blue-light">Traslados</span>
              </h1>
            </div>
          </div>

          {/* Selector de Pestañas ("Como solicitante" vs "Como proveedor") */}
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-gray-3 shadow-sm w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("RECEPCIONES")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "RECEPCIONES"
                  ? "bg-blue-light text-white shadow-md"
                  : "text-gray-500 hover:text-dark hover:bg-beige"
              }`}
            >
              <Inbox size={16} />
              <span>Como solicitante</span>
            </button>

            <button
              onClick={() => setActiveTab("DESPACHOS")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "DESPACHOS"
                  ? "bg-blue-light text-white shadow-md"
                  : "text-gray-500 hover:text-dark hover:bg-beige"
              }`}
            >
              <Truck size={16} />
              <span>Como proveedor</span>
            </button>
          </div>
        </header>

        {/* Submódulos independientes */}
        {activeTab === "RECEPCIONES" ? (
          <Solicitante
            userSedeId={userSedeId || 1}
            userId={userId || 1}
            onSuccessAction={handleSuccessAction}
            onErrorAction={handleErrorAction}
          />
        ) : (
          <Proveedor
            userSedeId={userSedeId || 1}
            onSuccessAction={handleSuccessAction}
            onErrorAction={handleErrorAction}
          />
        )}

        <StatusModal
          isOpen={openStatusModal}
          type={typeModal}
          message={statusMessage}
          onClose={() => setOpenStatusModal(false)}
        />
      </div>
    </div>
  );
}
