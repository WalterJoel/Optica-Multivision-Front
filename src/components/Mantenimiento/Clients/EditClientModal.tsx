"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { IClient } from "@/types/clients";
import { LoadingModal, StatusModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseTarea } from "@/components/Common/Inputs/BaseTarea";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";

interface Props {
  open: boolean;
  client: IClient | null;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}

export default function EditClientModal({
  open,
  client,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(false);

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

      await onUpdated();

      setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
      setStatusMessage("Cliente actualizado correctamente");
      setOpenStatusModal(true);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error al actualizar cliente";

      setTypeModal(STATUS_MODAL.ERROR_MODAL);
      setStatusMessage(Array.isArray(msg) ? msg.join(", ") : msg);
      setOpenStatusModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseStatus = () => {
    setOpenStatusModal(false);

    if (typeModal === STATUS_MODAL.SUCCESS_MODAL) {
      onClose();
    }
  };

  const getNombre = () => {
    if (form.tipoCliente === "PERSONA") {
      return `${form.nombres ?? ""} ${form.apellidos ?? ""}`.trim() || "-";
    }
    return form.razonSocial ?? "-";
  };

  return (
    <>
<div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10">        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

<div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">          <div className="flex items-start justify-between gap-4">
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

          <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-3 p-4">
              <p className="text-sm font-semibold text-dark">Generales</p>

<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">                <BaseInput
                  label="ADD"
                  name="add"
                  value={fmt(form.add)}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="DIP OD"
                  name="dipOd"
                  value={fmt(form.dipOd)}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="DIP OI"
                  name="dipOi"
                  value={fmt(form.dipOi)}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-3 p-4">
              <p className="text-sm font-semibold text-dark">Datos principales</p>

              <div className="mt-1 grid grid-cols-1 gap-3">
                {form.tipoCliente === "PERSONA" ? (
                  <>
                    <BaseInput
                      label="Nombres"
                      name="nombres"
                      value={fmt(form.nombres)}
                      onChange={handleInputChange}
                    />

                    <BaseInput
                      label="Apellidos"
                      name="apellidos"
                      value={fmt(form.apellidos)}
                      onChange={handleInputChange}
                    />
                  </>
                ) : (
                  <BaseInput
                    label="Razón social"
                    name="razonSocial"
                    value={fmt(form.razonSocial)}
                    onChange={handleInputChange}
                  />
                )}

                <BaseInput
                  label="Teléfono"
                  name="telefono"
                  value={fmt(form.telefono)}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-3 p-4">
              <p className="text-sm font-semibold text-dark">Ojo Derecho (OD)</p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <BaseInput
                  label="ESF"
                  name="odEsf"
                  value={fmt(form.odEsf)}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="CYL"
                  name="odCyl"
                  value={fmt(form.odCyl)}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="EJE"
                  name="odEje"
                  value={fmt(form.odEje)}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-3 p-4">
              <p className="text-sm font-semibold text-dark">Ojo Izquierdo (OI)</p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <BaseInput
                  label="ESF"
                  name="oiEsf"
                  value={fmt(form.oiEsf)}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="CYL"
                  name="oiCyl"
                  value={fmt(form.oiCyl)}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="EJE"
                  name="oiEje"
                  value={fmt(form.oiEje)}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-gray-3 p-4">
            <p className="text-sm font-semibold text-dark">Datos adicionales</p>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <BaseInput
                label="Correo"
                name="correo"
                value={fmt(form.correo)}
                onChange={handleInputChange}
              />

              <BaseInput
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
                value={fmt(form.fechaNacimiento)}
                onChange={handleInputChange}
              />

              <BaseInput
                label="Dirección"
                name="direccion"
                value={fmt(form.direccion)}
                onChange={handleInputChange}
              />

              <BaseTarea
                label="Antecedentes"
                name="antecedentes"
                value={fmt(form.antecedentes)}
                onChange={handleTextareaChange}
                rows={3}
                className="md:col-span-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <BaseButton
              type="button"
              variant="cancel"
              fullWidth={false}
              className="px-6"
              onClick={onClose}
            >
              Cancelar
            </BaseButton>

            <BaseButton
              type="button"
              variant="primary"
              fullWidth={false}
              className="px-6"
              onClick={updateClient}
              loading={loading}
            >
              Guardar
            </BaseButton>
          </div>
        </div>
      </div>

      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openStatusModal}
        type={typeModal}
        message={statusMessage}
        onClose={handleCloseStatus}
      />
    </>
  );
}