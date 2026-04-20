"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { IUser } from "@/types/users";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import EditUserModal from "./EditUserModal";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import { useToggleUserStatus } from "@/hooks/users/useToggleUserStatus";

type Sede = { id: number; nombre: string; activo?: boolean };

export default function ListUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedSede, setSelectedSede] = useState<number | "ALL">("ALL");

  const {
    updateUser,
    loading: updating,
    success: upOk,
    statusMessage: upMsg,
  } = useUpdateUser();
  const {
    toggleStatus,
    loading: toggling,
    success: tgOk,
    statusMessage: tgMsg,
  } = useToggleUserStatus();

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IUser | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  const loadData = async () => {
    setLoadingList(true);
    try {
      const { data: usersData } = await api.get("/users");
      const { data: sedesData } = await api.get("/sedes");
      setUsers(Array.isArray(usersData) ? usersData : []);
      setSedes(Array.isArray(sedesData) ? sedesData : []);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (selectedSede === "ALL") return users;
    return users.filter((u) => u.sedeId === selectedSede);
  }, [users, selectedSede]);

  useEffect(() => {
    if (!updating && (upOk || upMsg)) {
      setTypeModal(
        upOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setModalMsg(upOk ? "Usuario actualizado correctamente" : upMsg);
      setOpenModal(true);
      if (upOk) loadData();
    }
  }, [updating, upOk, upMsg]);

  useEffect(() => {
    if (!toggling && (tgOk || tgMsg)) {
      setTypeModal(
        tgOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setModalMsg(tgMsg);
      setOpenModal(true);
      if (tgOk) loadData();
    }
  }, [toggling, tgOk, tgMsg]);

  const onEdit = (u: IUser) => {
    setSelected(u);
    setOpenEdit(true);
  };

  const onSave = async (payload: {
    email?: string;
    role?: string;
    sedeId?: number;
    password?: string;
  }) => {
    if (!selected) return;
    await updateUser(selected.id, payload as any);
    setOpenEdit(false);
  };

  const onToggle = async (u: IUser) => {
    await toggleStatus(u.id, !u.activo);
  };

  const busy = loadingList || updating || toggling;

  return (
    <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-medium text-dark">Lista de usuarios</p>

        <div className="flex items-center gap-3">
          <select
            value={selectedSede}
            onChange={(e) =>
              setSelectedSede(
                e.target.value === "ALL" ? "ALL" : Number(e.target.value),
              )
            }
            className="h-11 rounded-lg border border-gray-3 bg-white px-4 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">Todas las sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadData}
            className="text-sm font-semibold text-blue hover:underline"
          >
            Refrescar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-1">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3">Sede</th>
              <th className="px-6 py-3">Activo</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">
                  Cargando...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6">
                  No hay usuarios en esta sede
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-gray-3">
                  <td className="px-6 py-4">{u.id}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">{u.sedeId}</td>
                  <td className="px-6 py-4">{u.activo ? "✅" : "❌"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        className="px-3 py-1.5 rounded-lg border border-gray-3 hover:bg-gray-1 text-xs font-semibold"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggle(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          u.activo
                            ? "border-red-200 text-red-700 hover:bg-red-50"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {u.activo ? "⛔ Suspender" : "✅ Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditUserModal
        isOpen={openEdit}
        user={selected}
        sedes={sedes}
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
