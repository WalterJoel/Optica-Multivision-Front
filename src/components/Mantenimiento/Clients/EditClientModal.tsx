"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { IClient } from "@/types/clients";

interface Props {
  open: boolean;
  client: IClient | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditClientModal({
  open,
  client,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(client);
  }, [client]);

  if (!open || !form) return null;

  const toNumberOrNull = (value: string) => {
    const v = value.trim();
    if (v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const fmt = (v: unknown) => (v === null || v === undefined ? "" : String(v));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const updateClient = async () => {
    if (!form) return;

    try {
      setLoading(true);

      await api.patch(`/clientes/${form.id}`, {
        nombres: form.nombres?.trim() || null,
        apellidos: form.apellidos?.trim() || null,
        razonSocial: form.razonSocial?.trim() || null,
        telefono: form.telefono?.trim() || null,
        correo: form.correo?.trim() || null,
        direccion: form.direccion?.trim() || null,
        antecedentes: form.antecedentes?.trim() || null,
        fechaNacimiento: form.fechaNacimiento || null,

        add: toNumberOrNull(fmt(form.add)),
        dipOd: toNumberOrNull(fmt(form.dipOd)),
        dipOi: toNumberOrNull(fmt(form.dipOi)),

        odEsf: toNumberOrNull(fmt(form.odEsf)),
        odCyl: toNumberOrNull(fmt(form.odCyl)),
        odEje: toNumberOrNull(fmt(form.odEje)),

        oiEsf: toNumberOrNull(fmt(form.oiEsf)),
        oiCyl: toNumberOrNull(fmt(form.oiCyl)),
        oiEje: toNumberOrNull(fmt(form.oiEje)),
      });

      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error actualizando cliente", error);
    } finally {
      setLoading(false);
    }
  };

  const getNombre = () => {
    if (form.tipoCliente === "PERSONA") {
      return `${form.nombres ?? ""} ${form.apellidos ?? ""}`.trim() || "-";
    }
    return form.razonSocial ?? "-";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pt-40 p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-dark">Editar cliente</h3>
            <p className="mt-1 text-sm text-dark-5">
              {form.tipoDoc}: {form.numeroDoc} • {getNombre()}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium bg-gray-1 text-dark-2 hover:bg-gray-2"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-1 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-3 p-4">
            <p className="text-sm font-semibold text-dark">Generales</p>

            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-dark-5">ADD</p>
                <input
                  name="add"
                  value={fmt(form.add)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>

              <div>
                <p className="text-dark-5">DIP OD</p>
                <input
                  name="dipOd"
                  value={fmt(form.dipOd)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>

              <div>
                <p className="text-dark-5">DIP OI</p>
                <input
                  name="dipOi"
                  value={fmt(form.dipOi)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-3 p-4">
            <p className="text-sm font-semibold text-dark">Datos principales</p>

            <div className="mt-1 grid grid-cols-1 gap-3 text-sm">
              {form.tipoCliente === "PERSONA" ? (
                <>
                  <div>
                    <p className="text-dark-5">Nombres</p>
                    <input
                      name="nombres"
                      value={fmt(form.nombres)}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                    />
                  </div>

                  <div>
                    <p className="text-dark-5">Apellidos</p>
                    <input
                      name="apellidos"
                      value={fmt(form.apellidos)}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-dark-5">Razón social</p>
                  <input
                    name="razonSocial"
                    value={fmt(form.razonSocial)}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                  />
                </div>
              )}

              <div>
                <p className="text-dark-5">Teléfono</p>
                <input
                  name="telefono"
                  value={fmt(form.telefono)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-3 p-4">
            <p className="text-sm font-semibold text-dark">
              Ojo Derecho (OD)
            </p>

            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-dark-5">ESF</p>
                <input
                  name="odEsf"
                  value={fmt(form.odEsf)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>

              <div>
                <p className="text-dark-5">CYL</p>
                <input
                  name="odCyl"
                  value={fmt(form.odCyl)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>

              <div>
                <p className="text-dark-5">EJE</p>
                <input
                  name="odEje"
                  value={fmt(form.odEje)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-3 p-4">
            <p className="text-sm font-semibold text-dark">
              Ojo Izquierdo (OI)
            </p>

            <div className="mt-1 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-dark-5">ESF</p>
                <input
                  name="oiEsf"
                  value={fmt(form.oiEsf)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>

              <div>
                <p className="text-dark-5">CYL</p>
                <input
                  name="oiCyl"
                  value={fmt(form.oiCyl)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>

              <div>
                <p className="text-dark-5">EJE</p>
                <input
                  name="oiEje"
                  value={fmt(form.oiEje)}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 rounded-xl border border-gray-3 p-4">
          <p className="text-sm font-semibold text-dark">Datos adicionales</p>

          <div className="mt-1 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div>
              <p className="text-dark-5">Correo</p>
              <input
                name="correo"
                value={fmt(form.correo)}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
              />
            </div>

            <div>
              <p className="text-dark-5">Fecha de nacimiento</p>
              <input
                type="date"
                name="fechaNacimiento"
                value={fmt(form.fechaNacimiento)}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
              />
            </div>

            <div>
              <p className="text-dark-5">Dirección</p>
              <input
                name="direccion"
                value={fmt(form.direccion)}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
              />
            </div>

            <div>
              <p className="text-dark-5">Antecedentes</p>
              <input
                name="antecedentes"
                value={fmt(form.antecedentes)}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border border-gray-3 px-2 py-1 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-1 px-4 py-2 text-sm font-medium text-dark-2 hover:bg-gray-2"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={updateClient}
            disabled={loading}
            className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}