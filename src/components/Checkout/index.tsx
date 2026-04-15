"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { useSearchEyeglassByQr } from "@/hooks/products/eyeglasses/useSearchEyeGlassByQr";
import { useUpdateStockProductos } from "@/hooks/products/stock/useUpdateStockProductos";
import { IEyeglassQrResponse, IUpdateStockProductos } from "@/types/products";
import {
  StatusModal,
  LoadingModal,
  ModalFrameWrapper,
} from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { BaseButton } from "../Common/Buttons";

// Modales
import { OutdatedProductsModal } from "./OutdatedProductsModal";

export default function InventarioMultivision() {
  const [busqueda, setBusqueda] = useState("");
  const [lote, setLote] = useState<IEyeglassQrResponse[]>([]);
  const [boxItem, setBoxItem] = useState<IEyeglassQrResponse | null>(null);
  const [contador, setContador] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  //Modales
  const [isOpenModalOutdated, setOpenModalOutdated] = useState<boolean>(false);

  const [dictStocks, setDictStocks] = useState<{ [key: string]: string }>({});

  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { eyeglass, searchEyeglassByQr } = useSearchEyeglassByQr();
  const { loading, statusMessage, success, updateStockProductos } =
    useUpdateStockProductos();

  const procesarProductoEncontrado = (data: IEyeglassQrResponse) => {
    const stockId = String(data.stock.id);
    const existeEnLote = lote.find((item) => item.stock.id === data.stock.id);

    if (existeEnLote) {
      const valorActual = dictStocks[stockId] || "0";
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

  // --- MEJORA DE VELOCIDAD AQUÍ ---
  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    // Captura directa para evitar el lag del estado asíncrono
    const codigo = e.currentTarget.value.trim();
    if (!codigo) return;

    searchEyeglassByQr(codigo, 1);

    // Limpieza inmediata para el siguiente escaneo
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

  const guardarInventario = async () => {
    const payload: IUpdateStockProductos = {
      items: productosModificados.map((p) => ({
        stockId: p.stock.id,
        cantidad: Number(dictStocks[String(p.stock.id)]),
      })),
    };
    await updateStockProductos(payload);
    setIsModalOpen(false);
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
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <>
      <section className="overflow-hidden pt-[200px] pb-20 bg-gray-2 min-h-screen">
        <div className="max-w-[1740px] w-full mx-auto px-4 sm:px-8 xl:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="sticky top-0 z-40 bg-[#F8FAFC] pb-4">
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
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={handleScan}
                    // disabled={loading} <-- Removido para permitir ráfagas de escaneo
                    placeholder={
                      loading ? "BUSCANDO..." : "ESCANEE CÓDIGO DE QR ..."
                    }
                    className="w-full py-4 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 text-blue font-bold text-lg focus:border-blue focus:bg-white transition-all outline-none"
                  />
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
              </header>

              {/* BOX ITEM ACTUAL */}
              <div
                className={`transition-all duration-300 overflow-hidden ${boxItem ? "mt-4 opacity-100 max-h-24" : "opacity-0 max-h-0"}`}
              >
                <div className="mx-auto max-w-2xl grid grid-cols-[80px_1fr_120px] bg-blue border border-blue-dark rounded-xl p-2 items-center gap-3 shadow-lg shadow-blue/20">
                  <div className="flex justify-center text-4xl">👓</div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h2 className="text-white font-black text-2xl uppercase tracking-tighter leading-none truncate">
                      {boxItem?.montura?.marca}
                    </h2>
                    <p className="text-blue-light-5 font-bold font-mono text-[10px] uppercase mt-0.5">
                      MODELO: {boxItem?.montura?.codigo}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-white/20 pl-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={dictStocks[String(boxItem?.stock?.id)] || ""}
                        onChange={(e) =>
                          updateManual(
                            String(boxItem?.stock?.id),
                            e.target.value,
                          )
                        }
                        className="w-20 py-1 border-2 border-white rounded-lg text-center font-black text-3xl text-blue outline-none bg-white"
                      />
                      <div className="absolute -right-2 -top-2 bg-white text-blue rounded-full p-0.5 shadow-md">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                    </div>
                    <p className="text-[8px] font-black text-white uppercase mt-1 tracking-tighter">
                      NUEVO STOCK
                    </p>
                  </div>
                </div>
              </div>
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
                        <th className="py-4 px-6 text-center">STOCK SISTEMA</th>
                        <th className="py-4 px-6 text-center">NUEVO STOCK</th>
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
                            <td className="py-3 px-6 text-[10px] font-bold text-slate-300 text-center">
                              {cIdx === 0
                                ? i + 1
                                : Math.ceil(lote.length / 2) + i + 1}
                            </td>
                            <td className="py-3 px-6">
                              <p
                                className={`font-bold text-sm uppercase ${isSelected ? "text-blue" : "text-slate-800"}`}
                              >
                                {item.montura.marca} {item.montura.codigo}
                              </p>
                              <p className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none">
                                {item.montura.codigoQr}
                              </p>
                            </td>
                            <td className="py-3 px-6 text-center text-sm font-bold text-slate-500">
                              {item.stock.cantidad}
                            </td>
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
          {/* MODAL DE FINALIZACIÓN */}
          {isModalOpen && (
            <ModalFrameWrapper size="md">
              <div className="pt-4 pb-8">
                {/* Cabecera unificada */}
                <header className="flex flex-col items-center text-center mb-6">
                  <div className="w-14 h-14 bg-blue-light-6 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-light-5">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                    Confirmar <span className="text-blue">Inventario</span>
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Revise los cambios antes de guardar
                  </p>
                </header>

                {/* Contenedor de Tabla con clases de style.css */}
                <div className="mv-table-container my-6">
                  <div className="mv-table-scroll max-h-60">
                    {productosModificados.length > 0 ? (
                      <table className="mv-table">
                        <thead className="mv-thead">
                          <tr>
                            <th className="mv-th">Modelo / Marca</th>
                            <th className="mv-th">Código</th>
                            <th className="mv-th text-center">Nuevo Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productosModificados.map((p) => (
                            <tr key={p.stock.id} className="mv-tr">
                              <td className="mv-td">
                                <span className="mv-text-main text-slate-700">
                                  {p.montura.marca}
                                </span>
                              </td>
                              <td className="mv-td">
                                <span className="font-mono text-[10px] font-bold text-slate-500">
                                  {p.montura.codigo}
                                </span>
                              </td>
                              <td className="mv-td text-center">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue text-white font-black text-[10px]">
                                  {dictStocks[String(p.stock.id)]}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                          Sin cambios detectados
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones del Footer */}
                <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
            </ModalFrameWrapper>
          )}
        </div>
      </section>
      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
      <OutdatedProductsModal
        isOpenModalOutdated={isOpenModalOutdated}
        onCloseModalOutdated={() => setOpenModalOutdated(false)}
      />
    </>
  );
}
