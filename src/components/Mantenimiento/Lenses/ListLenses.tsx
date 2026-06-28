"use client";

import { useEffect, useState, useMemo } from "react";
import { StatusModal, LoadingModal, ConfirmModal } from "@/components/Common/modal";
import { STATUS_MODAL, PrioridadLentes } from "@/commons/constants";
import EditLensModal from "./EditLensModal";
import { ClassificationBadge } from "@/components/Common/ClassificationBadge";
import { ImageWithZoom } from "@/components/Common/ImageWithZoom";
import { ILens } from "@/types/products";
import { Edit3, Power, Eye, Search } from "lucide-react";
import { useLenses } from "@/hooks/products";
import { useUpdateLens } from "@/hooks/products/lens/useUpdateLens";
import { useKits } from "@/hooks/kits";

export default function ListLenses() {
  // Hooks
  const { lenses, loading, getAllLenses } = useLenses();
  const { kits, getAllKits } = useKits();
  const {
    updateLens,
    loading: updating,
    success: updateOk,
    statusMessage: updateMessage,
  } = useUpdateLens();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<ILens | null>(null);
  const [deactivateId, setDeactivateId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  // Load kits for names
  useEffect(() => {
    getAllKits();
  }, []);

  // Memos
  const filteredLenses = useMemo(() => {
    let result = lenses;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((l) => {
        const marca = (l.marca || "").toLowerCase();
        const material = (l.material || "").toLowerCase();
        return marca.includes(term) || material.includes(term);
      });
    }

    return result;
  }, [lenses, searchTerm]);

  // Functions
  const onEdit = (l: ILens) => {
    setSelected(l);
    setOpenEdit(true);
  };

  const onToggle = async (l: ILens) => {
    if (l.activo !== false) {
      setDeactivateId(l.id);
    } else {
      await updateLens(l.id, { activo: true });
    }
  };

  const handleConfirmDeactivate = async () => {
    if (deactivateId) {
      await updateLens(deactivateId, { activo: false });
      setDeactivateId(null);
    }
  };

  // Helper variables
  const busy = loading || updating;

  // Effects
  useEffect(() => {
    if (!updating && (updateOk || updateMessage)) {
      setTypeModal(
        updateOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setModalMsg(updateMessage);
      setOpenModal(true);
      if (updateOk) getAllLenses();
    }
  }, [updating, updateOk, updateMessage]);

  const getKitName = (kitId?: number | null) => {
    if (!kitId) return "Ninguno";
    const kit = kits.find((k) => k.id === kitId);
    return kit ? kit.nombre : `Kit #${kitId}`;
  };

  return (
    <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">
        {/* Buscador */}
        <div className="flex items-center bg-beige-dark/40 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
          <Search size={16} className="text-blue-light-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o material..."
            className="bg-transparent text-sm ml-2.5 outline-none w-72 text-dark-3 font-semibold placeholder:text-gray-5"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-spacing-0">
          <thead>
            <tr className="bg-beige backdrop-blur-sm">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Lente
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Clasificación
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Prioridad
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Material
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Precio Serie 1
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Precio Serie 2
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Precio Serie 3
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Kit Asociado
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-center">
                Estado
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y-4 divide-beige">
            {filteredLenses.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                >
                  {searchTerm.trim() !== ""
                    ? "No se encontraron lentes para tu búsqueda"
                    : "No se encontraron lentes activos"}
                </td>
              </tr>
            ) : (
              filteredLenses.map((l) => (
                <tr
                  key={l.id}
                  className="group hover:bg-white transition-all duration-300"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center bg-blue-light/20 rounded-xl text-blue shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                        <ImageWithZoom
                          src={l.imagenUrl}
                          alt={l.marca}
                          className="h-full w-full rounded-xl"
                          imgClassName="h-full w-full object-cover rounded-xl"
                          fallbackIcon={<Eye size={20} strokeWidth={2.5} />}
                          showFloatingButton={false}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-dark uppercase text-xs tracking-tight">
                          {l.marca}
                        </span>
                        <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                          ID LENTE: {l.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {l.clasificacion ? (
                      <ClassificationBadge text={l.clasificacion} />
                    ) : (
                      <span className="text-[10px] text-dark-5 font-bold uppercase">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {l.prioridad && PrioridadLentes[l.prioridad] ? (
                      <span className="px-2.5 py-1 bg-blue-light/10 text-blue border border-blue-light/20 text-[10px] font-bold rounded-lg uppercase">
                        {PrioridadLentes[l.prioridad].replace("MOSTRAR_", "MOSTRAR ").replace("_", " ")}
                      </span>
                    ) : (
                      <span className="text-[10px] text-dark-5 font-bold uppercase">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-dark-2 uppercase font-medium">{l.material}</td>
                  <td className="px-6 py-5 text-dark-2 font-semibold">S/ {Number(l.precio_serie1).toFixed(2)}</td>
                  <td className="px-6 py-5 text-dark-2 font-semibold">S/ {Number(l.precio_serie2).toFixed(2)}</td>
                  <td className="px-6 py-5 text-dark-2 font-semibold">S/ {Number(l.precio_serie3).toFixed(2)}</td>
                  <td className="px-6 py-5 text-dark-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg uppercase">
                      {getKitName(l.kitId)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${l.activo !== false
                          ? "bg-green-light-6 text-green-dark border-green-light-5"
                          : "bg-red-light-6 text-red-dark border-red-light-5"
                          }`}
                      >
                        {l.activo !== false ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => onEdit(l)}
                        className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark"
                        title="Editar Configuración"
                      >
                        <Edit3 size={16} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggle(l)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm border ${l.activo !== false
                          ? "bg-white border-red-light-4 text-red hover:bg-red hover:text-white"
                          : "bg-white border-green-light-4 text-green hover:bg-green hover:text-white"
                          }`}
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

      <EditLensModal
        isOpen={openEdit}
        lens={selected}
        onClose={() => setOpenEdit(false)}
        onRefresh={getAllLenses}
      />

      <ConfirmModal
        isOpen={deactivateId !== null}
        onClose={() => setDeactivateId(null)}
        onConfirm={handleConfirmDeactivate}
        title="¿Desactivar Lente?"
        message="Esta acción desactivará este lente de tu inventario. ¿Estás seguro?"
        confirmText="Desactivar"
        cancelText="Cancelar"
        loading={updating}
        variant="warning"
      />

      <LoadingModal isOpen={busy} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={modalMsg}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
