"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Calendar,
  FileSpreadsheet,
  PackageSearch,
  Search,
} from "lucide-react";
import { TipoProducto, OrigenSolicitudTraslado } from "@/commons/constants";
import { SedeSelect } from "@/components/Common/SedeSelect";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { useSessionUser } from "@/hooks/session";
import { useStores } from "@/hooks/stores";
import { getLocalDateString } from "@/utils/date";
import { useVentasPorTipo } from "@/hooks/sales";
import { IVentaPorTipoItem } from "@/types/sales";
import { useBuscarProductosTraslado } from "@/hooks/traslados/useBuscarProductosTraslado";
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

  // Router
  const router = useRouter();

  // Hooks
  const { sedeId: userSedeId, userId, fullName } = useSessionUser();
  const { sedes } = useStores();
  const { fetchVentasPorTipo, clearItems: clearVentasItems, items: ventasItems, loading: loadingVentas } = useVentasPorTipo();
  const { fetchProductosForTransfer, clearItems: clearProductosItems, items: productosItems, loading: loadingProductos } = useBuscarProductosTraslado();
  const { crearTraslado, loading: submitting, statusMessage, setStatusMessage } =
    useTraslados();

  // States
  const [fechaInicio, setFechaInicio] = useState<string>(today);
  const [fechaFin, setFechaFin] = useState<string>(today);
  const [busquedaProducto, setBusquedaProducto] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [manualItems, setManualItems] = useState<IVentaPorTipoItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedRows, setSelectedRows] = useState<ITablaTrasladoRow[]>([]);
  const [proveedoraSedeId, setProveedoraSedeId] = useState<number | null>(null);
  const [origenSolicitud, setOrigenSolicitud] = useState<OrigenSolicitudTraslado>(
    OrigenSolicitudTraslado.REPORTE_VENTAS
  );
  const [selectedCategory, setSelectedCategory] = useState<TipoProducto>(
    TipoProducto.MONTURA
  );

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    clearVentasItems();
    clearProductosItems();
    setManualItems([]);
    setFechaInicio(today);
    setFechaFin(today);
    setBusquedaProducto("");
    setShowSearchResults(false);
    setSelectedCategory(TipoProducto.MONTURA);
    setOrigenSolicitud(OrigenSolicitudTraslado.REPORTE_VENTAS);
    if (userSedeId) {
      setProveedoraSedeId(userSedeId === 1 ? 2 : 1);
    }
  };

  const handleAddProductToTransfer = (prod: IVentaPorTipoItem) => {
    setManualItems((prev) => {
      const existsIndex = prev.findIndex((item) => {
        if (selectedCategory === TipoProducto.LENTE) {
          return item.stockId === prod.stockId;
        }
        return item.productoId === prod.productoId;
      });

      if (existsIndex >= 0) {
        const updated = [...prev];
        const currentQty = updated[existsIndex].cantidad ?? 1;
        updated[existsIndex] = {
          ...updated[existsIndex],
          cantidad: currentQty + 1,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...prod,
          cantidad: 1,
        },
      ];
    });

    setBusquedaProducto("");
    setShowSearchResults(false);
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

  const handleCloseStatusModal = () => {
    setOpenModal(false);
    if (typeModal === STATUS_MODAL.SUCCESS_MODAL) {
      router.push("/solicitudes");
    }
  };

  // Effects
  useEffect(() => {
    if (userSedeId) {
      setProveedoraSedeId(userSedeId === 1 ? 2 : 1);
    }
  }, [userSedeId]);

  // Al cambiar de categoría o sede proveedora en "PRODUCTOS", reseteamos manualItems
  useEffect(() => {
    if (origenSolicitud === OrigenSolicitudTraslado.PRODUCTOS) {
      setManualItems([]);
      setBusquedaProducto("");
      setShowSearchResults(false);
    }
  }, [selectedCategory, proveedoraSedeId, origenSolicitud]);

  // Cargar ítems de ventas cuando el origen es REPORTE_VENTAS
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

  // Cargar resultados del buscador cuando se escribe texto
  useEffect(() => {
    if (
      origenSolicitud === OrigenSolicitudTraslado.PRODUCTOS &&
      proveedoraSedeId &&
      selectedCategory &&
      busquedaProducto.trim() !== ""
    ) {
      fetchProductosForTransfer(proveedoraSedeId, selectedCategory, busquedaProducto);
    } else if (origenSolicitud === OrigenSolicitudTraslado.PRODUCTOS) {
      clearProductosItems();
    }
  }, [
    origenSolicitud,
    proveedoraSedeId,
    selectedCategory,
    busquedaProducto,
    fetchProductosForTransfer,
    clearProductosItems,
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    origenSolicitud === OrigenSolicitudTraslado.REPORTE_VENTAS
                      ? "bg-white text-blue-light shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-dark"
                  }`}
                >
                  <FileSpreadsheet size={15} />
                  <span>Reporte Ventas</span>
                </button>

                <button
                  onClick={() => setOrigenSolicitud(OrigenSolicitudTraslado.PRODUCTOS)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    origenSolicitud === OrigenSolicitudTraslado.PRODUCTOS
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        isActive
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

            {origenSolicitud === OrigenSolicitudTraslado.REPORTE_VENTAS ? (
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
            ) : (
              <div ref={searchContainerRef} className="relative flex flex-col gap-1 min-w-[280px]">
                <span className="text-[9px] font-black uppercase text-dark tracking-wider">
                  Buscar en Proveedora ({nombreSedeProveedora})
                </span>
                <div className="flex items-center gap-2 bg-white border border-gray-3 rounded-xl px-3 py-1.5 shadow-sm">
                  <Search size={15} className="text-blue-light flex-shrink-0" />
                  <input
                    type="text"
                    value={busquedaProducto}
                    onFocus={() => setShowSearchResults(true)}
                    onChange={(e) => {
                      setBusquedaProducto(e.target.value);
                      setShowSearchResults(true);
                    }}
                    placeholder="Código, marca, material o dioptría..."
                    className="bg-transparent outline-none text-xs font-bold text-dark w-full placeholder:text-gray-4"
                  />
                  {busquedaProducto && (
                    <button
                      type="button"
                      onClick={() => {
                        setBusquedaProducto("");
                        clearProductosItems();
                      }}
                      className="text-gray-4 hover:text-dark text-xs font-black px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* DESPLEGABLE DE RESULTADOS DE BÚSQUEDA */}
                {showSearchResults && busquedaProducto.trim() !== "" && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-light-4 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                    {loadingProductos ? (
                      <div className="p-3 text-center text-xs font-bold text-gray-5 animate-pulse">
                        Buscando en {nombreSedeProveedora}...
                      </div>
                    ) : productosItems.length === 0 ? (
                      <div className="p-3 text-center text-xs font-bold text-gray-5">
                        No se encontraron productos coincidentes
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {productosItems.map((prod, idx) => (
                          <div
                            key={`${prod.productoId || prod.stockId || idx}`}
                            onClick={() => handleAddProductToTransfer(prod)}
                            className="p-3 hover:bg-emerald-50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex flex-col">
                              <span className="font-black text-dark uppercase">
                                {prod.codigo ? `${prod.codigo} - ` : ""}
                                {prod.nombre || `${prod.marca || ""} ${prod.material || ""}`.trim() || "Producto"}
                              </span>
                              {(prod.sph || prod.cyl) && (
                                <span className="text-[10px] font-mono font-bold text-blue">
                                  {prod.sph ? `SPH: ${prod.sph}` : ""} {prod.cyl ? `CYL: ${prod.cyl}` : ""}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                Stock: {prod.cantidad}
                              </span>
                              <span className="bg-blue hover:bg-blue-dark text-white font-black text-[10px] px-2.5 py-1 rounded-lg shadow-sm transition-all">
                                + Agregar
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <TableTraslados
          items={origenSolicitud === OrigenSolicitudTraslado.REPORTE_VENTAS ? ventasItems : manualItems}
          tipoProducto={selectedCategory}
          loading={origenSolicitud === OrigenSolicitudTraslado.REPORTE_VENTAS ? loadingVentas : false}
          onSelectionChange={setSelectedRows}
        />

        <div className="flex justify-center pt-4 pb-8 max-w-xs mx-auto">
          <BaseButton
            onClick={handleCrearSolicitud}
            disabled={submitting || selectedRows.length === 0}
            loading={submitting}
            variant="primary"
          >
            Crear Traslado
          </BaseButton>
        </div>

        <LoadingModal isOpen={submitting} />
        <StatusModal
          isOpen={openModal}
          type={typeModal}
          message={statusMessage}
          onClose={handleCloseStatusModal}
        />
      </div>
    </div>
  );
}
