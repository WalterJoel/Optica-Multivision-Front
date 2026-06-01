"use client";

import { useEffect, useState, useMemo } from "react";
import { useEyeglasses, useDeleteEyeglass } from "@/hooks/products/eyeglasses";
import { IEyeglass } from "@/types/products";
import { useSessionUser } from "@/hooks/session";
import EditEyeglassModal from "./EditEyeglassModal";
import { Edit3, Trash2, Search, Glasses } from "lucide-react";
import { StatusModal, LoadingModal, ConfirmModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";

export default function ListEyeglasses() {
  const { sedeId } = useSessionUser();
  const { eyeglasses, loading, getAllEyeglassesData } = useEyeglasses(sedeId);
  const {
    deleteEyeglass,
    loading: deleting,
    success: deleteSuccess,
    statusMessage: deleteMsg,
  } = useDeleteEyeglass();

  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IEyeglass | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    getAllEyeglassesData();
  }, []);

  const openEditModal = (item: IEyeglass) => {
    setSelected(item);
    setOpenEdit(true);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setSelected(null);
  };

  const onDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteEyeglass(deleteId);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    if (!deleting && (deleteSuccess || deleteMsg)) {
      setTypeModal(
        deleteSuccess ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL
      );
      setModalMsg(deleteMsg);
      setOpenModal(true);
      if (deleteSuccess) {
        getAllEyeglassesData();
      }
    }
  }, [deleting, deleteSuccess, deleteMsg]);

  const filteredEyeglasses = useMemo(() => {
    let result = eyeglasses;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((item) => {
        const marca = (item.marca || "").toLowerCase();
        const material = (item.material || "").toLowerCase();
        const codigo = (item.codigo || "").toLowerCase();
        const codigoMontura = (item.codigoMontura || "").toLowerCase();
        const color = (item.color || "").toLowerCase();
        return (
          marca.includes(term) ||
          material.includes(term) ||
          codigo.includes(term) ||
          codigoMontura.includes(term) ||
          color.includes(term)
        );
      });
    }

    return result;
  }, [eyeglasses, searchTerm]);

  const busy = loading || deleting;

  return (
    <>
      <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">
          <p className="font-black text-dark uppercase text-xs tracking-wider">
            Lista de monturas
          </p>

          {/* Buscador */}
          <div className="flex items-center bg-beige-dark/40 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
            <Search size={16} className="text-blue-light-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por marca, código, material..."
              className="bg-transparent text-sm ml-2.5 outline-none w-72 text-dark-3 font-semibold placeholder:text-gray-5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-spacing-0">
            <thead>
              <tr className="bg-beige backdrop-blur-sm">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Marca / Código
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Cód. Montura
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Material
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Talla / Color
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Atributos (Forma / Sexo)
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Imagen
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Cantidad (Stock)
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
              {filteredEyeglasses.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                  >
                    {searchTerm.trim() !== ""
                      ? "No se encontraron monturas para tu búsqueda"
                      : "No hay monturas registradas"}
                  </td>
                </tr>
              ) : (
                filteredEyeglasses.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-white transition-all duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center bg-blue-light/20 rounded-xl text-blue shadow-sm group-hover:scale-110 transition-transform">
                          <Glasses size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-dark uppercase text-xs tracking-tight">
                            {item.marca}
                          </span>
                          <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                            CÓDIGO: {item.codigo}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-dark-2 font-semibold">
                      {item.codigoMontura}
                    </td>
                    <td className="px-6 py-5 text-dark-2">{item.material}</td>
                    <td className="px-6 py-5 text-dark-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark text-xs">{item.talla}</span>
                        <span className="text-[10px] text-dark-5 font-bold uppercase mt-0.5">{item.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col sm:flex-row gap-1.5 items-start sm:items-center">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm bg-blue-light/10 text-blue border-blue-light/20 leading-none">
                          {item.formaFacial}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm bg-gray-1 text-dark-2 border-gray-2 leading-none">
                          {item.sexo === "M" ? "Masc" : item.sexo === "F" ? "Fem" : "Unisex"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {item.imagenUrl ? (
                        <img
                          src={item.imagenUrl}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <span className="text-gray-4 font-semibold text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-dark text-xs bg-beige px-3 py-1.5 rounded-xl border border-slate-200">
                        {item.producto?.cantidad ?? item.cantidad ?? 0} uds
                      </span>
                    </td>
                    <td className="px-6 py-5 font-bold text-dark">
                      S/ {Number(item.precioVenta).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark"
                          title="Editar Montura"
                        >
                          <Edit3 size={16} strokeWidth={3} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="p-2.5 rounded-xl bg-white border border-red-light-4 text-red hover:bg-red hover:text-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                          title="Eliminar Montura"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
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

      <EditEyeglassModal
        isOpen={openEdit}
        eyeglass={selected}
        onClose={closeEditModal}
        onRefresh={getAllEyeglassesData}
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Montura?"
        message="Esta acción eliminará de forma permanente esta montura de tu inventario. ¿Estás seguro?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        variant="danger"
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