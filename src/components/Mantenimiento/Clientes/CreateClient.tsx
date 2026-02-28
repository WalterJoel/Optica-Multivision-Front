"use client";

import { useEffect, useMemo, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { ClientType, ICreateClient } from "@/types/clients";
import { useCreateClient } from "@/hooks/clients/useCreateClient"; // AJUSTA ESTA RUTA

const emptyForm: ICreateClient = {
  tipoCliente: "PERSONA",
  numeroDoc: "",
  nombres: "",
  apellidos: "",
  razonSocial: "",
  telefono: "",
  correo: "",
  direccion: "",
};

export default function CreateClient() {
  const [form, setForm] = useState<ICreateClient>(emptyForm);
  const { addClient, success, statusMessage, loading } = useCreateClient();

  const [typeModal, setTypeModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const tipoDoc = useMemo(
    () => (form.tipoCliente === "PERSONA" ? "DNI" : "RUC"),
    [form.tipoCliente]
  );

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "telefono") {
    const onlyDigits = value.replace(/\D/g, "");
    const cut = onlyDigits.slice(0, 9);
    setForm((p) => ({ ...p, telefono: cut }));
    return;
  }

  setForm((p) => ({ ...p, [name]: value }));
};
  const onChangeTipo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipoCliente = e.target.value as ClientType;

    setForm((p) => ({
      ...p,
      tipoCliente,
      numeroDoc: "",
      nombres: tipoCliente === "PERSONA" ? (p.nombres ?? "") : "",
      apellidos: tipoCliente === "PERSONA" ? (p.apellidos ?? "") : "",
      razonSocial: tipoCliente === "EMPRESA" ? (p.razonSocial ?? "") : "",
    }));
  };

  const createClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClient(form);
  };

  useEffect(() => {
    if (!loading && (success || statusMessage)) {
      if (success) {
        setTypeModal(STATUS_MODAL.SUCCESS_MODAL);
        setForm(emptyForm);
      } else {
        setTypeModal(STATUS_MODAL.ERROR_MODAL);
      }
      setOpenModal(true);
    }
  }, [loading, success, statusMessage]);

  return (
    <>
      <form
        onSubmit={createClient}
        className="w-full rounded-xl border border-gray-3 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* tipo cliente */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-dark">Tipo</label>
            <select
              value={form.tipoCliente}
              onChange={onChangeTipo}
              className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-3 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            >
              <option value="PERSONA">Persona</option>
              <option value="EMPRESA">Empresa</option>
            </select>
          </div>

          {/* documento */}
          <BaseInput
            label={tipoDoc}
            name="numeroDoc"
            value={form.numeroDoc}
            placeholder={tipoDoc === "DNI" ? "12345678" : "20123456789"}
            required
            onChange={onChange}
            pattern={tipoDoc === "DNI" ? "^\\d{8}$" : "^\\d{11}$"}
            title={
              tipoDoc === "DNI"
                ? "El DNI debe tener 8 dígitos"
                : "El RUC debe tener 11 dígitos"
            }
          />

          {/* campos condicionales */}
          {form.tipoCliente === "PERSONA" ? (
            <>
              <BaseInput
                label="Nombres"
                name="nombres"
                value={form.nombres || ""}
                placeholder="Juan"
                required
                onChange={onChange}
              />

              <BaseInput
                label="Apellidos"
                name="apellidos"
                value={form.apellidos || ""}
                placeholder="Perez"
                required
                onChange={onChange}
              />
            </>
          ) : (
            <BaseInput
              label="Razón Social"
              name="razonSocial"
              value={form.razonSocial || ""}
              placeholder="Optica Multivision SAC"
              required
              onChange={onChange}
            />
          )}

          {/* extras */}
          <BaseInput
  label="Teléfono"
  name="telefono"
  value={form.telefono || ""}
  placeholder="999888777"
  onChange={onChange}
  pattern={form.telefono.length === 9 ? "^\\d{9}$" : undefined}
  title="El teléfono debe tener 9 dígitos"
/>

          <BaseInput
            label="Correo"
            name="correo"
            value={form.correo || ""}
            placeholder="correo@mail.com"
            onChange={onChange}
          />

          <BaseInput
            label="Dirección"
            name="direccion"
            value={form.direccion || ""}
            placeholder="Av..."
            onChange={onChange}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <BaseButton type="submit" loading={loading} className="min-w-[240px]">
            Crear cliente
          </BaseButton>
        </div>
      </form>

      <LoadingModal isOpen={loading} />
      <StatusModal
        isOpen={openModal}
        type={typeModal}
        message={statusMessage}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}