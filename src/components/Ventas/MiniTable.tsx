"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  X,
  Calendar,
  User,
  Package,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Power,
  FileText,
  Pencil,
  DollarSign
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { ModalFrameWrapper, ConfirmModal, StatusModal } from "@/components/Common/modal";
import { IResponseSale } from "@/types/sales";
import { IStore } from "@/types/stores";
import { SaleNotePrint } from "./SaleNotePrint";
import { EditarVentaModal } from "./EditarVentaModal";
import { RegistrarPagoModal } from "./RegistrarPagoModal";
import { useEditarVenta, useRegistrarPago } from "@/hooks/sales";
import { useSessionUser } from "@/hooks/session";
import { STATUS_MODAL } from "@/commons/constants";

export const MiniTable = ({
  titulo,
  data,
  onDelete,
  isDeleting,
  sedes = [],
}: {
  titulo: string;
  data: IResponseSale[];
  onDelete: (id: number) => Promise<any>;
  isDeleting: boolean;
  sedes?: IStore[];
}) => {
  const [selectedSale, setSelectedSale] = useState<IResponseSale | null>(null);
  const [printSale, setPrintSale] = useState<IResponseSale | null>(null);
  const [editSale, setEditSale] = useState<IResponseSale | null>(null);
  const [pagoSale, setPagoSale] = useState<IResponseSale | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editStatusMsg, setEditStatusMsg] = useState("");
  const [editStatusType, setEditStatusType] = useState<string | null>(null);
  const [pagoStatusMsg, setPagoStatusMsg] = useState("");
  const [pagoStatusType, setPagoStatusType] = useState<string | null>(null);
  const itemsPerPage = 8;

  const { editarVenta, loading: isEditing } = useEditarVenta();
  const { registrarPago, loading: isPaying } = useRegistrarPago();
  const { sedeId } = useSessionUser();

  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printSale ? `nota-pedido-${printSale.id}` : "nota-pedido",
    onAfterPrint: () => setPrintSale(null),
  });

  useEffect(() => {
    if (printSale) {
      handlePrint();
    }
  }, [printSale]);

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  // 🔎 Filtrado dinámico
  const filteredData = data.filter((venta) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    const clienteNombre = venta.cliente
      ? venta.cliente.tipoCliente === "EMPRESA"
        ? (venta.cliente.razonSocial || "").toLowerCase()
        : `${venta.cliente.nombres || ""} ${venta.cliente.apellidos || ""}`.toLowerCase()
      : "";
    const clienteDoc = (venta.cliente?.numeroDoc || "").toLowerCase();

    const vendedorNombre = venta.user
      ? `${venta.user.nombre || ""} ${venta.user.apellido || ""}`.toLowerCase()
      : "";

    return (
      venta.id.toString().includes(term) ||
      (venta.metodoPago || "").toLowerCase().includes(term) ||
      (venta.tipoVenta || "").toLowerCase().includes(term) ||
      (venta.estadoPago || "").toLowerCase().includes(term) ||
      venta.userId.toString().includes(term) ||
      clienteNombre.includes(term) ||
      clienteDoc.includes(term) ||
      vendedorNombre.includes(term)
    );
  });

  // 📄 Paginación dinámica
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col relative">
      {/* HEADER */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-2 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-[12px] font-black text-dark-2 uppercase tracking-[2px]">
            {titulo} ({filteredData.length})
          </h3>
        </div>

        <div className="flex items-center bg-beige-dark/40 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-light-3 transition-all">
          <Search size={14} className="text-blue-light-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reiniciar paginación al buscar
            }}
            placeholder="Filtrar ventas..."
            className="bg-transparent text-[11px] ml-2 outline-none w-32 text-dark-3 font-medium placeholder:text-gray-5"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-spacing-0">
          {/* HEAD - Exact style matching ListStores.tsx */}
          <thead>
            <tr className="bg-beige backdrop-blur-sm">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                ID Venta
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Fecha
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Cliente
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Vendedor
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Método Pago
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Tipo Venta
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-center">
                Cuotas
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-center">
                Compromiso Pago.
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-center">
                Estado Pago
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-right">
                Total
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y-4 divide-beige">
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                >
                  No hay ventas registradas
                </td>
              </tr>
            )}

            {paginatedData.map((venta) => {
              const date = new Date(venta.createdAt);
              const total = Number(venta.total);

              // Clases condicionales de estilos para badges visuales premium (estilo ListStores)
              const esCredito = (venta.tipoVenta || "").toUpperCase() === "CREDITO";
              const esPagado = (venta.estadoPago || "").toUpperCase() === "PAGADO";

              return (
                <tr
                  key={venta.id}
                  className="group hover:bg-white transition-all duration-300 text-xs"
                >
                  {/* Venta ID */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 flex items-center justify-center bg-blue-light/10 rounded-xl text-blue font-bold shadow-sm">
                        #{venta.id}
                      </div>
                    </div>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-5 text-dark-2 font-semibold">
                    {date.toLocaleDateString()}
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-dark uppercase text-[11px] tracking-tight">
                        {venta.cliente
                          ? venta.cliente.tipoCliente === "EMPRESA"
                            ? venta.cliente.razonSocial
                            : `${venta.cliente.nombres || ""} ${venta.cliente.apellidos || ""}`.trim()
                          : "Público General"
                        }
                      </span>
                      {venta.cliente && (
                        <span className="text-[10px] text-gray-4 font-mono font-bold mt-0.5">
                          {venta.cliente.numeroDoc}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Vendedor */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 border border-slate-200">
                        <User size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-dark uppercase text-[11px] tracking-tight">
                          {venta.user ? `${venta.user.nombre || ""} ${venta.user.apellido || ""}`.trim() : `Usuario #${venta.userId}`}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Método Pago */}
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm bg-white border-blue-light-5 text-dark-4">
                      <CreditCard size={10} className="text-blue-light" />
                      {venta.metodoPago || "—"}
                    </span>
                  </td>

                  {/* Tipo Venta */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${esCredito
                        ? "bg-blue-light-6 text-blue border-blue-light-5"
                        : "bg-green-light-6 text-green-dark border-green-light-5"
                        }`}
                    >
                      {esCredito ? "A Crédito" : "Al Contado"}
                    </span>
                  </td>

                  {/* Cuotas */}
                  <td className="px-6 py-5 text-center">
                    {venta.nroCuotas ? (
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm bg-blue/10 text-blue border-blue/20">
                        {venta.nroCuotas} cuota{venta.nroCuotas > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-gray-4 font-semibold">—</span>
                    )}
                  </td>

                  {/* Días Compromiso Pago */}
                  <td className="px-6 py-5 text-center">
                    {venta.diasCompromisoPago ? (
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm bg-yellow/10 text-yellow-dark border-yellow-dark/20">
                        {venta.diasCompromisoPago} días
                      </span>
                    ) : (
                      <span className="text-gray-4 font-semibold">—</span>
                    )}
                  </td>

                  {/* Estado Pago */}
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${esPagado
                          ? "bg-green-light-6 text-green-dark border-green-light-5"
                          : "bg-red-light-6 text-red-dark border-red-light-5"
                          }`}
                      >
                        {esPagado ? (
                          <>
                            <CheckCircle size={10} strokeWidth={2.5} />
                            Pagado
                          </>
                        ) : (
                          <>
                            <AlertCircle size={10} strokeWidth={2.5} />
                            Pendiente
                          </>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-5 text-right">
                    <span className="font-black text-[13px] tracking-tight text-blue">
                      S/. {total.toFixed(2)}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedSale(venta)}
                        className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark cursor-pointer flex items-center justify-center"
                        title="Ver Productos"
                      >
                        <Eye size={16} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrintSale(venta)}
                        className="p-2.5 rounded-xl bg-blue text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-blue/20 border border-blue cursor-pointer flex items-center justify-center"
                        title="Nota de Pedido"
                      >
                        <FileText size={16} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditSale(venta)}
                        className="p-2.5 rounded-xl bg-white border border-blue-light-4 text-blue hover:bg-blue hover:text-white cursor-pointer transition-all shadow-sm flex items-center justify-center"
                        title="Editar Venta"
                        disabled={!venta.activo}
                      >
                        <Pencil size={16} strokeWidth={3} />
                      </button>
                      {venta.estadoPago === "PENDIENTE" && venta.activo && (
                        <button
                          type="button"
                          onClick={() => setPagoSale(venta)}
                          className="p-2.5 rounded-xl bg-white border border-green-600/30 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer transition-all shadow-sm flex items-center justify-center"
                          title="Registrar Pago de Cuota"
                        >
                          <DollarSign size={16} strokeWidth={3} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteId(venta.id);
                        }}
                        className={`p-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center ${venta.activo
                          ? "bg-white border-red-light-4 text-red hover:bg-red hover:text-white cursor-pointer"
                          : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                          }`}
                        disabled={!venta.activo}
                        title={venta.activo ? "Anular Venta" : "Venta Anulada"}
                      >
                        <Power size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="px-7 py-4 bg-beige border-t border-gray-2 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-4 uppercase tracking-[2px]">
          Página <span className="text-dark">{String(currentPage).padStart(2, "0")}</span> de {String(totalPages).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg text-blue-light-2 hover:bg-blue-light-6 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MODAL DETALLE DE PRODUCTOS */}
      {selectedSale && (
        <ModalFrameWrapper size="md">
          <div className="pt-2 pb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                    Detalle de Venta
                  </h3>
                  <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                    Comprobante de Venta #{selectedSale.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSale(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-beige/40 rounded-2xl p-3.5 border border-gray-100/50 flex items-center gap-3">
                <Calendar size={16} className="text-blue" />
                <div>
                  <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider leading-none mb-1">Fecha Registro</span>
                  <span className="text-xs font-bold text-dark-3">
                    {new Date(selectedSale.createdAt).toLocaleDateString()} a las {new Date(selectedSale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="bg-beige/40 rounded-2xl p-3.5 border border-gray-100/50 flex items-center gap-3">
                <User size={16} className="text-blue" />
                <div>
                  <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider leading-none mb-1">Vendedor</span>
                  <span className="text-xs font-bold text-dark-3 truncate block max-w-[150px]" title={selectedSale.user ? `${selectedSale.user.nombre || ""} ${selectedSale.user.apellido || ""}`.trim() : `Usuario #${selectedSale.userId}`}>
                    {selectedSale.user ? `${selectedSale.user.nombre || ""} ${selectedSale.user.apellido || ""}`.trim() : `Usuario #${selectedSale.userId}`}
                  </span>
                </div>
              </div>

              <div className="bg-beige/40 rounded-2xl p-3.5 border border-gray-100/50 flex items-center gap-3">
                <User size={16} className="text-blue" />
                <div>
                  <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider leading-none mb-1">Cliente</span>
                  <span className="text-xs font-bold text-dark-3 truncate block max-w-[150px]" title={selectedSale.cliente ? (selectedSale.cliente.tipoCliente === "EMPRESA" ? selectedSale.cliente.razonSocial : `${selectedSale.cliente.nombres || ""} ${selectedSale.cliente.apellidos || ""}`.trim()) : "Público General"}>
                    {selectedSale.cliente
                      ? selectedSale.cliente.tipoCliente === "EMPRESA"
                        ? selectedSale.cliente.razonSocial
                        : `${selectedSale.cliente.nombres || ""} ${selectedSale.cliente.apellidos || ""}`.trim()
                      : "Público General"
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Product list section title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
              <h4 className="text-[9px] font-black text-blue uppercase tracking-widest">
                Productos Vendidos ({selectedSale.productos.length})
              </h4>
            </div>

            {/* Product Table Container */}
            <div className="bg-beige/40 border border-gray-1 border-dashed rounded-2xl overflow-x-auto overflow-y-auto mb-6 max-h-64">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-beige/80 text-[9px] font-black text-blue uppercase tracking-widest border-b border-gray-1">
                    <th className="px-4 py-3">Cód.</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Detalle</th>
                    <th className="px-4 py-3 text-center">Cant</th>
                    <th className="px-4 py-3 text-right">Unitario</th>
                    <th className="px-4 py-3 text-right">Desc.</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-1 bg-white/20">
                  {selectedSale.productos.map((prod: any) => {
                    const price = Number(prod.precioUnitario);
                    const quantity = Number(prod.cantidad);
                    const discount = Number(prod.descuento || 0);
                    const subtotal = price * quantity - discount;

                    return (
                      <tr key={prod.id} className="hover:bg-white/50 transition-colors">
                        {/* Código */}
                        <td className="px-4 py-3 font-bold text-gray-5">
                          #{prod.productoId || prod.stockId}
                        </td>
                        {/* Tipo */}
                        <td className="px-4 py-3">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 rounded px-1.5 py-0.5 border border-slate-200/50">
                            {prod.tipoProducto}
                          </span>
                        </td>
                        {/* Producto / Detalle */}
                        <td className="px-4 py-3 font-semibold">
                          <span className="font-black text-dark block leading-tight">
                            {prod.stock?.lente ? (
                              `${prod.stock.lente.marca} (${prod.stock.lente.material})`
                            ) : prod.producto?.montura ? (
                              <div>
                                <div>{prod.producto.nombre} - {prod.producto.montura.marca} ({prod.producto.montura.material})</div>
                                <div className="text-[9px] font-bold text-gray-500 mt-1 flex gap-2">
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Código: {prod.producto.montura.codigo || "—"}</span>
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Cód. Montura: {prod.producto.montura.codigoMontura || "—"}</span>
                                </div>
                              </div>
                            ) : (
                              prod.producto?.nombre || ""
                            )}
                          </span>
                          {/* Mostrar datos refractivos si existen y no son nulos */}
                          {(prod.esf || prod.cyl) && (
                            <span className="inline-block mt-1 text-[9px] font-bold font-mono text-yellow-dark bg-yellow/10 border border-yellow-dark/20 rounded px-1.5 py-0.5 mr-1.5">
                              {prod.esf ? `ESF: ${Number(prod.esf) > 0 ? `+${prod.esf}` : prod.esf}` : ""}
                              {prod.esf && prod.cyl ? " | " : ""}
                              {prod.cyl ? `CYL: ${Number(prod.cyl) > 0 ? `+${prod.cyl}` : prod.cyl}` : ""}
                            </span>
                          )}

                        </td>
                        <td className="px-4 py-3 text-center font-black text-dark">
                          {quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-dark-2">
                          S/. {price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-red">
                          {discount > 0 ? `-S/. ${discount.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-blue">
                          S/. {subtotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col gap-2 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Monto Pagado:</span>
                <span className="font-bold text-slate-700">S/. {Number(selectedSale.montoPagado).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Deuda Pendiente:</span>
                <span className={`font-black ${Number(selectedSale.deuda) > 0 ? "text-red" : "text-slate-700"}`}>
                  S/. {Number(selectedSale.deuda).toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-slate-200/60 my-1" />
              <div className="flex justify-between items-center text-sm">
                <span className="font-black text-blue uppercase tracking-widest text-[11px]">Total de Venta:</span>
                <span className="font-black text-blue text-base">S/. {Number(selectedSale.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Closing Button */}
            <button
              onClick={() => setSelectedSale(null)}
              className="w-full py-3.5 bg-blue hover:bg-blue-dark text-white rounded-2xl font-black uppercase text-[11px] tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              Cerrar Detalle
            </button>
          </div>
        </ModalFrameWrapper>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="¿Anular Venta?"
        message="Esta acción anulará la venta seleccionada de forma permanente. ¿Estás seguro de continuar?"
        confirmText="Anular Venta"
        cancelText="Cancelar"
        loading={isDeleting}
        variant="danger"
      />

      {/* Contenedor oculto para impresión directa de Nota de Pedido */}
      {printSale && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
          }}
        >
          <div ref={printRef}>
            <SaleNotePrint
              venta={printSale}
              sede={sedes.find((s) => s.id === printSale.sedeId)}
            />
          </div>
        </div>
      )}

      {/* MODAL EDITAR VENTA */}
      {editSale && (
        <EditarVentaModal
          venta={editSale}
          loading={isEditing}
          onClose={() => setEditSale(null)}
          onSave={async (id, payload) => {
            const result = await editarVenta(id, payload);
            if (result) {
              setEditStatusMsg("Venta editada correctamente");
              setEditStatusType(STATUS_MODAL.SUCCESS_MODAL);
              setEditSale(null);
            } else {
              setEditStatusMsg("Error al editar la venta");
              setEditStatusType(STATUS_MODAL.ERROR_MODAL);
            }
          }}
        />
      )}

      {/* STATUS EDICIÓN */}
      {editStatusType !== null && (
        <StatusModal
          isOpen={editStatusType !== null}
          type={editStatusType}
          onClose={() => setEditStatusType(null)}
          message={editStatusMsg}
        />
      )}

      {/* MODAL REGISTRAR PAGO */}
      {pagoSale && (
        <RegistrarPagoModal
          venta={pagoSale}
          sedeId={sedeId}
          loading={isPaying}
          onClose={() => setPagoSale(null)}
          onSave={async (id, payload) => {
            const result = await registrarPago(id, payload);
            if (result) {
              setPagoStatusMsg(result.message);
              setPagoStatusType(STATUS_MODAL.SUCCESS_MODAL);
              setPagoSale(null);
            } else {
              setPagoStatusMsg("Error al registrar el pago");
              setPagoStatusType(STATUS_MODAL.ERROR_MODAL);
            }
          }}
        />
      )}

      {/* STATUS PAGO */}
      {pagoStatusType !== null && (
        <StatusModal
          isOpen={pagoStatusType !== null}
          type={pagoStatusType}
          onClose={() => setPagoStatusType(null)}
          message={pagoStatusMsg}
        />
      )}
    </div>
  );
};
