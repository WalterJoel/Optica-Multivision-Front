"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import EditStoreModal from "./EditStoreModal";
import { useUpdateStore } from "@/hooks/stores/useUpdateStore";
import { useToggleStoreStatus } from "@/hooks/stores/useToggleStoreStatus";
import { IStore } from "@/types/stores";

export default function ListStores() {
  const [sedes, setSedes] = useState<IStore[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const { updateStore, loading: updating, success: upOk, statusMessage: upMsg } = useUpdateStore();
  const { toggleStatus, loading: toggling, success: tgOk, statusMessage: tgMsg } = useToggleStoreStatus();

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IStore | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  const loadSedes = async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get("/sedes");
      setSedes(data);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadSedes();
  }, []);

  // feedback update
  useEffect(() => {
    if (!updating && (upOk || upMsg)) {
      setTypeModal(upOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL);
      setModalMsg(upOk ? "Sede actualizada correctamente" : upMsg);
      setOpenModal(true);
      if (upOk) loadSedes();
    }
  }, [updating, upOk, upMsg]);

  // feedback status
  useEffect(() => {
    if (!toggling && (tgOk || tgMsg)) {
      setTypeModal(tgOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL);
      setModalMsg(tgOk ? tgMsg : tgMsg);
      setOpenModal(true);
      if (tgOk) loadSedes();
    }
  }, [toggling, tgOk, tgMsg]);

  const onEdit = (s: IStore) => {
    setSelected(s);
    setOpenEdit(true);
  };

  const onSave = async (payload: Partial<IStore>) => {
    if (!selected) return;
    await updateStore(selected.id, payload);
    setOpenEdit(false);
  };

  const onToggle = async (s: IStore) => {
    await toggleStatus(s.id, !s.activo);
  };

  const busy = loadingList || updating || toggling;

  return (
    <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between">
        <p className="font-medium text-dark">Lista de sedes</p>
        <button
          onClick={loadSedes}
          className="text-sm font-semibold text-blue hover:underline"
          type="button"
        >
          Refrescar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-1">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">RUC</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3">Activo</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">Cargando...</td>
              </tr>
            ) : sedes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">No hay sedes aún</td>
              </tr>
            ) : (
              sedes.map((s) => (
                <tr key={s.id} className="border-t border-gray-3">
                  <td className="px-6 py-4">{s.id}</td>
                  <td className="px-6 py-4">{s.nombre}</td>
                  <td className="px-6 py-4">{s.ruc}</td>
                  <td className="px-6 py-4">{s.telefono}</td>
                  <td className="px-6 py-4">{s.activo ? "✅" : "❌"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(s)}
                        className="px-3 py-1.5 rounded-lg border border-gray-3 hover:bg-gray-1 text-xs font-semibold"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggle(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          s.activo
                            ? "border-red-200 text-red-700 hover:bg-red-50"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {s.activo ? " Suspender" : " Activar"}
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
        onSave={onSave}
        loading={updating}
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