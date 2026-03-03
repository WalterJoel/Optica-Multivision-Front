"use client";

import { useEffect, useMemo, useState } from "react";
import { BaseInput } from "@/components/Common/Inputs/BaseInput";
import { BaseButton } from "@/components/Common/Buttons/BaseButton";
import { StatusModal, LoadingModal } from "@/components/Common/modal";
import { STATUS_MODAL } from "@/commons/constants";
import { ClientType, ICreateClient } from "@/types/clients";
import { useCreateClient } from "@/hooks/clients/useCreateClient";

const emptyForm: ICreateClient = {
  tipoCliente: "PERSONA",
  numeroDoc: "",
  nombres: "",
  apellidos: "",
  razonSocial: "",
  telefono: "",
  correo: "",
  direccion: "",

  // ✅ MEDIDAS
  dip: "",
  add: "",

  odEsf: "",
  odCyl: "",
  odEje: "",

  oiEsf: "",
  oiCyl: "",
  oiEje: "",
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

  // ✅ helper: permitir decimales con signo (-1.25, 2, 0.50, etc.)
  const normalizeDecimal = (value: string) => {
    // deja: dígitos, -, +, punto
    let v = value.replace(/[^\d.+-]/g, "");
    // solo 1 signo al inicio
    v = v.replace(/(?!^)[+-]/g, "");
    // solo 1 punto
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    // limitar largo
    return v.slice(0, 8);
  };

  const normalizeInt = (value: string, maxLen = 3) => {
    const onlyDigits = value.replace(/\D/g, "");
    return onlyDigits.slice(0, maxLen);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // teléfono 9 dígitos
    if (name === "telefono") {
      const cut = normalizeInt(value, 9);
      setForm((p) => ({ ...p, telefono: cut }));
      return;
    }

    // ejes (0-180)
    if (name === "odEje" || name === "oiEje") {
      const v = normalizeInt(value, 3);
      setForm((p) => ({ ...p, [name]: v }));
      return;
    }

    // DIP/ADD/ESF/CYL (decimales)
    const decimalFields = [
      "dip",
      "add",
      "odEsf",
      "odCyl",
      "oiEsf",
      "oiCyl",
    ];
    if (decimalFields.includes(name)) {
      setForm((p) => ({ ...p, [name]: normalizeDecimal(value) }));
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

    // ✅ convertir strings a number donde toque (para el backend)
    const payload: any = {
      ...form,
      tipoDoc,
      dip: form.dip ? Number(form.dip) : undefined,
      add: form.add ? Number(form.add) : undefined,

      odEsf: form.odEsf ? Number(form.odEsf) : undefined,
      odCyl: form.odCyl ? Number(form.odCyl) : undefined,
      odEje: form.odEje ? Number(form.odEje) : undefined,

      oiEsf: form.oiEsf ? Number(form.oiEsf) : undefined,
      oiCyl: form.oiCyl ? Number(form.oiCyl) : undefined,
      oiEje: form.oiEje ? Number(form.oiEje) : undefined,
    };

    await addClient(payload);
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
        {/* DATOS */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

          <BaseInput
            label="Teléfono"
            name="telefono"
            value={form.telefono || ""}
            placeholder="999888777"
            onChange={onChange}
            pattern={form.telefono?.length === 9 ? "^\\d{9}$" : undefined}
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

        {/* MEDIDAS */}
        <div className="mt-8 rounded-xl border border-gray-3 bg-gray-1 p-5">
          <h3 className="mb-4 text-base font-semibold text-dark">
            Especificaciones de las Medidas
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <BaseInput
              label="DIP"
              name="dip"
              value={form.dip || ""}
              placeholder="63"
              onChange={onChange}
            />

            <BaseInput
              label="ADD"
              name="add"
              value={form.add || ""}
              placeholder="1.50"
              onChange={onChange}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* OD */}
            <div className="rounded-xl border border-gray-3 bg-white p-4">
              <h4 className="mb-3 text-sm font-semibold text-dark">Ojo Derecho (OD)</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <BaseInput
                  label="ESF"
                  name="odEsf"
                  value={form.odEsf || ""}
                  placeholder="-1.25"
                  onChange={onChange}
                />
                <BaseInput
                  label="CYL"
                  name="odCyl"
                  value={form.odCyl || ""}
                  placeholder="-0.50"
                  onChange={onChange}
                />
                <BaseInput
                  label="EJE"
                  name="odEje"
                  value={form.odEje || ""}
                  placeholder="90"
                  onChange={onChange}
                />
              </div>
            </div>

            {/* OI */}
            <div className="rounded-xl border border-gray-3 bg-white p-4">
              <h4 className="mb-3 text-sm font-semibold text-dark">Ojo Izquierdo (OI)</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <BaseInput
                  label="ESF"
                  name="oiEsf"
                  value={form.oiEsf || ""}
                  placeholder="-1.00"
                  onChange={onChange}
                />
                <BaseInput
                  label="CYL"
                  name="oiCyl"
                  value={form.oiCyl || ""}
                  placeholder="-0.75"
                  onChange={onChange}
                />
                <BaseInput
                  label="EJE"
                  name="oiEje"
                  value={form.oiEje || ""}
                  placeholder="80"
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-dark-5">
            * Si aún no tienes las medidas, puedes dejarlo vacío y registrarlo luego.
          </p>
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