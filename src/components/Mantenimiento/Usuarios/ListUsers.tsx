"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { IUser } from "@/types/users";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import EditUserModal from "./EditUserModal";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import { useToggleUserStatus } from "@/hooks/users/useToggleUserStatus";
import { Edit3, Power, User as UserIcon, Mail, Search } from "lucide-react";

type Sede = { id: number; nombre: string; activo?: boolean };

export default function ListUsers() {
  // Hooks
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

  // States
  const [users, setUsers] = useState<IUser[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedSede, setSelectedSede] = useState<number | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IUser | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  // Functions
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

  // Memos
  const filteredUsers = useMemo(() => {
    let result = users;

    // 1. Sede filter
    if (selectedSede !== "ALL") {
      result = result.filter((u) => u.sede?.id === selectedSede);
    }

    // 2. Search term filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((u) => {
        const nombre = (u.nombre || "").toLowerCase();
        const apellido = (u.apellido || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const role = (u.role || "").toLowerCase();
        return (
          nombre.includes(term) ||
          apellido.includes(term) ||
          email.includes(term) ||
          role.includes(term)
        );
      });
    }

    return result;
  }, [users, selectedSede, searchTerm]);

  // Effects
  useEffect(() => {
    if (!updating && (upOk || upMsg)) {
      setTypeModal(
        upOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL
      );
      setModalMsg(upOk ? "Usuario actualizado correctamente" : upMsg);
      setOpenModal(true);
      if (upOk) loadData();
    }
  }, [updating, upOk, upMsg]);

  useEffect(() => {
    if (!toggling && (tgOk || tgMsg)) {
      setTypeModal(
        tgOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL
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
    <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">

        <div className="flex items-center gap-3 flex-wrap ml-auto">
          {/* Buscador */}
          <div className="flex items-center bg-beige-dark/40 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-light-3 transition-all">
            <Search size={16} className="text-blue-light-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email o rol..."
              className="bg-transparent text-sm ml-2.5 outline-none w-72 text-dark-3 font-semibold placeholder:text-gray-5"
            />
          </div>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-spacing-0">
          <thead>
            <tr className="bg-beige backdrop-blur-sm">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Usuario
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Email
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Rol
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-center">
                Sede
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
            {loadingList ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                >
                  Cargando usuarios...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                >
                  {searchTerm.trim() !== ""
                    ? "No se encontraron usuarios para tu búsqueda"
                    : "No hay usuarios registrados"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="group hover:bg-white transition-all duration-300 text-xs"
                >
                  {/* Usuario */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center bg-blue-light/10 rounded-xl text-blue shadow-sm group-hover:scale-110 transition-transform">
                        <UserIcon size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-dark uppercase text-xs tracking-tight">
                          {u.nombre} {u.apellido}
                        </span>
                        <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                          ID: {u.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-dark-3 text-xs">
                      <Mail size={13} className="text-blue-light" />
                      <span className="font-semibold text-slate-500">{u.email}</span>
                    </div>
                  </td>

                  {/* Rol */}
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm bg-slate-50 text-slate-500 border-slate-200">
                      {u.role}
                    </span>
                  </td>

                  {/* Sede */}
                  <td className="px-6 py-5 text-center font-bold text-dark-3">
                    {u.sede?.nombre || `ID: ${u.sede?.id || "—"}`}
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${u.activo
                          ? "bg-green-light-6 text-green-dark border-green-light-5"
                          : "bg-red-light-6 text-red-dark border-red-light-5"
                          }`}
                      >
                        {u.activo ? "Activo" : "Suspendido"}
                      </span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {/* Editar Usuario */}
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark cursor-pointer flex items-center justify-center"
                        title="Editar Usuario"
                      >
                        <Edit3 size={16} strokeWidth={3} />
                      </button>

                      {/* Suspender / Activar */}
                      <button
                        type="button"
                        onClick={() => onToggle(u)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center cursor-pointer ${u.activo
                          ? "bg-white border-red-light-4 text-red hover:bg-red hover:text-white"
                          : "bg-white border-green-light-4 text-green hover:bg-green hover:text-white"
                          }`}
                        title={u.activo ? "Suspender Usuario" : "Activar Usuario"}
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
