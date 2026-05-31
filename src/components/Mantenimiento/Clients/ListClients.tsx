
"use client";
import EditClientModal from "./EditClientModal";
import { useEffect, useMemo, useState } from "react";
import { IClient } from "@/types/clients";
import { Edit3, Power, Eye, User, Building, Phone, Mail, Search, X } from "lucide-react";
import { ModalFrameWrapper } from "@/components/Common/modal";
import { useClients, useToggleClientStatus } from "@/hooks/clients";

export default function ListClients() {
  const { toggleClientStatus } = useToggleClientStatus();
  const [searchTerm, setSearchTerm] = useState("");

  const [openMeasures, setOpenMeasures] = useState(false);
  const [selected, setSelected] = useState<IClient | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [clientEdit, setClientEdit] = useState<IClient | null>(null);

  // Hooks
  const { loadClientes, clientes, loading } = useClients();

  // Functions
  const onToggle = async (c: IClient) => {
    const success = await toggleClientStatus(c.id, !c.activo);
    if (success) {
      await loadClientes();
    }
  };

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const getNombre = (c: IClient) => {
    if (c.tipoCliente === "PERSONA") {
      return `${c.nombres ?? ""} ${c.apellidos ?? ""}`.trim() || "-";
    }
    return c.razonSocial ?? "-";
  };

  const filteredClientes = useMemo(() => {
    let result = clientes;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((c) => {
        const nombres = (c.nombres || "").toLowerCase();
        const apellidos = (c.apellidos || "").toLowerCase();
        const razonSocial = (c.razonSocial || "").toLowerCase();
        const numeroDoc = (c.numeroDoc || "").toLowerCase();

        return (
          nombres.includes(term) ||
          apellidos.includes(term) ||
          razonSocial.includes(term) ||
          numeroDoc.includes(term)
        );
      });
    }

    return result;
  }, [clientes, searchTerm]);

  const openModalMeasures = (c: IClient) => {
    setSelected(c);
    setOpenMeasures(true);
  };
  const openEditClient = (c: IClient) => {
    setClientEdit(c);
    setOpenEdit(true);
  };

  const closeEditClient = () => {
    setOpenEdit(false);
    setClientEdit(null);
  };

  const closeModalMeasures = () => {
    setOpenMeasures(false);
    setSelected(null);
  };

  const fmt = (v: any) => (v === null || v === undefined ? "-" : String(v));

  return (
    <>
      <div className="w-full rounded-2xl border border-gray-3 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap bg-white">


          {/* Buscador */}
          <div className="flex items-center bg-beige-dark/40 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-light-3 transition-all ml-auto">
            <Search size={16} className="text-blue-light-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, DNI o RUC..."
              className="bg-transparent text-sm ml-2.5 outline-none w-72 text-dark-3 font-semibold placeholder:text-gray-5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-spacing-0">
            <thead>
              <tr className="bg-beige backdrop-blur-sm">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Cliente / Razón Social
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Contacto
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-dark-3 border-b border-gray-3">
                  Dirección
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
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                  >
                    Cargando clientes...
                  </td>
                </tr>
              ) : filteredClientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-24 text-center text-dark-5 font-bold uppercase text-[10px] tracking-widest"
                  >
                    {searchTerm.trim() !== ""
                      ? "No se encontraron clientes para tu búsqueda"
                      : "No se encontraron clientes activos"}
                  </td>
                </tr>
              ) : (
                filteredClientes.map((c) => {
                  return (
                    <tr
                      key={c.id}
                      className="group hover:bg-white transition-all duration-300 text-xs"
                    >
                      {/* Cliente / Razón Social */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center bg-blue-light/10 rounded-xl text-blue shadow-sm group-hover:scale-110 transition-transform">
                            {c.tipoCliente === "PERSONA" ? (
                              <User size={20} strokeWidth={2.5} />
                            ) : (
                              <Building size={20} strokeWidth={2.5} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-dark uppercase text-xs tracking-tight">
                              {getNombre(c)}
                            </span>
                            <span className="text-[10px] text-dark-5 font-bold uppercase tracking-tighter">
                              {c.tipoDoc}: {c.numeroDoc}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contacto (Teléfono y Correo) */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5 justify-center">
                          {c.telefono && (
                            <div className="flex items-center gap-2 text-dark-3 text-xs">
                              <Phone size={13} className="text-yellow-dark" />
                              <span className="font-bold">{c.telefono}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-dark-3 text-xs">
                            <Mail size={13} className="text-blue-light" />
                            <span className="font-semibold text-slate-500 truncate block max-w-[190px]">
                              {c.correo || "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Dirección */}
                      <td className="px-6 py-5">
                        <span className="font-bold text-dark-3 block max-w-[200px] truncate" title={c.direccion ?? ""}>
                          {c.direccion || "—"}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${c.activo
                              ? "bg-green-light-6 text-green-dark border-green-light-5"
                              : "bg-red-light-6 text-red-dark border-red-light-5"
                              }`}
                          >
                            {c.activo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </td>

                      {/* Acciones - tal cual listStores.tsx */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Ver Medidas */}
                          <button
                            type="button"
                            onClick={() => openModalMeasures(c)}
                            className="p-2.5 rounded-xl bg-yellow-dark text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-yellow-dark/20 border border-yellow-dark cursor-pointer flex items-center justify-center"
                            title="Ver Medidas"
                          >
                            <Eye size={16} strokeWidth={3} />
                          </button>

                          {/* Editar Cliente */}
                          <button
                            type="button"
                            onClick={() => openEditClient(c)}
                            className="p-2.5 rounded-xl bg-blue text-white hover:scale-110 active:scale-95 transition-all shadow-md shadow-blue/20 border border-blue cursor-pointer flex items-center justify-center"
                            title="Editar Cliente"
                          >
                            <Edit3 size={16} strokeWidth={3} />
                          </button>

                          {/* Alternar Activo/Inactivo */}
                          <button
                            type="button"
                            onClick={() => onToggle(c)}
                            className={`p-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center cursor-pointer ${c.activo
                              ? "bg-white border-red-light-4 text-red hover:bg-red hover:text-white"
                              : "bg-white border-green-light-4 text-green hover:bg-green hover:text-white"
                              }`}
                            title={c.activo ? "Desactivar Cliente" : "Activar Cliente"}
                          >
                            <Power size={16} strokeWidth={3} />
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

      {/* ✅ MODAL MEDIDAS */}
      {openMeasures && selected && (
        <ModalFrameWrapper size="lg">
          <div className="pt-2 pb-14 w-full max-h-[82vh] overflow-y-auto pr-1">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                    Medidas del cliente
                  </h3>
                  <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                    {selected.tipoDoc}: {selected.numeroDoc} • {getNombre(selected)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModalMeasures}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grid 1 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Generales */}
              <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                  <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                    Generales
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">ADD</span>
                    <span className="font-bold text-dark-3">{fmt(selected.add)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">DIP OD</span>
                    <span className="font-bold text-dark-3">{fmt(selected.dipOd)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">DIP OI</span>
                    <span className="font-bold text-dark-3">{fmt(selected.dipOi)}</span>
                  </div>
                </div>
              </div>

              {/* Última medición */}
              <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                  <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                    Última medición
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">Fecha</span>
                    <span className="font-bold text-dark-3">
                      {selected.fechaMedicion
                        ? new Date(selected.fechaMedicion).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">Encargado (ID)</span>
                    <span className="font-bold text-dark-3">{fmt(selected.encargadoMedicionId)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 2 */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Ojo Derecho (OD) */}
              <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                  <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                    Ojo Derecho (OD)
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">ESF</span>
                    <span className="font-bold text-dark-3">{fmt(selected.odEsf)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">CYL</span>
                    <span className="font-bold text-dark-3">{fmt(selected.odCyl)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">EJE</span>
                    <span className="font-bold text-dark-3">{fmt(selected.odEje)}</span>
                  </div>
                </div>
              </div>

              {/* Ojo Izquierdo (OI) */}
              <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                  <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                    Ojo Izquierdo (OI)
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">ESF</span>
                    <span className="font-bold text-dark-3">{fmt(selected.oiEsf)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">CYL</span>
                    <span className="font-bold text-dark-3">{fmt(selected.oiCyl)}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">EJE</span>
                    <span className="font-bold text-dark-3">{fmt(selected.oiEje)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Datos adicionales */}
            <div className="mt-4 bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Datos adicionales
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
                <div>
                  <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">Correo</span>
                  <span className="font-semibold text-dark-3 block truncate">{fmt(selected.correo)}</span>
                </div>
                <div>
                  <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">Fecha de nacimiento</span>
                  <span className="font-bold text-dark-3">
                    {selected.fechaNacimiento
                      ? new Date(selected.fechaNacimiento).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">Dirección</span>
                  <span className="font-bold text-dark-3">{fmt(selected.direccion)}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-[8px] font-black text-gray-4 uppercase tracking-wider mb-1">Antecedentes</span>
                  <p className="font-bold text-dark-3 whitespace-pre-wrap leading-relaxed">{fmt(selected.antecedentes)}</p>
                </div>
              </div>
            </div>

            {/* Cerrar */}
            <button
              type="button"
              onClick={closeModalMeasures}
              className="mt-6 w-full py-3.5 bg-blue hover:bg-blue-dark text-white rounded-2xl font-black uppercase text-[11px] tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Listo
            </button>
          </div>
        </ModalFrameWrapper>
      )}
      <EditClientModal
        open={openEdit}
        client={clientEdit}
        onClose={closeEditClient}
        onUpdated={loadClientes}
      />
    </>
  );
}
