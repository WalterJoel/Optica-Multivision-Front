"use client";

import { useEffect, useState, useMemo } from "react";
import { StatusModal, LoadingModal, ConfirmModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import EditDiscountModal from "./EditDiscountModal";
import { IDescuento } from "@/types/discounts";
import { Edit3, Power, Tags, Search } from "lucide-react";
import { useDiscounts, useUpdateDiscount } from "@/hooks/discounts";
import { useClients } from "@/hooks/clients";

export default function ListDiscounts() {
  // Hooks
  const { discounts, loading, getAllDiscounts } = useDiscounts();
  const { clientes, loadClientes } = useClients();
  const {
    updateDiscount,
    loading: updating,
    success: updateOk,
    statusMessage: updateMessage,
  } = useUpdateDiscount();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<IDescuento | null>(null);
  const [deactivateId, setDeactivateId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [modalMsg, setModalMsg] = useState("");

  // Load initial data
  useEffect(() => {
    getAllDiscounts();
    loadClientes();
  }, []);

  const getClientName = (clientId: number) => {
    const client = clientes.find((c) => c.id === clientId);
    if (!client) return `Cliente #${clientId}`;
    return client.tipoCliente === "EMPRESA" ? (client.razonSocial || "") : `${client.nombres || ""} ${client.apellidos || ""}`.trim();
  };

  const getProductName = (d: IDescuento) => {
    if (d.tipoProducto === "LENTE" && d.lente) {
      return `${d.lente.marca} - ${d.lente.material}`;
    }
    return d.producto?.nombre ?? "Desconocido";
  };

  const getProductTypeBadge = (tipoProducto: string) => {
    switch (tipoProducto) {
      case "LENTE":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-light/10 text-blue">
            Lente
          </span>
        );
      case "MONTURA":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-yellow-light-4 text-yellow-dark">
            Montura
          </span>
        );
      case "ACCESORIO":
        return (
          <span className="inline-block text-[9px] font-[900] uppercase tracking-widest px-2 py-0.5 rounded-md bg-teal-50 text-teal-600">
            Accesorio
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg uppercase">
            {tipoProducto}
          </span>
        );
    }
  };

  // Memos
  const filteredDiscounts = useMemo(() => {
    let result = discounts;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((d) => {
        const clientName = getClientName(d.clienteId).toLowerCase();
        const productName = getProductName(d).toLowerCase();
        const tipo = (d.tipoProducto || "").toLowerCase();
        return (
          clientName.includes(term) ||
          productName.includes(term) ||
          tipo.includes(term)
        );
      });
    }

    return result;
  }, [discounts, searchTerm, clientes]);

  // Functions
  const onEdit = (d: IDescuento) => {
    setSelected(d);
    setOpenEdit(true);
  };

  const onToggle = async (d: IDescuento) => {
    if (d.activo) {
      setDeactivateId(d.id);
    } else {
      await updateDiscount(d.id, { activo: true });
    }
  };

  const handleConfirmDeactivate = async () => {
    if (deactivateId) {
      await updateDiscount(deactivateId, { activo: false });
      setDeactivateId(null);
    }
  };

  const busy = loading || updating;

  // Effects
  useEffect(() => {
    if (!updating && (updateOk || updateMessage)) {
      setTypeModal(
        updateOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setModalMsg(updateMessage);
      setOpenModal(true);
      if (updateOk) getAllDiscounts();
    }
  }, [updating, updateOk, updateMessage]);

  return (
    <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">
        <p className="font-black text-dark uppercase text-xs tracking-wider">
          Lista de Descuentos
        </p>

        {/* Buscador */}
        <div className="flex items-center bg-beige-dark/40 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
          <Search size={16} className="text-blue-light-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, producto o tipo..."
            className="bg-transparent text-sm ml-2.5 outline-none w-72 text-dark-3 font-semibold placeholder:text-gray-5"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-spacing-0">
          <thead>
            <tr className="bg-beige backdrop-blur-sm">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Cliente
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Tipo Producto
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Producto / Lente
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3 text-center">
                Serie
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                Descuento
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
            {filteredDiscounts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                >
                  {searchTerm.trim() !== ""
                    ? "No se encontraron descuentos para tu búsqueda"
                    : "No hay descuentos registrados"}
                </td>
              </tr>
            ) : (
              filteredDiscounts.map((d) => (
                <tr
                  key={d.id}
                  className="group hover:bg-white transition-all duration-300"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center bg-blue-light/20 rounded-xl text-blue shadow-sm group-hover:scale-110 transition-transform">
                        <Tags size={20} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-dark uppercase text-xs tracking-tight">
                          {getClientName(d.clienteId)}
                        </span>
                        <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                          ID DESCUENTO: {d.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getProductTypeBadge(d.tipoProducto)}
                  </td>
                  <td className="px-6 py-5 text-dark-2 uppercase font-medium">
                    {getProductName(d)}
                  </td>
                  <td className="px-6 py-5 text-dark-2 text-center font-bold">
                    {d.tipoProducto === "LENTE" && d.serie ? `Serie ${d.serie}` : "-"}
                  </td>
                  <td className="px-6 py-5 font-bold text-dark">
                    S/ {Number(d.montoDescuento).toFixed(2)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${d.activo
                          ? "bg-green-light-6 text-green-dark border-green-light-5"
                          : "bg-red-light-6 text-red-dark border-red-light-5"
                          }`}
                      >
                        {d.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => onEdit(d)}
                        className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark"
                        title="Editar Descuento"
                      >
                        <Edit3 size={16} strokeWidth={3} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggle(d)}
                        className={`p-2.5 rounded-xl transition-all shadow-sm border ${d.activo
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

      <EditDiscountModal
        isOpen={openEdit}
        discount={selected}
        onClose={() => setOpenEdit(false)}
        onRefresh={getAllDiscounts}
      />

      <ConfirmModal
        isOpen={deactivateId !== null}
        onClose={() => setDeactivateId(null)}
        onConfirm={handleConfirmDeactivate}
        title="¿Desactivar Descuento?"
        message="Esta acción desactivará este descuento. ¿Estás seguro?"
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
