"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Calendar,
  Send,
  Store,
  User,
  FileSpreadsheet,
  PackageSearch,
} from "lucide-react";
import { TipoProducto, OrigenSolicitudTraslado } from "@/commons/constants";
import { SedeSelect } from "@/components/Common/SedeSelect";
import { useSessionUser } from "@/hooks/session";
import { useStores } from "@/hooks/stores";
import { getLocalDateString } from "@/utils/date";
import { useVentasPorTipo } from "@/hooks/sales";
import { useTraslados } from "@/hooks/traslados/useTraslados";
import { TableTraslados, ITablaTrasladoRow } from "./TableTraslados";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

export function CrearTraslado() {
  // Constantes
  const categories = [
    TipoProducto.MONTURA,
    TipoProducto.LENTE,
    TipoProducto.ACCESORIO,
  ];

  const today = getLocalDateString();

  // Hooks
  const { sedeId: userSedeId, userId, fullName } = useSessionUser();
  const { sedes } = useStores();
  const { fetchVentasPorTipo, clearItems, items, loading: loadingItems } = useVentasPorTipo();
  const { crearTraslado, loading: submitting, statusMessage, setStatusMessage } =
    useTraslados();

  // States
  const [fechaInicio, setFechaInicio] = useState<string>(today);
  const [fechaFin, setFechaFin] = useState<string>(today);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedRows, setSelectedRows] = useState<ITablaTrasladoRow[]>([]);
  const [proveedoraSedeId, setProveedoraSedeId] = useState<number>(1);
  const [origenSolicitud, setOrigenSolicitud] = useState<OrigenSolicitudTraslado>(
    OrigenSolicitudTraslado.REPORTE_VENTAS
  );
  const [selectedCategory, setSelectedCategory] = useState<TipoProducto>(
    TipoProducto.MONTURA
  );

  // Memos
  const nombreSedeDestino = useMemo(() => {
    const s = (sedes || []).find((item) => item.id === userSedeId);
    return s ? s.nombre : `Sede #${userSedeId || 1}`;
  }, [sedes, userSedeId]);

  const nombreSedeProveedora = useMemo(() => {
    const s = (sedes || []).find((item) => item.id === proveedoraSedeId);
    return s ? s.nombre : `Sede #${proveedoraSedeId || 1}`;
  }, [sedes, proveedoraSedeId]);

  // Functions
  const resetForm = () => {
    setSelectedRows([]);
    clearItems();
    setFechaInicio(today);
    setFechaFin(today);
    setSelectedCategory(TipoProducto.MONTURA);
    setOrigenSolicitud(OrigenSolicitudTraslado.REPORTE_VENTAS);
    if (userSedeId) {
      setProveedoraSedeId(userSedeId === 1 ? 2 : 1);
    }
  };

  const handleCrearSolicitud = async () => {
    if (selectedRows.length === 0) return;
    if (!userSedeId) {
      setStatusMessage("No se identificó la sede del usuario solicitante.");
      setTypeModal(STATUS_MODAL.ERROR_MODAL);
      setOpenModal(true);
      return;
    }

    const invalidQuantity = selectedRows.some(
      (row) => typeof row.selectedQuantity !== "number" || row.selectedQuantity <= 0
    );
    if (invalidQuantity) {
      setStatusMessage("La cantidad a solicitar debe ser mayor a 0.");
      setTypeModal(STATUS_MODAL.ERROR_MODAL);
      setOpenModal(true);
      return;
    }

    try {
      const payload = {
        origenSolicitud,
        sedeProveedoraId: proveedoraSedeId,
        sedeSolicitanteId: userSedeId,
        usuarioSolicitanteId: userId,
        observaciones: `Solicitud (${origenSolicitud}) creada desde la web para ${selectedRows.length} ítem(s).`,
        detalles: selectedRows.map((row) => ({
          tipoProducto: selectedCategory,
          productoId: selectedCategory !== TipoProducto.LENTE ? row.productoId : undefined,
          stockId: selectedCategory === TipoProducto.LENTE ? row.stockId : undefined,
          cantidadSolicitada: typeof row.selectedQuantity === "number" && row.selectedQuantity >= 1 ? row.selectedQuantity : 1,
        })),
      };

      await crearTraslado(payload);
      setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
      setOpenModal(true);
      resetForm();
    } catch (err: any) {
      setTypeModal(STATUS_MODAL.ERROR_MODAL);
      setOpenModal(true);
    }
  };

  // Effects
  useEffect(() => {
    if (userSedeId) {
      setProveedoraSedeId(userSedeId === 1 ? 2 : 1);
    }
  }, [userSedeId]);

  useEffect(() => {
    if (
      origenSolicitud === OrigenSolicitudTraslado.REPORTE_VENTAS &&
      userSedeId &&
      fechaInicio &&
      fechaFin &&
      selectedCategory
    ) {
      fetchVentasPorTipo(userSedeId, fechaInicio, fechaFin, selectedCategory);
    }
  }, [
    origenSolicitud,
    userSedeId,
    fechaInicio,
    fechaFin,
    selectedCategory,
    fetchVentasPorTipo,
  ]);

  return (
    <div className="bg-beige pt-32 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen mt-15">
      <div className="max-w-[1700px] mx-auto space-y-6">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-light blur-2xl opacity-10 rounded-full" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-blue-light-5 shadow-testimonial flex items-center justify-center relative z-10">
                <ShoppingCart size={24} className="text-blue-light" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <p className="text-[10px] font-bold text-blue-light uppercase tracking-[3px]">
                  Traslados
                </p>
              </div>

              <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-dark tracking-tight">
                Crear <span className="text-blue-light">Traslado</span>
              </h1>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-light-4/50 rounded-2xl p-4 shadow-sm shrink-0 bg-gradient-to-r from-white to-blue-light/5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-blue-light tracking-wider">
                  Solicitante
                </span>
                <span className="text-xs font-black text-emerald-700 uppercase">
                  {fullName || "Usuario Activo"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-blue-light tracking-wider">
                  Sede Solicitante
                </span>
                <span className="text-xs font-black text-emerald-700 uppercase">
                  {nombreSedeDestino}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-blue-light tracking-wider">
                  Sede Proveedora
                </span>
                <span className="text-xs font-black text-amber-800 uppercase">
                  {nombreSedeProveedora}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-blue-light tracking-wider">
                  Fecha Pedido
                </span>
                <span className="text-xs font-black text-slate-800 uppercase">
                  {today}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white border border-gray-3 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-dark tracking-wider">
                Desde
              </span>
              <div className="flex items-center bg-beige-dark/20 p-1 rounded-xl border border-gray-3">
                <button
                  onClick={() => setOrigenSolicitud(OrigenSolicitudTraslado.REPORTE_VENTAS)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all ${origenSolicitud === OrigenSolicitudTraslado.REPORTE_VENTAS
                    ? "bg-white text-blue-light shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-dark"
                    }`}
                >
                  <FileSpreadsheet size={15} />
                  <span>Reporte Ventas</span>
                </button>

                <button
                  onClick={() => setOrigenSolicitud(OrigenSolicitudTraslado.PRODUCTOS)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all ${origenSolicitud === OrigenSolicitudTraslado.PRODUCTOS
                    ? "bg-white text-blue-light shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-dark"
                    }`}
                >
                  <PackageSearch size={15} />
                  <span> Productos</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-dark tracking-wider">
                Solicitar a
              </span>
              <SedeSelect value={proveedoraSedeId} onChange={setProveedoraSedeId} />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-dark tracking-wider">
                Producto
              </span>
              <div className="flex items-center gap-1.5 bg-beige-dark/20 p-1 rounded-xl border border-gray-3">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as TipoProducto)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${isActive
                        ? "bg-white text-blue-light shadow-sm border border-gray-200"
                        : "text-gray-600 hover:text-dark"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {origenSolicitud === OrigenSolicitudTraslado.REPORTE_VENTAS && (
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black uppercase text-dark tracking-wider">
                  Fecha
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 bg-white border border-gray-3 rounded-xl px-3 py-1.5 shadow-sm">
                    <Calendar size={15} className="text-blue-light" />
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="bg-transparent outline-none text-xs font-bold text-dark cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-gray-3 rounded-xl px-3 py-1.5 shadow-sm">
                    <Calendar size={15} className="text-blue-light" />
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="bg-transparent outline-none text-xs font-bold text-dark cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <TableTraslados
          items={items}
          tipoProducto={selectedCategory}
          loading={loadingItems}
          onSelectionChange={setSelectedRows}
        />

        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={handleCrearSolicitud}
            disabled={submitting || selectedRows.length === 0}
            className="bg-yellow hover:bg-yellow-dark text-dark font-black text-xs uppercase tracking-[0.15em] px-10 py-4 rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Procesando..." : "Crear Traslado"}
          </button>
        </div>

        <LoadingModal isOpen={submitting} />
        <StatusModal
          isOpen={openModal}
          type={typeModal}
          message={statusMessage}
          onClose={() => setOpenModal(false)}
        />
      </div>
    </div>
  );
}
