"use client";

import { useEffect, useState, useMemo } from "react";
import { useKits, useUpdateKitStatus } from "@/hooks/kits";
import { IKit } from "@/types/kits";
import EditKitModal from "./EditKitModal";
import { Edit3, Power, Search, Briefcase } from "lucide-react";
import { StatusModal, LoadingModal, ConfirmModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

export default function ListKit() {
  const { kits, loading, getAllKits } = useKits();
  const {
    updateKitStatus,
    loading: toggling,
    success: toggleSuccess,
    statusMessage: toggleMsg,
  } = useUpdateKitStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IKit | null>(null);

  // Status toggle state
  const [targetKit, setTargetKit] = useState<IKit | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    getAllKits();
  }, []);

  const openEditModal = (item: IKit) => {
    setSelected(item);
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setSelected(null);
  };

  const onToggleClick = (item: IKit) => {
    setTargetKit(item);
  };

  const handleConfirmToggle = async () => {
    if (targetKit) {
      await updateKitStatus(targetKit.id, false);
      setTargetKit(null);
    }
  };

  useEffect(() => {
    if (!toggling && (toggleSuccess || toggleMsg)) {
      setTypeModal(
        toggleSuccess ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL
      );
      setModalMsg(toggleMsg);
      setOpenModal(true);
      if (toggleSuccess) {
        getAllKits();
      }
    }
  }, [toggling, toggleSuccess, toggleMsg]);

  const filteredKits = useMemo(() => {
    let result = kits;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((item) => {
        const nombre = (item.nombre || "").toLowerCase();
        const descripcion = (item.descripcion || "").toLowerCase();
        return (
          nombre.includes(term) ||
          descripcion.includes(term)
        );
      });
    }

    return result;
  }, [kits, searchTerm]);

  const busy = loading || toggling;

  return (
    <>
      <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">
          <p className="font-black text-dark uppercase text-xs tracking-wider">
            Lista de Kits
          </p>

          {/* Buscador */}
          <div className="flex items-center bg-beige-dark/40 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
            <Search size={16} className="text-blue-light-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="bg-transparent text-sm ml-2.5 outline-none w-72 text-dark-3 font-semibold placeholder:text-gray-5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-spacing-0">
            <thead>
              <tr className="bg-beige backdrop-blur-sm">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Nombre / ID
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Descripción
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Accesorios Incluidos
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-center">
                  Estado
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Precio Venta
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-4 divide-beige">
              {filteredKits.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                  >
                    {searchTerm.trim() !== ""
                      ? "No se encontraron kits para tu búsqueda"
                      : "No hay kits registrados"}
                  </td>
                </tr>
              ) : (
                filteredKits.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-white transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-blue-light/20 rounded-xl text-blue shadow-sm group-hover:scale-110 transition-transform">
                          <Briefcase size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-dark uppercase text-xs tracking-tight">
                            {item.nombre}
                          </span>
                          <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                            ID: #{item.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-dark-2">
                      <span
                        className="truncate block max-w-[220px] font-medium text-xs leading-relaxed"
                        title={item.descripcion}
                      >
                        {item.descripcion || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-dark-2">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {item.accesorios && item.accesorios.length > 0 ? (
                          item.accesorios.map((a) => (
                            <span
                              key={a.id}
                              className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm bg-blue-light/10 text-blue border-blue-light/20 leading-none"
                            >
                              {a.accesorio?.nombre} (x{a.cantidad})
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Sin accesorios
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] leading-none ${item.activo
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                      >
                        {item.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-dark text-sm">
                      S/ {Number(item.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark"
                          title="Editar Kit"
                        >
                          <Edit3 size={16} strokeWidth={3} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleClick(item)}
                          className="p-2.5 rounded-xl bg-white border border-red-light-4 text-red hover:bg-red hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                          title="Desactivar Kit"
                        >
                          <Power size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditKitModal
        isOpen={openEdit}
        kit={selected}
        onClose={closeEditModal}
        onRefresh={getAllKits}
      />

      <ConfirmModal
        isOpen={targetKit !== null}
        onClose={() => setTargetKit(null)}
        onConfirm={handleConfirmToggle}
        title="¿Desactivar Kit?"
        message="Esta acción desactivará este kit de tu inventario. ¿Estás seguro?"
        confirmText="Desactivar"
        cancelText="Cancelar"
        loading={toggling}
        variant="warning"
      />

      <LoadingModal isOpen={busy} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={modalMsg}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
