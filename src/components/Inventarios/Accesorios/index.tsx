"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, PackageSearch } from "lucide-react";
import { useUpdateStockProductos } from "@/hooks/products/stock/useUpdateStockProductos";
import { IObtenerAccesorioResponse, IUpdateStockProductos } from "@/types/products";
import {
  StatusModal,
  LoadingModal,
  ModalFrameWrapper,
} from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { useSessionUser } from "@/hooks/session";

// Modales y botones
import { OutdatedProductsModal } from "./ModalPorActualizar";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import {
  useSearchAccesory,
  useObtenerAccesorio,
} from "@/hooks/products/accesories";

export default function InventarioAccesorios() {
  const [busqueda, setBusqueda] = useState("");
  const [lote, setLote] = useState<IObtenerAccesorioResponse[]>([]);
  const [contador, setContador] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    open: false,
    type: "",
    message: "",
  });

  // Modal por actualizar
  const [isOpenModalOutdated, setOpenModalOutdated] = useState<boolean>(false);

  // Diccionario de nuevos stocks por stockId
  const [dictStocks, setDictStocks] = useState<{ [key: string]: string }>({});

  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { sedeId } = useSessionUser();
  const {
    loading: loadingAccesorio,
    statusMessage: statusMessageAccesorio,
    obtenerAccesorio,
  } = useObtenerAccesorio();
  const {
    accesories: opciones,
    showList,
    searchAccesories,
    setShowList,
    loading: loadingAutocompletado,
  } = useSearchAccesory();

  const { loading, statusMessage, success, updateStockProductos } =
    useUpdateStockProductos();

  // Agregar o incrementar accesorio en el lote
  const agregarALote = (item: IObtenerAccesorioResponse) => {
    const stockId = String(item.stock.id);
    const existeEnLote = lote.some((p) => p.stock.id === item.stock.id);

    if (existeEnLote) {
      setDictStocks((prev) => {
        const actual = prev[stockId] || "0";
        return { ...prev, [stockId]: String(Number(actual) + 1) };
      });
    } else {
      setLote((prev) => [item, ...prev]);
      setDictStocks((prev) => ({ ...prev, [stockId]: "1" }));
    }

    setContador((c) => c + 1);
    setBusqueda("");
    setShowList(false);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // Al seleccionar una opción del autocompletado: consulta @Get('obtenerAccesorio/:codigo/:sedeId')
  const handleSelectOption = async (codigoOId: string) => {
    setShowList(false);
    setBusqueda("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }

    const data = await obtenerAccesorio(codigoOId, sedeId);
    if (data) {
      agregarALote(data);
    }
  };

  // Al escribir en el input: dispara el autocompletado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusqueda(value);
    searchAccesories(value);
  };

  // Actualización manual de stock en el input de la tabla
  const updateManual = (stockId: string, valor: string) => {
    setDictStocks((prev) => ({ ...prev, [stockId]: valor }));
  };

  // Productos modificados para guardar
  const productosModificados = lote.filter((p) => {
    const stockId = String(p.stock.id);
    const stockNuevo = dictStocks[stockId];
    return stockNuevo !== "" && Number(stockNuevo) !== p.stock.cantidad;
  });

  // Limpiar inventario
  const limpiarTablaInventario = () => {
    setLote([]);
    setDictStocks({});
    setContador(0);
    setBusqueda("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // Guardar cambios en el backend
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

  // Feedback de guardado
  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        limpiarTablaInventario();
      }
      setModalMessage({
        open: true,
        type: success ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
        message: statusMessage,
      });
    }
  }, [loading, success, statusMessage]);

  // Feedback de error al obtener accesorio
  useEffect(() => {
    if (statusMessageAccesorio) {
      setModalMessage({
        open: true,
        type: STATUS_MODAL.ERROR_MODAL,
        message: statusMessageAccesorio,
      });
    }
  }, [statusMessageAccesorio]);

  return (
    <>
      <section className="overflow-hidden pt-[200px] pb-20 bg-beige min-h-screen">
        <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-8 xl:px-10">
          <div className="sticky top-0 z-40 bg-beige pb-4">
            <header className="bg-white p-4 rounded-2xl border border-blue-light-4 shadow-sm flex items-center gap-6">
              {/* Contador */}
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
                    <span className="text-blue">Accesorios</span>
                  </span>
                </div>
              </div>

              {/* Buscador con autocompletado */}
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${loadingAccesorio || loadingAutocompletado ? "text-blue animate-spin" : "text-slate-400"}`}
                  size={20}
                />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={busqueda}
                  onChange={handleInputChange}
                  placeholder={
                    loadingAccesorio
                      ? "Cargando accesorio..."
                      : loadingAutocompletado
                        ? "Buscando..."
                        : "Buscar por nombre, modelo o código..."
                  }
                  className="w-full py-4 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 text-blue font-bold text-lg focus:border-blue focus:bg-white transition-all outline-none"
                />

                {/* Listado de autocompletado */}
                {showList && opciones && opciones.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-xl shadow-lg border border-slate-100 max-h-64 overflow-y-auto z-[60]">
                    {opciones.map((opt) => (
                      <li
                        key={opt.id}
                        onClick={() =>
                          handleSelectOption(
                            String(opt.id)
                          )
                        }
                        className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Miniatura */}
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0 relative">
                            <PackageSearch
                              size={20}
                              strokeWidth={2}
                              className="text-slate-400"
                            />
                            {opt.imagenUrl && (
                              <img
                                src={opt.imagenUrl}
                                alt={opt.nombre}
                                className="absolute inset-0 w-full h-full object-cover bg-white"
                              />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-dark text-sm leading-tight truncate">
                              {opt.nombre}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              {opt.id}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue bg-blue/10 px-2 py-1 rounded-lg shrink-0">
                          Stock en Sede: {opt.producto?.cantidad ?? 0}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Botones de acción */}
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
          </div>

          {/* TABLAS EN 2 COLUMNAS */}
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
                      <th className="py-4 px-6">ACCESORIO / MODELO</th>
                      <th className="py-4 px-6 text-center">ID ACCESORIO</th>
                      <th className="py-4 px-6 text-center">STOCK ACTUAL</th>
                      <th className="py-4 px-6 text-center">NUEVO STOCK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {col.map((item, i) => {
                      const stockId = String(item.stock.id);
                      return (
                        <tr
                          key={stockId}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          {/* N° correlativo */}
                          <td className="py-3 px-6 text-[10px] font-bold text-slate-300 text-center">
                            {cIdx === 0
                              ? i + 1
                              : Math.ceil(lote.length / 2) + i + 1}
                          </td>

                          {/* Accesorio / Modelo */}
                          <td className="py-3 px-6">
                            <p className="font-bold text-sm uppercase text-slate-800">
                              {item.accesorio.nombre}
                            </p>
                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-none">
                              {item.accesorio.codigo}
                            </p>
                          </td>

                          {/* ID Accesorio */}
                          <td className="py-3 px-6 text-center">
                            <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                              {item.accesorio.id}
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
                              className="w-14 py-1.5 border-2 rounded-lg text-center font-black text-sm border-slate-200 text-slate-700 bg-white focus:border-blue focus:text-blue outline-none transition-colors"
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
                          <th className="mv-th !py-1.5 !px-3 text-left w-[36%]">
                            Producto
                          </th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[16%]">
                            ID Accesorio
                          </th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[20%]">
                            Código
                          </th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[14%]">
                            Stock Actual
                          </th>
                          <th className="mv-th !py-1.5 !px-1 text-center w-[14%]">
                            Nuevo Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-light-6">
                        {productosModificados.map((p) => (
                          <tr key={p.stock.id} className="mv-tr">
                            {/* Producto */}
                            <td className="mv-td !py-1 !px-3">
                              <span className="mv-text-main text-[11px] text-slate-700 block line-clamp-1">
                                {p.accesorio.nombre}
                              </span>
                            </td>

                            {/* ID Accesorio */}
                            <td className="mv-td !py-1 !px-1 text-center">
                              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                                {p.accesorio.id}
                              </span>
                            </td>

                            {/* Código de accesorio */}
                            <td className="mv-td !py-1 !px-1 text-center">
                              <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-block whitespace-nowrap">
                                {p.accesorio.codigo}
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
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                        Sin cambios detectados
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones del Footer */}
              <div className="grid grid-cols-2 gap-4 mt-6">
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
      </section>

      <LoadingModal isOpen={loading} />

      <StatusModal
        isOpen={modalMessage.open}
        type={modalMessage.type}
        message={modalMessage.message}
        onClose={() =>
          setModalMessage((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <OutdatedProductsModal
        isOpenModalOutdated={isOpenModalOutdated}
        onCloseModalOutdated={() => setOpenModalOutdated(false)}
      />
    </>
  );
}
