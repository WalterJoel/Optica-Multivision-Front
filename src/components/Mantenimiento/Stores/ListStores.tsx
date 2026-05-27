"use client";

import { useEffect, useState, useCallback } from "react";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import EditStoreModal from "./EditStoreModal";
import { useToggleStoreStatus } from "@/hooks/stores/useToggleStoreStatus";
import { IStore } from "@/types/stores";
import { Edit3, Power, Store, Phone } from "lucide-react";
import { useStores } from "@/hooks/stores";

export default function ListStores() {
  const { sedes, loading, getAllStores } = useStores();
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IStore | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  const {
    updateToggleStatus,
    loading: toggling,
    success: toggleOk,
    statusMessage: updateToggleMessage,
  } = useToggleStoreStatus();

  //Functions
  const onEdit = (s: IStore) => {
    setSelected(s);
    setOpenEdit(true);
  };

  const onToggle = async (s: IStore) => {
    await updateToggleStatus(s.id, !s.activo);
  };

  //Show Loading Modal
  const busy = loading || toggling;

  //Use Effects
  useEffect(() => {
    if (!toggling && (toggleOk || updateToggleMessage)) {
      setTypeModal(
        toggleOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setModalMsg(updateToggleMessage);
      setOpenModal(true);
      if (toggleOk) getAllStores();
    }
  }, [toggling, toggleOk, updateToggleMessage, getAllStores]);

  return (
    <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-spacing-0">
          <thead>
            <tr className="bg-beige backdrop-blur-sm">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Nombre
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Dirección
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                RUC
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Contacto
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
            {sedes.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                >
                  No se encontraron sedes activas
                </td>
              </tr>
            ) : (
              sedes.map((s) => (
                <tr
                  key={s.id}
                  className="group hover:bg-white  transition-all duration-300"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center bg-blue-light/20 rounded-xl text-blue shadow-sm group-hover:scale-110 transition-transform">
                        <Store size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-dark uppercase text-xs tracking-tight">
                          {s.nombre}
                        </span>
                        <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                          IDENTIFICADOR: {s.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5  text-dark-2">{s.direccion}</td>
                  <td className="px-6 py-5  text-dark-2">{s.ruc}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-dark-3 text-xs ">
                      <Phone size={14} className="text-yellow-dark" />
                      {s.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                          s.activo
                            ? "bg-green-light-6 text-green-dark border-green-light-5"
                            : "bg-red-light-6 text-red-dark border-red-light-5"
                        }`}
                      >
                        {s.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => onEdit(s)}
                        className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark"
                        title="Editar Configuración"
                      >
                        <Edit3 size={16} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggle(s)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                          s.activo
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

      <EditStoreModal
        isOpen={openEdit}
        store={selected}
        onClose={() => setOpenEdit(false)}
        onRefresh={getAllStores}
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
