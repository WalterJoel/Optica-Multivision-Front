"use client";

import { useEffect, useState } from "react";
import { IClient, ClientType } from "@/types/clients";
import { LoadingModal, StatusModal, ModalFrameWrapper } from "@/components/Common/modal";
import { STATUS_MODAL, TipoCliente } from "@/commons/constants";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseSelect } from "@/components/Common/Inputs/BaseSelect";
import { BaseTarea } from "@/components/Common/Inputs/BaseTarea";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { useUpdateClient } from "@/hooks/clients";
import { X, User } from "lucide-react";

interface Props {
  open: boolean;
  client: IClient | null;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}

const parseNumberOrNull = (val: any): number | null => {
  if (val === "" || val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

export default function EditClientModal({
  open,
  client,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<IClient | null>(null);

  const { updateClient: runUpdate, loading, success: updateOk, statusMessage: updateMsg } = useUpdateClient();

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [typeModal, setTypeModal] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (client) {
      let formattedDate = client.fechaNacimiento ?? "";
      if (formattedDate && formattedDate.includes("T")) {
        formattedDate = formattedDate.split("T")[0];
      }
      setForm({
        ...client,
        fechaNacimiento: formattedDate,
      });
    } else {
      setForm(null);
    }
  }, [client]);

  useEffect(() => {
    if (!loading && (updateOk || updateMsg)) {
      setTypeModal(
        updateOk ? STATUS_MODAL.SUCCESS_MODAL : STATUS_MODAL.ERROR_MODAL,
      );
      setStatusMessage(updateMsg);
      setOpenStatusModal(true);
      if (updateOk) {
        onUpdated();
      }
    }
  }, [loading, updateOk, updateMsg]);

  if (!open || !form) return null;

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

  const handleTipoClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as ClientType;
    const docType = tipo === TipoCliente.PERSONA ? "DNI" : "RUC";
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tipoCliente: tipo,
        tipoDoc: docType,
      };
    });
  };

  const handleTipoDocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const docType = e.target.value as "DNI" | "RUC";
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tipoDoc: docType,
      };
    });
  };

  const updateClient = async () => {
    if (!form) return;

    const isPersona = form.tipoCliente === TipoCliente.PERSONA;

    await runUpdate(form.id, {
      tipoCliente: form.tipoCliente,
      tipoDoc: form.tipoDoc,
      numeroDoc: form.numeroDoc?.trim() || "",

      nombres: isPersona ? (form.nombres?.trim() || null) : null,
      apellidos: isPersona ? (form.apellidos?.trim() || null) : null,
      razonSocial: !isPersona ? (form.razonSocial?.trim() || null) : null,

      telefono: form.telefono?.trim() || null,
      correo: form.correo?.trim() || null,
      direccion: form.direccion?.trim() || null,
      antecedentes: form.antecedentes?.trim() || null,
      fechaNacimiento: form.fechaNacimiento || null,

      add: parseNumberOrNull(form.add),
      dipOd: parseNumberOrNull(form.dipOd),
      dipOi: parseNumberOrNull(form.dipOi),

      odEsf: parseNumberOrNull(form.odEsf),
      odCyl: parseNumberOrNull(form.odCyl),
      odEje: parseNumberOrNull(form.odEje),

      oiEsf: parseNumberOrNull(form.oiEsf),
      oiCyl: parseNumberOrNull(form.oiCyl),
      oiEje: parseNumberOrNull(form.oiEje),
    });
  };

  const handleCloseStatus = () => {
    setOpenStatusModal(false);

    if (typeModal === STATUS_MODAL.SUCCESS_MODAL) {
      onClose();
    }
  };

  const getNombre = () => {
    if (form.tipoCliente === TipoCliente.PERSONA) {
      return `${form.nombres ?? ""} ${form.apellidos ?? ""}`.trim() || "-";
    }
    return form.razonSocial ?? "-";
  };

  return (
    <>
      <ModalFrameWrapper size="xl">
        <div className="pt-2 pb-14 w-full max-h-[82vh] overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue/5 border border-blue-light-5 flex items-center justify-center text-blue shadow-sm">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-dark uppercase tracking-tight leading-none">
                  Editar Cliente
                </h3>
                <p className="text-[10px] font-bold text-gray-4 uppercase tracking-widest mt-1.5">
                  {form.tipoDoc}: {form.numeroDoc} • {getNombre()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Datos de Identificación y principales */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Datos principales
                </h4>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <BaseSelect
                    label="Tipo Cliente"
                    name="tipoCliente"
                    value={form.tipoCliente}
                    onChange={handleTipoClienteChange}
                    options={[
                      { label: "Persona", value: TipoCliente.PERSONA },
                      { label: "Empresa", value: TipoCliente.EMPRESA },
                    ]}
                  />

                  <BaseSelect
                    label="Tipo Doc."
                    name="tipoDoc"
                    value={form.tipoDoc}
                    onChange={handleTipoDocChange}
                    options={[
                      { label: "DNI", value: "DNI" },
                      { label: "RUC", value: "RUC" },
                    ]}
                  />

                  <BaseInput
                    label="N° Documento"
                    name="numeroDoc"
                    value={form.numeroDoc ?? ""}
                    onChange={handleInputChange}
                  />
                </div>

                {form.tipoCliente === TipoCliente.PERSONA ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <BaseInput
                      label="Nombres"
                      name="nombres"
                      value={form.nombres ?? ""}
                      onChange={handleInputChange}
                    />

                    <BaseInput
                      label="Apellidos"
                      name="apellidos"
                      value={form.apellidos ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <BaseInput
                    label="Razón social"
                    name="razonSocial"
                    value={form.razonSocial ?? ""}
                    onChange={handleInputChange}
                  />
                )}

                <BaseInput
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Generales / Medidas básicas */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Medidas Generales
                </h4>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <BaseInput
                  label="ADD"
                  name="add"
                  value={form.add ?? ""}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="DIP OD"
                  name="dipOd"
                  value={form.dipOd ?? ""}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="DIP OI"
                  name="dipOi"
                  value={form.dipOi ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Ojo Derecho (OD) */}
            <div className="bg-beige/40 border border-slate-200/80 border-dashed rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[3px] bg-yellow-dark rounded-full" />
                <h4 className="text-[10px] font-black text-blue uppercase tracking-widest">
                  Ojo Derecho (OD)
                </h4>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <BaseInput
                  label="ESF"
                  name="odEsf"
                  value={form.odEsf ?? ""}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="CYL"
                  name="odCyl"
                  value={form.odCyl ?? ""}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="EJE"
                  name="odEje"
                  value={form.odEje ?? ""}
                  onChange={handleInputChange}
                />
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

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <BaseInput
                  label="ESF"
                  name="oiEsf"
                  value={form.oiEsf ?? ""}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="CYL"
                  name="oiCyl"
                  value={form.oiCyl ?? ""}
                  onChange={handleInputChange}
                />

                <BaseInput
                  label="EJE"
                  name="oiEje"
                  value={form.oiEje ?? ""}
                  onChange={handleInputChange}
                />
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

            <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <BaseInput
                label="Correo"
                name="correo"
                value={form.correo ?? ""}
                onChange={handleInputChange}
              />

              <BaseInput
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento ?? ""}
                onChange={handleInputChange}
              />

              <BaseInput
                label="Dirección"
                name="direccion"
                value={form.direccion ?? ""}
                onChange={handleInputChange}
              />

              <BaseTarea
                label="Antecedentes"
                name="antecedentes"
                value={form.antecedentes ?? ""}
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
      </ModalFrameWrapper>

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
