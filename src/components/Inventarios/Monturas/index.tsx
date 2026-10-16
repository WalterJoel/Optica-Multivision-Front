"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, Search, Glasses, PackageSearch, CheckCircle, Trash2 } from "lucide-react";
import { useSearchEyeglassByQr } from "@/hooks/products/eyeglasses/useSearchEyeGlassByQr";
import { useSearchEyeglass } from "@/hooks/products/eyeglasses/useSearchEyeglass";
import { useUpdateStockProductos } from "@/hooks/products/stock/useUpdateStockProductos";
import { IEyeglassQrResponse, IReporteInventarioPayload, IUpdateStockProductos } from "@/types/products";
import {
  StatusModal,
  LoadingModal,
  ModalFrameWrapper,
} from "@/components/Common/modal";
import { STATUS_MODAL, TipoProducto } from "@/commons/constants";
import { BaseButton } from "@/components/Common/Buttons";
import { useSessionUser } from "@/hooks/session";

// Modales
import { ModalPorActualizar } from "./ModalPorActualizar";
import { BaseButtonIcon } from "@/components/Common/Buttons/BaseButtonIcon";
import { useReporteInventario } from "@/hooks/products/stock/useReporteInventario";

export default function InventarioMonturas() {
  const [busqueda, setBusqueda] = useState("");
  const [lote, setLote] = useState<IEyeglassQrResponse[]>([]);
  const [boxItem, setBoxItem] = useState<IEyeglassQrResponse | null>(null);
  const [contador, setContador] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Modales
  const [isOpenModalOutdated, setOpenModalOutdated] = useState<boolean>(false);

  const [dictStocks, setDictStocks] = useState<{ [key: string]: string }>({});

  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { sedeId } = useSessionUser();
  const { eyeglass, searchEyeglassByQr } = useSearchEyeglassByQr();
  const { eyeglasses: opciones, showList, searchEyeglass, setShowList } = useSearchEyeglass();
  const { descargarExcel } = useReporteInventario();
  const { loading, statusMessage, success, updateStockProductos } = useUpdateStockProductos();
  const procesarProductoEncontrado = (data: IEyeglassQrResponse) => {
    const stockId = String(data.stock.id);
    const existeEnLote = lote.find((item) => item.stock.id === data.stock.id);

    if (existeEnLote) {
      const valorActual = dictStocks[stockId];
      const nuevoValor = String(Number(valorActual) + 1);

      setDictStocks((prev) => ({ ...prev, [stockId]: nuevoValor }));
      setBoxItem(existeEnLote);
    } else {
      setLote((prev) => [data, ...prev]);
      setDictStocks((prev) => ({ ...prev, [stockId]: "1" }));
      setBoxItem(data);
    }
    setContador((c) => c + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusqueda(value);
    searchEyeglass(value);
  };

  const handleSelectOption = (codigo: string) => {
    searchEyeglassByQr(codigo, sedeId);
    setShowList(false);
    setBusqueda("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const updateManual = (stockId: string, valor: string) => {
    setDictStocks((prev) => ({ ...prev, [stockId]: valor }));
  };

  const productosModificados = lote.filter((p) => {
    const stockId = String(p.stock.id);
    const stockNuevo = dictStocks[stockId];
    return stockNuevo !== "" && Number(stockNuevo) !== p.stock.cantidad;
  });

  const limpiarTablaInventario = () => {
    setLote([]);
    setDictStocks({});
    setContador(0);
    setBoxItem(null);
    setBusqueda("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const eliminarFila = (stockId: string) => {
    setLote((prev) =>
      prev.filter((item) => String(item.stock.id) !== stockId)
    );

    setDictStocks((prev) => {
      const nuevo = { ...prev };
      delete nuevo[stockId];
      return nuevo;
    });

    setContador((prev) => Math.max(0, prev - 1));

    if (boxItem && String(boxItem.stock.id) === stockId) {
      setBoxItem(null);
    }
  };

  const guardarInventario = async () => {
    const payload: IUpdateStockProductos = {
      items: productosModificados.map((p) => ({
        productoId: p.stock.id,
        cantidad: Number(dictStocks[String(p.stock.id)]),
      })),
    };
    await updateStockProductos(payload);
    setIsModalOpen(false);
  };

  // Reporte de inventario
  const descargarReporteExcel = async () => {
    const payload: IReporteInventarioPayload = {
      idSede: sedeId,
      tipoProducto: TipoProducto.MONTURA
    }
    await descargarExcel(payload);
  };


  useEffect(() => {
    if (eyeglass && eyeglass.montura) {
      procesarProductoEncontrado(eyeglass);
    }
  }, [eyeglass]);

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        limpiarTablaInventario();
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <>
      <section className="overflow-hidden pt-[200px] pb-20 bg-beige min-h-screen">
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-10">
          <div className="sticky top-0 z-40 bg-beige pb-4">
            <header className="bg-white p-4 rounded-2xl border border-blue-light-4 shadow-sm flex items-center gap-6">
              <div className="flex items-center gap-3 pr-5 border-r border-slate-100 min-w-[240px] shrink-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md transition-colors ${loading ? "bg-orange-400 animate-pulse" : "bg-blue"}`}
                >
                  {contador}
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-[9px] font-black text-blue uppercase tracking-widest leading-none mb-1">
                    Inventario
                  </h1>
                  <span className="text-slate-900 text-xl font-black tracking-tighter leading-none uppercase">
                    <span className="text-blue">Monturas</span>
                  </span>
                </div>
              </div>

              <div className="flex-1 relative">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${loading ? "text-blue animate-spin" : "text-slate-400"}`}
                  size={20}
                />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={busqueda}
                  onChange={handleInputChange}
                  // onKeyDown={handleScan}
                  placeholder={
                    loading ? "BUSCANDO..." : "Buscar por nombre, código, marca, etc..."
                  }
                  className="w-full py-4 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 text-blue font-bold text-lg focus:border-blue focus:bg-white transition-all outline-none"
                />
                {/* Listado de autocompletado */}
                {showList && opciones && opciones.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-xl shadow-lg border border-slate-100 max-h-64 overflow-y-auto z-[60]">
                    {opciones.map((opt) => (
                      <li
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.codigo || opt.codigoMontura)}
                        className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Miniatura de la Montura */}
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 relative">
                            <Glasses size={20} strokeWidth={2} className="text-slate-400" />
                            {opt.imagenUrl && (
                              <img
                                src={opt.imagenUrl}
                                alt={opt.marca}
                                className="absolute inset-0 w-full h-full object-cover bg-white"
                              />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-dark text-sm leading-tight truncate">{opt.marca}</span>
                            <span className="text-xs text-slate-500 font-mono">{opt.codigo || opt.codigoMontura}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue bg-blue/10 px-2 py-1 rounded-lg shrink-0">
                          Stock en Sede: {opt.producto?.cantidad || 0}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <BaseButton
                fullWidth={false}
                onClick={() => setIsModalOpen(true)}
              >
                Finalizar
              </BaseButton>
              <BaseButton
                variant="secondary"
                fullWidth={false}
                onClick={() => setOpenModalOutdated(true)}
              >
                Por Actualizar
              </BaseButton>
              <BaseButton
                fullWidth={false}
                onClick={descargarReporteExcel}
              >
                Reporte
              </BaseButton>
            </header>
          </div>

          {/* TABLAS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[
              lote.slice(0, Math.ceil(lote.length / 2)),
              lote.slice(Math.ceil(lote.length / 2)),
            ].map((col, cIdx) => (
              <div
                key={cIdx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-black text-blue uppercase tracking-widest">
                      <th className="py-4 px-6 w-12 text-center">#</th>
                      <th className="py-4 px-6">MONTURA / MODELO</th>
                      <th className="py-4 px-6 text-center">ID MONTURA</th>
                      <th className="py-4 px-6 text-center">STOCK ACTUAL</th>
                      <th className="py-4 px-6 text-center">NUEVO STOCK</th>
                      <th className="py-4 px-3 text-center w-12">Acción</th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {col.map((item, i) => {
                      const stockId = String(item.stock.id);
                      const isSelected = item.stock.id === boxItem?.stock?.id;
                      return (
                        <tr
                          key={stockId}
                          className={`transition-colors ${isSelected ? "bg-blue-light-6" : "hover:bg-slate-50"}`}
                        >
                          {/* N° correlativo */}
                          <td className="py-3 px-6 text-[10px] font-bold text-slate-300 text-center">
                            {cIdx === 0
                              ? i + 1
                              : Math.ceil(lote.length / 2) + i + 1}
                          </td>

                          {/* Montura / Modelo */}
                          <td className="py-3 px-6">
                            <p
                              className={`font-bold text-sm uppercase ${isSelected ? "text-blue" : "text-slate-800"}`}
                            >
                              {item.montura.marca} {item.montura.codigo}
                            </p>
                            <p className="text-[9px] font-mo  font-bold text-slate-400 uppercase leading-none">
                              {item.montura.codigoQr}
                            </p>
                          </td>

                          {/* ID montura */}
                          <td className="py-3 px-6 text-center">
                            <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                              {item.montura.id}
                            </span>
                          </td>

                          {/* Stock actual */}
                          <td className="py-3 px-6 text-center text-sm font-bold text-slate-500">
                            {item.stock.cantidad}
                          </td>

                          {/* Nuevo stock */}
                          <td className="py-3 px-6 text-center">
                            <input
                              type="text"
                              value={dictStocks[stockId] || ""}
                              onChange={(e) =>
                                updateManual(stockId, e.target.value)
                              }
                              className={`w-12 py-1.5 border-2 rounded-lg text-center font-black text-sm ${isSelected ? "border-blue text-blue bg-white" : "border-slate-100 text-slate-400 bg-slate-50"}`}
                            />
                          </td>
                          {/* Accion eliminar */}
                          <td className="py-3 px-3 text-center">
                            <td className="p-4 text-center">
                              <BaseButtonIcon
                                type="button"
                                variant="danger"
                                onClick={() => eliminarFila(stockId)}
                              >
                                <Trash2 size={16} />
                              </BaseButtonIcon>
                            </td>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL DE FINALIZACIÓN */}
        {isModalOpen && (
          <ModalFrameWrapper size="lg">
            <div className="pt-4 pb-16">
              {/* Cabecera */}
              <header className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 bg-yellow-light-4 rounded-2xl flex items-center justify-center mb-3 rotate-3 shadow-sm border border-yellow-light-2">
                  <PackageSearch
                    className="w-7 h-7 text-yellow-dark"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">
                  Confirmar <span className="text-blue">Inventario</span>
                </h3>
              </header>

              {/* Listado de Productos Modificados */}
              <div className="mv-table-container max-h-[60vh] overflow-y-auto overflow-x-hidden">
                <div className="mv-scroll-area">
                  {productosModificados.length > 0 ? (
                    <table className="mv-table w-full">
                      <thead>
                        <tr>
                          <th className="mv-th !py-1.5 !px-3 text-left w-[28%]">Producto</th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[14%]">ID Montura</th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[16%]">Código</th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[16%]">Código Montura</th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[13%]">Stock Actual</th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[13%]">Nuevo Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-light-6">
                        {productosModificados.map((p) => (
                          <tr key={p.stock.id} className="mv-tr">
                            {/* Producto */}
                            <td className="mv-td !py-1 !px-3">
                              <span className="mv-text-main text-[11px] text-slate-700 block line-clamp-1">
                                {p.montura.marca}
                              </span>
                            </td>

                            {/* ID montura */}
                            <td className="mv-td !py-1 !px-1 text-center">
                              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                                {p.montura.id}
                              </span>
                            </td>

                            {/* Codigo de montura */}
                            <td className="mv-td !py-1 !px-1 text-center">
                              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                                {p.montura.codigo}
                              </span>
                            </td>

                            {/* Codigo de montura */}
                            <td className="mv-td !py-1 !px-1 text-center">
                              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                                {p.montura.codigoQr}
                              </span>
                            </td>

                            {/* Stock actual */}
                            <td className="mv-td !py-1 !px-1 text-center">
                              <span className="font-mono text-[11px] font-bold text-slate-500">
                                {p.stock.cantidad}
                              </span>
                            </td>

                            {/* Nuevo stock */}
                            <td className="mv-td !py-1 !px-1 text-center">
                              <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-blue text-white font-black text-[10px]">
                                {dictStocks[String(p.stock.id)]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-slate-500 font-black text-[10px] uppercase tracking-tighter">
                        Sin cambios detectados
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones del Footer */}
              <footer className="mt-6 grid grid-cols-2 gap-4">
                <BaseButton
                  variant="cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </BaseButton>
                <BaseButton
                  onClick={guardarInventario}
                  disabled={productosModificados.length === 0}
                >
                  Guardar
                </BaseButton>
              </footer>
            </div>
          </ModalFrameWrapper>
        )}
      </section>
      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />

      <ModalPorActualizar
        isOpenModalOutdated={isOpenModalOutdated}
        onCloseModalOutdated={() => setOpenModalOutdated(false)}
      />
    </>
  );
}
