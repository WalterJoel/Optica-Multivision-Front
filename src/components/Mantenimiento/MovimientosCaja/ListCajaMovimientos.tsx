"use client";

import { useEffect, useState, useMemo } from "react";
import { useMovimientosCaja } from "@/hooks/caja-movimiento";
import { IMovimientosCaja, TipoMovimiento } from "@/types/caja-movimiento";
import EditCajaMovimientoModal from "./EditCajaMovimientoModal";
import { Edit3, Search, TrendingUp, TrendingDown, Calendar, CreditCard } from "lucide-react";
import { LoadingModal } from "@/components/Common/modal";
import { useSessionUser } from "@/hooks/session";

export default function ListCajaMovimientos() {
  const { sedeId } = useSessionUser();
  const { movimientos, loading, getMovimientosCaja } = useMovimientosCaja();

  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IMovimientosCaja | null>(null);

  useEffect(() => {
    if (sedeId) {
      getMovimientosCaja(sedeId);
    }
  }, [sedeId]);

  const openEditModal = (item: IMovimientosCaja) => {
    setSelected(item);
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setSelected(null);
  };

  const filteredMovimientos = useMemo(() => {
    let result = movimientos;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((item) => {
        const descripcion = (item.descripcion || "").toLowerCase();
        const tipo = (item.tipo || "").toLowerCase();
        const metodoPago = (item.metodoPago || "").toLowerCase();
        return (
          descripcion.includes(term) ||
          tipo.includes(term) ||
          metodoPago.includes(term)
        );
      });
    }

    return result;
  }, [movimientos, searchTerm]);

  return (
    <>
      <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">
          <p className="font-black text-dark uppercase text-xs tracking-wider">
            Listado de Movimientos de Caja
          </p>

          {/* Buscador */}
          <div className="flex items-center bg-beige-dark/40 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
            <Search size={16} className="text-blue-light-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descripción, tipo, método..."
              className="bg-transparent text-sm ml-2.5 outline-none w-72 text-dark-3 font-semibold placeholder:text-gray-5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-spacing-0">
            <thead>
              <tr className="bg-beige backdrop-blur-sm">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  ID / Tipo
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Método de Pago
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Descripción
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Fecha
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Monto
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-4 divide-beige">
              {filteredMovimientos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                  >
                    {searchTerm.trim() !== ""
                      ? "No se encontraron movimientos para tu búsqueda"
                      : "No hay movimientos registrados"}
                  </td>
                </tr>
              ) : (
                filteredMovimientos.map((item) => {
                  const isIngreso = item.tipo === TipoMovimiento.INGRESO;
                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-white transition-all duration-300"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 flex items-center justify-center rounded-xl shadow-sm group-hover:scale-110 transition-transform ${
                              isIngreso
                                ? "bg-green-100/60 text-green-600"
                                : "bg-red-100/60 text-red-600"
                            }`}
                          >
                            {isIngreso ? (
                              <TrendingUp size={20} strokeWidth={2.5} />
                            ) : (
                              <TrendingDown size={20} strokeWidth={2.5} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-black uppercase text-xs tracking-tight ${isIngreso ? "text-green-700" : "text-red-700"}`}>
                              {item.tipo}
                            </span>
                            <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                              ID: #{item.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-blue-light-2" />
                          <span className="font-semibold text-dark-2 text-xs uppercase tracking-wider">
                            {item.metodoPago}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-dark-2">
                        <span
                          className="truncate block max-w-[280px] font-medium text-xs leading-relaxed"
                          title={item.descripcion}
                        >
                          {item.descripcion || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-dark-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar size={14} className="text-gray-4" />
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString("es-PE", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`font-black text-sm ${
                            isIngreso ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isIngreso ? "+" : "-"} S/ {Number(item.monto).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark"
                            title="Editar Movimiento"
                          >
                            <Edit3 size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditCajaMovimientoModal
        isOpen={openEdit}
        movimiento={selected}
        onClose={closeEditModal}
        onRefresh={() => getMovimientosCaja(sedeId)}
      />

      <LoadingModal isOpen={loading} />
    </>
  );
}
