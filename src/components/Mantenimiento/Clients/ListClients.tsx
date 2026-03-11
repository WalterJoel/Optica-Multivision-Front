
"use client";
import EditClientModal from "./EditClientModal";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { IClient } from "@/types/clients";

type FilterDoc = "ALL" | "DNI" | "RUC";

export default function ListClients() {
  const [clientes, setClientes] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterDoc>("ALL");

  const [openMeasures, setOpenMeasures] = useState(false);
  const [selected, setSelected] = useState<IClient | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
const [clientEdit, setClientEdit] = useState<IClient | null>(null);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const getNombre = (c: IClient) => {
    if (c.tipoCliente === "PERSONA") {
      return `${c.nombres ?? ""} ${c.apellidos ?? ""}`.trim() || "-";
    }
    return c.razonSocial ?? "-";
  };

  const filteredClientes = useMemo(() => {
    if (filter === "ALL") return clientes;
    if (filter === "DNI") return clientes.filter((c) => c.tipoDoc === "DNI");
    return clientes.filter((c) => c.tipoDoc === "RUC");
  }, [clientes, filter]);

  const btnClass = (active: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium duration-200 ${
      active
        ? "bg-blue text-white"
        : "bg-gray-1 text-dark-2 hover:bg-blue hover:text-white"
    }`;

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
const updateClient = async (data: Partial<IClient>) => {
  if (!clientEdit) return;

  try {
    await api.patch(`/clientes/${clientEdit.id}`, data);

    loadClientes(); // refresca tabla
    closeEditClient();
  } catch (error) {
    console.error("Error actualizando cliente", error);
  }
};
  const closeModalMeasures = () => {
    setOpenMeasures(false);
    setSelected(null);
  };

  const fmt = (v: any) => (v === null || v === undefined ? "-" : String(v));
  const hasMeasures = (c: IClient) => {
  return (
    c.add !== null ||
    c.dipOd !== null ||
    c.dipOi !== null ||
    c.odEsf !== null ||
    c.odCyl !== null ||
    c.odEje !== null ||
    c.oiEsf !== null ||
    c.oiCyl !== null ||
    c.oiEje !== null
  );
};

  return (
    <>
      <div className="w-full rounded-xl border border-gray-3 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="font-medium text-dark">Lista de clientes</p>

          {/* Filtros */}
          <div className="flex gap-2">
            <button
              type="button"
              className={btnClass(filter === "ALL")}
              onClick={() => setFilter("ALL")}
            >
              Todos
            </button>
            <button
              type="button"
              className={btnClass(filter === "DNI")}
              onClick={() => setFilter("DNI")}
            >
              DNI
            </button>
            <button
              type="button"
              className={btnClass(filter === "RUC")}
              onClick={() => setFilter("RUC")}
            >
              RUC
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-1">
              <tr>
                <th className="px-6 py-3">Documento</th>
                <th className="px-6 py-3">Nombre / Razón Social</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Medidas</th>
                <th className="px-6 py-3">Activo</th>
                <th className="px-6 py-3 text-right">Acción</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6">
                    Cargando...
                  </td>
                </tr>
              ) : filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6">
                    No hay clientes para este filtro
                  </td>
                </tr>
              ) : (
                filteredClientes.map((c) => (
                  <tr key={c.id} className="border-t border-gray-3">
                    <td className="px-6 py-4">
                      {c.tipoDoc}: {c.numeroDoc}
                    </td>
                    <td className="px-6 py-4">{getNombre(c)}</td>
                    <td className="px-6 py-4">{c.telefono ?? "-"}</td>

                    <td className="px-6 py-4">{hasMeasures(c) ? "✅" : "—"}</td>

                    <td className="px-6 py-4">{c.activo ? "✅" : "❌"}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
  <button
    type="button"
    className="rounded-md bg-gray-1 px-3 py-2 text-sm font-medium text-dark-2 hover:bg-blue hover:text-white duration-200"
    onClick={() => openModalMeasures(c)}
  >
    Ver
  </button>

  <button
    type="button"
    className="rounded-md bg-gray-1 px-3 py-2 text-sm font-medium text-dark-2 hover:bg-blue hover:text-white duration-200"
    onClick={() => openEditClient(c)}
  >
    Editar
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

      {/* ✅ MODAL MEDIDAS */}
      {openMeasures && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-40 p-4">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModalMeasures}
          />

          {/* content */}
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  Medidas del cliente
                </h3>
                <p className="mt-3 text-sm text-dark-5">
                  {selected.tipoDoc}: {selected.numeroDoc} •{" "}
                  {getNombre(selected)}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModalMeasures}
                className="rounded-md px-3 py-2 text-sm font-medium bg-gray-1 text-dark-2 hover:bg-gray-2"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-3 p-4">
  <p className="text-sm font-semibold text-dark">Generales</p>
  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
    <div>
      <p className="text-dark-5">ADD</p>
      <p className="font-medium text-dark">{fmt(selected.add)}</p>
    </div>
    <div>
      <p className="text-dark-5">DIP OD</p>
      <p className="font-medium text-dark">{fmt(selected.dipOd)}</p>
    </div>
    <div>
      <p className="text-dark-5">DIP OI</p>
      <p className="font-medium text-dark">{fmt(selected.dipOi)}</p>
    </div>
  </div>
</div>

              <div className="rounded-xl border border-gray-3 p-4">
                <p className="text-sm font-semibold text-dark">
                  Última medición
                </p>
                <div className="mt-3 text-sm">
                  <p className="text-dark-5">Fecha</p>
                  <p className="font-medium text-dark">
                    {selected.fechaMedicion
                      ? new Date(selected.fechaMedicion).toLocaleString()
                      : "-"}
                  </p>
                  <p className="mt-2 text-dark-5">Encargado (ID)</p>
                  <p className="font-medium text-dark">
                    {fmt(selected.encargadoMedicionId)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-3 p-4">
                <p className="text-sm font-semibold text-dark">
                  Ojo Derecho (OD)
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-dark-5">ESF</p>
                    <p className="font-medium text-dark">
                      {fmt(selected.odEsf)}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-5">CYL</p>
                    <p className="font-medium text-dark">
                      {fmt(selected.odCyl)}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-5">EJE</p>
                    <p className="font-medium text-dark">
                      {fmt(selected.odEje)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-3 p-4">
                <p className="text-sm font-semibold text-dark">
                  Ojo Izquierdo (OI)
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-dark-5">ESF</p>
                    <p className="font-medium text-dark">
                      {fmt(selected.oiEsf)}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-5">CYL</p>
                    <p className="font-medium text-dark">
                      {fmt(selected.oiCyl)}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-5">EJE</p>
                    <p className="font-medium text-dark">
                      {fmt(selected.oiEje)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
<div className="mt-4 rounded-xl border border-gray-3 p-4">
  <p className="text-sm font-semibold text-dark">Datos adicionales</p>

  <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
    <div>
      <p className="text-dark-5">Correo</p>
      <p className="font-medium text-dark">{fmt(selected.correo)}</p>
    </div>

    <div>
      <p className="text-dark-5">Fecha de nacimiento</p>
      <p className="font-medium text-dark">
        {selected.fechaNacimiento
          ? new Date(selected.fechaNacimiento).toLocaleDateString()
          : "-"}
      </p>
    </div>

    <div>
      <p className="text-dark-5">Dirección</p>
      <p className="font-medium text-dark">{fmt(selected.direccion)}</p>
    </div>

    <div>
      <p className="text-dark-5">Antecedentes</p>
      <p className="font-medium text-dark">{fmt(selected.antecedentes)}</p>
    </div>
  </div>
</div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModalMeasures}
                className="rounded-md bg-gray-1 px-4 py-2 text-sm font-medium text-dark-2 hover:bg-gray-2"
              >
                Listo
              </button>
            </div>
          </div>
          
        </div>
        
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
