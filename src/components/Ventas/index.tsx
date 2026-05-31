"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { MiniTable } from "./MiniTable";

import { useSales, useAnularVenta } from "@/hooks/sales";
import { useSessionUser } from "@/hooks/session";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

export default function CajaPremiumFino() {
  // Hooks
  const { sedeId } = useSessionUser();
  const { getAllSales, sales, loading } = useSales(sedeId!);
  const { anularVenta, loading: isAnnulling, success: annulOk, statusMessage: annulMsg } = useAnularVenta();

  const [fecha, setFecha] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    if (sedeId) {
      getAllSales();
    }
  }, [sedeId]);

  useEffect(() => {
    if (!isAnnulling && (annulOk || annulMsg)) {
      setTypeModal(
        annulOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setModalMsg(annulMsg);
      setOpenModal(true);
      if (annulOk) {
        getAllSales();
      }
    }
  }, [isAnnulling, annulOk, annulMsg]);

  const ventasFiltradas = fecha
    ? sales.filter(
      (v) => new Date(v.createdAt).toISOString().slice(0, 10) === fecha,
    )
    : sales;

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <TrendingUp size={26} className="text-blue-light" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-[5px] bg-yellow-dark" />
                <p className="text-[10px] sm:text-[11px] font-black text-blue-light uppercase tracking-[3px]">
                  Resumen
                </p>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark tracking-tighter uppercase leading-none">
                Resumen de{" "}
                <span className="text-blue-light italic">Ventas</span>
              </h1>
            </div>
          </div>
        </header>

        {/* TABLAS */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 sm:gap-8">
          <MiniTable titulo="Ventas" data={sales} onDelete={anularVenta} />
        </div>
      </div>

      {/* MODALS */}
      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={modalMsg}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
